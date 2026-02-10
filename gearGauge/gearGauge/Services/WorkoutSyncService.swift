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
        
        // Also check existing workouts for assignment to new/modified gear
        if !existingWorkouts.isEmpty {
            try await assignWorkoutsToGear(existingWorkouts)
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
        // Fetch gear that should receive workout assignments:
        // - Active gear (isActive == true)
        // - Historic/retired gear that has an endDate set
        let eligibleGear = try gearStore.fetchAll().filter { $0.isActive || $0.endDate != nil }
        
        // Track which gear received workouts for notification
        var affectedWorkouts: Set<Workout> = []
        
        for gear in eligibleGear {
            // Filter workouts within the gear's date range
            let matchingWorkouts = workouts.filter { workout in
                // 1. Not already assigned to this gear
                guard !workout.gear.contains(where: { $0.id == gear.id }) else { return false }
                
                // 2. Workout type matches gear's supported types
                guard gear.workoutTypes.contains(workout.workoutType) else { return false }
                
                // 3. Workout is within the gear's active date range
                // Use calendar comparison to handle timezone differences
                let calendar = Calendar.current
                
                // Compare dates at day level
                let isAfterStart = calendar.compare(workout.startDate, to: gear.startDate, toGranularity: .day) != .orderedAscending
                
                let isBeforeEnd: Bool
                if let endDate = gear.endDate {
                    isBeforeEnd = calendar.compare(workout.startDate, to: endDate, toGranularity: .day) != .orderedDescending
                } else {
                    isBeforeEnd = true
                }
                
                return isAfterStart && isBeforeEnd
            }
        
            for wo in matchingWorkouts {
                assignWorkoutToGear(wo, gear)
                // Rely on Set uniqueness; inserting an existing workout is a no-op
                affectedWorkouts.insert(wo)
            }
            
        }
        
        return Array(affectedWorkouts)
    }
    
    /// Assigns a workout to a specific gear item
    /// Distance is automatically computed from the gear's workouts, so no manual increment needed
    /// Note: This method is @MainActor-bound, so concurrent assignments are serialized
    private func assignWorkoutToGear(_ workout: Workout, _ gear: Gear) {
        
        // MARK: - Relationship Linking
        // NOTE: This is a Many-to-Many relationship.
        // By adding the 'gear' to the 'workout.gear' array, SwiftData AUTOMATICALLY
        // updates the inverse relationship (gear.workouts) to include this workout.
        // We do not need to manually do: gear.workouts.append(workout)
        workout.gear.append(gear)
        gear.markAsUpdated()
        
        // Update the cached total workout distance after the relationship is established
        // This happens before the context save, so if save fails, the cache will be rolled back with the context
        gear.cachedTotalWorkoutDistance += workout.totalDistance
        
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
