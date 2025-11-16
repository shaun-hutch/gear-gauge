//
//  WorkoutService.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 06/11/2025.
//

import Foundation
import HealthKit

@MainActor
final class HealthKitWorkoutService: WorkoutServiceProtocol {
    // MARK: - Properties
    
    /// HealthKit store instance for querying workout data
    private let healthStore = HKHealthStore()
    
    /// HealthKit object types we request read access to
    /// Note: Only requesting workoutType - distance data is included with workouts
    private let typesToRead: Set<HKObjectType> = [
        HKObjectType.workoutType()
    ]
    
    // MARK: - Public State
    
    /// Indicates if background delivery has been successfully enabled
    /// Updated after calling enableBackgroundDelivery()
    var backgroundDeliveryAvailable: Bool = false
    
    // MARK: - Initialization
    
    init() {
        // No upfront checks - authorization state is meaningless until user takes action
    }
    
    // MARK: - Protocol Conformance
    
    /// Requests HealthKit authorization to read workout data
    /// Shows the system permission sheet to the user
    /// 
    /// **Important**: Due to HealthKit's privacy design, this method cannot determine
    /// if the user granted or denied permission. It only indicates the authorization
    /// flow completed. Actual access is verified when fetching workouts.
    /// 
    /// - Throws: `HealthKitError.notAvailable` if HealthKit is not present on device
    func requestAccess() async throws {
        try Task.checkCancellation()
        
        // Only reliable check: is HealthKit available on this device?
        guard HKHealthStore.isHealthDataAvailable() else {
            throw HealthKitError.notAvailable
        }
        
        print("📱 Requesting HealthKit authorization...")
        
        // Show system permission sheet
        try await withCheckedThrowingContinuation { (continuation: CheckedContinuation<Void, Error>) in
            healthStore.requestAuthorization(toShare: nil, read: typesToRead) { success, error in
                if let error = error {
                    print("❌ HealthKit authorization error: \(error.localizedDescription)")
                    continuation.resume(throwing: error)
                    return
                }
                
                print("✅ HealthKit authorization sheet dismissed")
                continuation.resume()
            }
        }
        
        // Best-effort: enable background delivery (fails silently if no access)
        enableBackgroundDelivery()
    }
    
    /// Fetches all workouts from HealthKit
    /// Convenience method that fetches all workouts without date filtering
    /// 
    /// **Note**: If the user denied HealthKit access, this will return an empty array
    /// with no error. This is HealthKit's privacy-preserving behavior - the app cannot
    /// distinguish between "no access" and "no workout data".
    /// 
    /// - Returns: Array of Workout objects mapped from HealthKit data
    /// - Throws: `HealthKitError.notAvailable` if HealthKit unavailable on device
    func fetchWorkouts() async throws -> [Workout] {
        return try await fetchWorkouts(since: nil)
    }
    
    /// Fetches workouts from HealthKit, optionally filtered by start date
    /// 
    /// **Note**: If the user denied HealthKit access, this will return an empty array
    /// with no error. This is HealthKit's privacy-preserving behavior - the app cannot
    /// distinguish between "no access" and "no workout data".
    /// 
    /// - Parameter since: Optional start date to filter workouts (nil = fetch all)
    /// - Returns: Array of Workout objects mapped from HealthKit data
    /// - Throws: `HealthKitError.notAvailable` if HealthKit unavailable on device
    func fetchWorkouts(since: Date?) async throws -> [Workout] {
        // Only check device capability, not authorization status
        guard HKHealthStore.isHealthDataAvailable() else {
            throw HealthKitError.notAvailable
        }
        
        // Build query components
        let sampleType = HKObjectType.workoutType()
        let sortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: true)
        
        // Optional: filter by date if provided
        var predicate: NSPredicate?
        if let since = since {
            predicate = HKQuery.predicateForSamples(
                withStart: since,
                end: Date(),
                options: .strictStartDate
            )
        }
        
