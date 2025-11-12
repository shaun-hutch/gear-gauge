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
    // HealthKit store to access data
    // Use a single `HKHealthStore` instance per service for querying/authorization.
    private let healthStore = HKHealthStore()

    // types we want to read
    // These are the HealthKit object types the service will request read access to.
    // - `workoutType()` for the workout records themselves
    // - `distanceWalkingRunning` and `distanceCycling` quantities to read distances
    // Note: force-unwrapping quantity types is acceptable here because the identifiers exist
    // on platforms where HealthKit is available.
    private let typesToRead: Set<HKObjectType> = [
        HKObjectType.workoutType(),
        HKObjectType.quantityType(forIdentifier: .distanceWalkingRunning)!,
        HKObjectType.quantityType(forIdentifier: .distanceCycling)!
    ]

    // MARK: - Public state
    /// If background delivery of workout data is available from HealthKit
    /// - Updated when we attempt to enable background delivery; consumers can show UI accordingly.
    var backgroundDeliveryAvailable: Bool

    /// If the user has granted HealthKit access to the requested types
    /// - This mirrors the authorization state for the types the service cares about.
    /// - Keep this lightweight so UI code can check quickly without calling the HealthStore.
    var hasAccess: Bool

    // MARK: - Init
    init() {
        // Default to conservative values; checkHealthKitAvailability() will update them.
        backgroundDeliveryAvailable = false
        hasAccess = false

        // Perform an initial availability/authorization check.
        // This sets `hasAccess` and attempts to enable background delivery if authorized.
        checkHealthKitAvailability()
    }

    // MARK: - Protocol conformance
    /// Requests permission to access workout data from HealthKit
    /// NOTE: This was implemented using an async continuation so callers can `await` authorization.
    /// - Throws: `HealthKitError.notAvailable` if HealthKit is not present, or underlying errors
    ///           propagated by HealthKit's completion handler.
    func requestAccess() async throws {
        // Respect task cancellation early
        try Task.checkCancellation()

        // Ensure HealthKit is available on the device (watch/some iPad/iPhone variants may not support it)
        guard HKHealthStore.isHealthDataAvailable() else {
            hasAccess = false
            throw HealthKitError.notAvailable
        }

        // `requestAuthorization` uses a completion handler. Bridge it to async/await with a
        // checked continuation so misuse is caught in debug builds.
        let success: Bool = try await withCheckedThrowingContinuation { (continuation: CheckedContinuation<Bool, Error>) in
            healthStore.requestAuthorization(toShare: nil, read: typesToRead) { success, error in
                // If HealthKit returns an error, resume throwing that error
                if let error = error {
                    continuation.resume(throwing: error)
                    return
                }
                // Otherwise resume with the boolean result indicating if authorization was granted
                continuation.resume(returning: success)
            }
        }
        
        let actualStatus = healthStore.authorizationStatus(for: HKObjectType.workoutType())
        let actualAccess = (actualStatus == .sharingAuthorized)
        
        print("hasAccess: \(success)")

        // Update local state for fast UI checks
        hasAccess = success

        // If access granted, attempt to enable background delivery (non-blocking best-effort)
        if success {
            enableBackgroundDelivery()
        }
    }

    /// Fetches all workouts (or use the convenience overload to fetch since a date)
    /// - This simply forwards to the `since:` overload with `nil` to return everything.
    func fetchWorkouts() async throws -> [Workout] {
        return try await fetchWorkouts(since: nil)
    }

    /// Observes HealthKit for new or updated workouts and yields arrays of mapped `Workout` objects.
    /// - The returned `AsyncStream` will start an `HKObserverQuery` when created and stop it when
    ///   the stream finishes or is cancelled. Each time HealthKit notifies the observer, the
    ///   stream fetches current workouts (via `fetchWorkouts()`) and yields them to subscribers.
    /// - Consumers should persist results and deduplicate by `Workout.healthKitUUID`.
    func observeWorkouts() -> AsyncStream<[Workout]> {
        return AsyncStream { continuation in
            // If HealthKit isn't available, finish the stream immediately
            guard HKHealthStore.isHealthDataAvailable() else {
                continuation.finish()
                return
            }

            // Observe workout changes using an HKObserverQuery (low-power notification mechanism)
            let sampleType = HKObjectType.workoutType()

            let observerQuery = HKObserverQuery(sampleType: sampleType, predicate: nil) { [weak self] _, completionHandler, error in
                // Use a weak capture to avoid retaining self beyond the lifetime of the service
                guard let self = self else {
                    // Inform HealthKit we're done handling the update
                    completionHandler()
                    return
                }

                // On update, asynchronously fetch the latest workouts and yield them
                Task {
                    do {
                        // Use the public `fetchWorkouts()` entry point — which handles permissions.
                        let workouts = try await self.fetchWorkouts()
                        continuation.yield(workouts)
                    } catch {
                        // Don't terminate the stream on fetch errors; log for debugging.
                        // Consumers may prefer to call `fetchWorkouts()` directly when they need it.
                        print("HealthKit observer fetch error: \(error)")
                    }
                    // Must call the completion handler to inform HealthKit that processing is done
                    completionHandler()
                }
            }

            // Execute the observer query. The HKHealthStore retains the query while it's executing.
            self.healthStore.execute(observerQuery)

            // Ensure the query is stopped when the AsyncStream is terminated (cleanup)
            continuation.onTermination = { @Sendable _ in
                self.healthStore.stop(observerQuery)
            }
        }
    }

    // MARK: - Public convenience
    /// Fetch workouts from HealthKit starting from `since` (if provided). Returns mapped `Workout` model objects.
    /// - `since` parameter enables importing historical workouts when creating a gear item from a start date.
    /// - The mapping converts meters to kilometres and preserves `HKWorkout` metadata used by the app.
    func fetchWorkouts(since: Date?) async throws -> [Workout] {
        // Ensure HealthKit is available; otherwise bail early
        guard HKHealthStore.isHealthDataAvailable() else {
            throw HealthKitError.notAvailable
        }

        // Double-check authorization if local `hasAccess` isn't set; throw a friendly error otherwise
        if !hasAccess {
            let status = healthStore.authorizationStatus(for: HKObjectType.workoutType())
            if status != .sharingAuthorized {
                // The caller should call `requestAccess()` first; this error indicates access wasn't granted
                throw HealthKitError.authorizationNotGranted
            } else {
                // If HealthKit says we're authorized, update our cached flag
                hasAccess = true
            }
        }

        // Build an optional predicate to limit results to samples starting at `since`
        let sampleType = HKObjectType.workoutType()
        // Sort ascending by start date to provide predictable results for imports
        let sortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: true)

        // Bridge the callback-based `HKSampleQuery` to async/await using a checked continuation
        // The continuation must be resumed exactly once; use the throwing variation because
        // the query can fail with an error.
        return try await withCheckedThrowingContinuation { (continuation: CheckedContinuation<[Workout], Error>) in
            let query = HKSampleQuery(sampleType: sampleType, predicate: nil, limit: HKObjectQueryNoLimit, sortDescriptors: [sortDescriptor]) { _, results, error in
                // If HealthKit returned an error, propagate it via the continuation
                if let error = error {
                    continuation.resume(throwing: error)
                    return
                }

                // Cast the results to HKWorkout; if cast fails, return an empty array (no workouts)
                guard let hkWorkouts = results as? [HKWorkout] else {
                    continuation.resume(returning: [])
                    return
                }

                // Map HKWorkout -> app `Workout` model. Keep mapping logic simple and deterministic.
                let mapped: [Workout] = hkWorkouts.compactMap { hk in
                    // Convert meters to kilometres for app storage
                    let meters = hk.totalDistance?.doubleValue(for: HKUnit.meter()) ?? 0.0
                    let kilometres = meters / 1000.0

                    // Create the SwiftData `Workout` model. It stores `healthKitUUID` so
                    // the datastore can enforce uniqueness and deduplication.
                    return Workout(
                        healthKitUUID: hk.uuid,
                        activityType: hk.workoutActivityType,
                        totalDistance: kilometres,
                        startDate: hk.startDate,
                        endDate: hk.endDate,
                        isIndoor: self.isIndoor(hkWorkout: hk)
                    )
                }

                // Resume the continuation with the mapped workouts
                continuation.resume(returning: mapped)
            }

            // Execute the query (HealthKit will asynchronously call the query's completion block)
            self.healthStore.execute(query)
        }
    }

    // MARK: - Public helpers
    /// Returns the current authorization status for workout data from HealthKit
    /// NOTE: Maps HealthKit's `HKAuthorizationStatus` to the app's provider-agnostic `AuthorizationStatus`.
    /// - Consumers should use the returned `AuthorizationStatus` instead of importing HealthKit.
    func authorizationStatus() -> AuthorizationStatus {
        // If HealthKit is not present, treat as notDetermined so UI can handle gracefully
        guard HKHealthStore.isHealthDataAvailable() else { return .notDetermined }

        let hkStatus = healthStore.authorizationStatus(for: HKObjectType.workoutType())
        switch hkStatus {
        case .notDetermined:
            return .notDetermined
        case .sharingAuthorized:
            return .authorized
        case .sharingDenied:
            return .denied
        @unknown default:
            // Any future/unknown value is treated as restricted conservatively
            return .restricted
        }
    }

    // MARK: - Private Helpers
    // checkHealthKitAvailability: initial availability and authorization check added so
    // the service can reflect `hasAccess` and attempt background delivery on startup.
    private func checkHealthKitAvailability() {
        guard HKHealthStore.isHealthDataAvailable() else {
            print("HealthKit is not available on this device")
            hasAccess = false
            backgroundDeliveryAvailable = false
            return
        }

        // Query HealthKit's authorization status for workouts and set `hasAccess` accordingly
        let status = healthStore.authorizationStatus(for: HKObjectType.workoutType())
        hasAccess = (status == .sharingAuthorized)

        // If already authorized, try to enable background delivery (best-effort)
        if hasAccess {
            enableBackgroundDelivery()
        }
    }

    // enableBackgroundDelivery: best-effort attempt to enable background delivery for workout samples.
    // - Note: This is not required for fetching; it only enables HealthKit to notify the app in the background
    //         when new samples arrive. Failures are logged and `backgroundDeliveryAvailable` is updated.
    private func enableBackgroundDelivery() {
        let sampleType = HKObjectType.workoutType()
        healthStore.enableBackgroundDelivery(for: sampleType, frequency: .immediate) { success, error in
            if let error = error {
                // Non-fatal; log to help debugging but keep the app functional.
                print("Failed to enable HealthKit background delivery: \(error)")
            }
            // Update the flag so callers can see whether background delivery is available
            self.backgroundDeliveryAvailable = success
        }
    }

    // Helper to determine whether a HKWorkout is indoor based on metadata
    private func isIndoor(hkWorkout: HKWorkout) -> Bool {
        if let metadata = hkWorkout.metadata,
           let indoor = metadata[HKMetadataKeyIndoorWorkout] as? Bool {
            return indoor
        }
        return false
    }

    // MARK: - Errors
    // Small, internal error enum to represent the most common failure modes for this service
    enum HealthKitError: Error {
        /// HealthKit framework not available on this device
        case notAvailable
        /// Authorization has not been granted for workouts
        case authorizationNotGranted
    }
}
