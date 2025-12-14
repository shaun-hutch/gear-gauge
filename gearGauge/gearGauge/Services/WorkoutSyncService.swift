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
        
        guard !newWorkouts.isEmpty else {
            print("✅ No new workouts to sync")
            updateLastSyncDate()
            return 0
        }
        
        print("📊 Found \(newWorkouts.count) new workouts")
        
        // Assign workouts to gear and save
        try await assignWorkoutsToGear(newWorkouts)
        
        // Save all new workouts in bulk
        try workoutStore.createBulk(workouts: newWorkouts)
        
        // Update last sync date
        updateLastSyncDate()
        
        print("✅ Synced \(newWorkouts.count) workouts")
        return newWorkouts.count
    }
    
    /// Assigns workouts to appropriate gear based on workout type and date
    /// Updates gear distance traveled
    private func assignWorkoutsToGear(_ workouts: [Workout]) async throws {
        // Fetch all active gear
        let allGear = try gearStore.fetchActive()
        
        for gear in allGear {
            // filter workouts based on type and startDate
            let matchingWorkouts = workouts.filter { workout in
                !workout.gear.contains(where: { $0.id == gear.id }) &&
                gear.workoutTypes.contains(workout.workoutType) &&
                gear.startDate <= workout.startDate &&
                (gear.endDate == nil || gear.endDate! >= workout.endDate)
            }
            
            print("matching workout count: \(matchingWorkouts.count)")
        
            for wo in matchingWorkouts {
                assignWorkoutToGear(wo, gear)
            }
            
        }
    }
    
    /// Assigns a workout to a specific gear item and updates the gear's distance
    private func assignWorkoutToGear(_ workout: Workout, _ gear: Gear) {
        
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
