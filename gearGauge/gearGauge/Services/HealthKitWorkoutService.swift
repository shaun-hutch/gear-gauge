//
//  WorkoutService.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 06/11/2025.
//

final class HealthKitWorkoutService: WorkoutServiceProtocol {
    
    // swift userDefaults to check if background delivery is available and has access
    // leverage HealthKit to fetch workouts and observe changes
    // use workoutStore to save workouts to the data store
    
    init() {
        backgroundDeliveryAvailable = false
        hasAccess = false
    }
    
    var backgroundDeliveryAvailable: Bool
    
    var hasAccess: Bool
    
    func requestAccess() async throws -> Bool {
        return false
    }
    
    func fetchWorkouts() async throws -> [Workout] {
        return []
    }
    
    func observeWorkouts() -> AsyncStream<[Workout]> {
        return AsyncStream { continuation in
        }
    }
    
    
    // leverage the protocol to load workouts from a data source (HealthKit, Garmin, etc)
}
