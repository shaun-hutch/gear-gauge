//
//  WorkoutServiceProtocol.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 06/11/2025.
//

protocol WorkoutServiceProtocol {
    /// If the user has granted access to the workout data, or third party provider
    var hasAccess: Bool { get }
    
    /// If background delivery of workout data is available from the data source
    var backgroundDeliveryAvailable: Bool { get }
    
    /// Requests permission to access workout data from the provider
    /// - Returns: True if access was granted, false otherwise
    /// - Throws: An error if the request fails
    func requestAccess() async throws -> Bool
    
    /// Fetches all workouts from the data source
    /// - Returns: Array of Workout objects from the provider
    /// - Throws: An error if fetching fails or access is denied
    func fetchWorkouts() async throws -> [Workout]
    
    /// Observes the data source for new or updated workouts
    /// - Returns: AsyncStream that emits updated workout arrays when changes occur
    func observeWorkouts() -> AsyncStream<[Workout]>

}
