//
//  WorkoutSyncService.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 15/12/2025.
//
import Foundation

@MainActor
final class WorkoutSyncService : WorkoutSyncServiceProtocol {
    
    // MARK: - Dependencies
    
    private let workoutService: WorkoutServiceProtocol
    private let workoutStore: WorkoutStoreProtocol
    private let gearStore: GearStoreProtocol
    
    // MARK: - State
    
    /// Indicates if a sync is currently in progress
    var isSyncing: Bool = false
    
    /// Last successful sync date
    private(set) var lastSyncDate: Date?
    
    // MARK: - Initialization
    
    init(
        workoutService: WorkoutServiceProtocol,
        workoutStore: WorkoutStoreProtocol,
        gearStore: GearStoreProtocol
    ) {
        self.workoutService = workoutService
        self.workoutStore = workoutStore
        self.gearStore = gearStore
        
        // Load last sync date from UserDefaults
        self.lastSyncDate = UserDefaultsService.get(forKey: Constants.lastWorkoutSyncDate)
    }
    
    
    
    /// Performs a full sync of workouts from HealthKit
    /// Fetches new workouts since last sync and assigns them to appropriate gear
    /// - Returns: Number of new workouts synced
    @discardableResult
    func syncWorkouts() async throws -> Int {
        guard !isSyncing else {
            print("⚠️ Sync already in progress")
            return 0
        }
        
        isSyncing = true
        defer { isSyncing = false }
        
        print("🔄 Starting workout sync...")
        
        // Fetch workouts from HealthKit (only new ones if we have a last sync date)
        let healthKitWorkouts = try await workoutService.fetchWorkouts()
        
        // Get existing workout UUIDs to avoid duplicates
        let existingWorkouts = try workoutStore.fetchAll()
        let existingUUIDs = Set(existingWorkouts.map { $0.healthKitUUID })
        
        // Filter out workouts we already have
        let newWorkouts = healthKitWorkouts.filter { !existingUUIDs.contains($0.healthKitUUID) }
        
        print("📊 Found \(newWorkouts.count) new workouts from HealthKit")
        
        // Assign new workouts to gear and save them
        if !newWorkouts.isEmpty {
            let addedWorkoutCount = try await assignWorkoutsToGear(newWorkouts)
            
            // Save all new workouts in bulk
            try workoutStore.createBulk(workouts: newWorkouts)
            
            print("✅ Synced \(newWorkouts.count) new workouts")
            
            // Send notification about synced workouts
            await NotificationService.shared.sendWorkoutSyncNotification(
                count: addedWorkoutCount.count
            )
        }
        
        // Also check for existing workouts that have no gear assigned
        // (This handles cases where gear was added/modified after workouts were synced)
        let unassignedWorkouts = existingWorkouts.filter { $0.gear.isEmpty }
        
        if !unassignedWorkouts.isEmpty {
            print("🔍 Found \(unassignedWorkouts.count) unassigned workouts, attempting to assign...")
            try await assignWorkoutsToGear(unassignedWorkouts)
        }
        
        // Update last sync date
        updateLastSyncDate()
        
        return newWorkouts.count
    }
    
    /// Assigns workouts to appropriate gear based on workout type and date
    /// Updates gear distance traveled
    /// - Parameter workouts: Array of workouts to assign
    /// - Returns: Array of workouts that were assigned to gear (for notification or further processing)
    @discardableResult
    private func assignWorkoutsToGear(_ workouts: [Workout]) async throws -> [Workout] {
        // Fetch all gear (including historic gear with end dates)
        let allGear = try gearStore.fetchAll()
        
        // Track which gear received workouts for notification
        var affectedWorkouts: Set<Workout> = []
        
        for gear in allGear {
            // filter workouts based on type and startDate
            let matchingWorkouts = workouts.filter { workout in
                !workout.gear.contains(where: { $0.id == gear.id }) &&
                gear.workoutTypes.contains(workout.workoutType) &&
                gear.startDate <= workout.startDate &&
                (gear.endDate == nil || gear.endDate! >= workout.startDate)
            }
            
            print("matching workout count: \(matchingWorkouts.count)")
        
            for wo in matchingWorkouts {
                assignWorkoutToGear(wo, gear)
                // Rely on Set uniqueness; inserting an existing workout is a no-op
                affectedWorkouts.insert(wo)
            }
            
        }
        
        return Array(affectedWorkouts)
    }
    
    /// Assigns a workout to a specific gear item and updates the gear's distance
    private func assignWorkoutToGear(_ workout: Workout, _ gear: Gear) {
        
        // MARK: - Relationship Linking
        // NOTE: This is a Many-to-Many relationship.
        // By adding the 'gear' to the 'workout.gear' array, SwiftData AUTOMATICALLY
        // updates the inverse relationship (gear.workouts) to include this workout.
        // We do not need to manually do: gear.workouts.append(workout)
        workout.gear.append(gear)
        gear.currentDistance += workout.totalDistance
        gear.markAsUpdated()
        print("📍 Assigned workout to gear: \(gear.name)")
    }
    
    /// Updates the last sync date to now
    private func updateLastSyncDate() {
        lastSyncDate = Date()
        UserDefaultsService.set(value: lastSyncDate, forKey: Constants.lastWorkoutSyncDate)
    }
    
    func startObserving() -> Task<Void, Never> {
        Task {
            for await _ in workoutService.observeWorkouts() {
                print("📢 HealthKit workout update detected")
                let result = try? await syncWorkouts()
                print("Workout sync result: \(String(describing: result))")
            }
        }
    }
    
    
}