        print("📊 Fetching workouts from HealthKit...")
        
        // Execute query and map results
        return try await withCheckedThrowingContinuation { (continuation: CheckedContinuation<[Workout], Error>) in
            let query = HKSampleQuery(
                sampleType: sampleType,
                predicate: predicate,
                limit: HKObjectQueryNoLimit,
                sortDescriptors: [sortDescriptor]
            ) { _, results, error in
                // Only system errors are returned here, not authorization denials
                if let error = error {
                    print("❌ HealthKit query error: \(error)")
                    continuation.resume(throwing: error)
                    return
                }
                
                // Cast results to HKWorkout array
                guard let hkWorkouts = results as? [HKWorkout] else {
                    print("⚠️ No workouts returned (either no data or access denied)")
                    continuation.resume(returning: [])
                    return
                }
                
                print("✅ Fetched \(hkWorkouts.count) workouts from HealthKit")
                
                // Map HKWorkout to app's Workout model
                let mapped: [Workout] = hkWorkouts.compactMap { hk in
                    // Convert meters to kilometres
                    let meters = hk.totalDistance?.doubleValue(for: HKUnit.meter()) ?? 0.0
                    let kilometres = meters / 1000.0
                    
                    return Workout(
                        healthKitUUID: hk.uuid,
                        activityType: hk.workoutActivityType,
                        totalDistance: kilometres,
                        startDate: hk.startDate,
                        endDate: hk.endDate,
                        isIndoor: self.isIndoor(hkWorkout: hk)
                    )
                }
                
                continuation.resume(returning: mapped)
            }
            
            self.healthStore.execute(query)
        }
    }
    
    /// Observes HealthKit for new or updated workouts
    /// Returns an AsyncStream that yields workout arrays when HealthKit data changes
    /// 
    /// The stream automatically starts an HKObserverQuery when created and stops it
    /// when the stream is cancelled or finishes.
    func observeWorkouts() -> AsyncStream<[Workout]> {
        return AsyncStream { continuation in
            guard HKHealthStore.isHealthDataAvailable() else {
                continuation.finish()
                return
            }
            
            let sampleType = HKObjectType.workoutType()
            
            let observerQuery = HKObserverQuery(sampleType: sampleType, predicate: nil) { [weak self] _, completionHandler, error in
                guard let self = self else {
                    completionHandler()
                    return
                }
                
                Task {
                    do {
                        let workouts = try await self.fetchWorkouts()
                        continuation.yield(workouts)
                    } catch {
                        print("⚠️ HealthKit observer fetch error: \(error)")
                    }
                    completionHandler()
                }
            }
            
            self.healthStore.execute(observerQuery)
            
            continuation.onTermination = { @Sendable _ in
                self.healthStore.stop(observerQuery)
            }
        }
    }
    
    // MARK: - Private Helpers
    
    /// Attempts to enable background delivery for workout updates
    /// This is a best-effort operation - failures are logged but not thrown
    /// Updates backgroundDeliveryAvailable flag based on result
    private func enableBackgroundDelivery() {
        let sampleType = HKObjectType.workoutType()
        
        healthStore.enableBackgroundDelivery(for: sampleType, frequency: .immediate) { success, error in
            if let error = error {
                print("⚠️ Failed to enable HealthKit background delivery: \(error)")
            } else if success {
                print("✅ HealthKit background delivery enabled")
            }
            
            self.backgroundDeliveryAvailable = success
        }
    }
    
    /// Determines if a workout was performed indoors based on HealthKit metadata
    private func isIndoor(hkWorkout: HKWorkout) -> Bool {
        if let metadata = hkWorkout.metadata,
           let indoor = metadata[HKMetadataKeyIndoorWorkout] as? Bool {
            return indoor
        }
        return false
    }
    
    // MARK: - Errors
    
    /// Errors specific to HealthKit workout operations
    enum HealthKitError: Error {
        /// HealthKit framework not available on this device (e.g., iPad)
        case notAvailable
    }
}
