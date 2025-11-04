//
//  Workout.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 03/11/2025.
//

import HealthKit
import SwiftData
import SwiftUI

@Model
final class Workout: BaseEntity {
    // MARK: Audit properties
    /// unique identifier
    var id: UUID
    /// date which entity was created
    var createdDate: Date?
    /// date which entity was last updated
    var lastUpdatedDate: Date?
    /// version of the most recent change to tne entity
    var version: Int
    /// if the entity is marked as deleted
    var isDeleted: Bool

    // MARK: Main properties
    /// HealthKit UUID for this workout (for deduplication)
    @Attribute(.unique) var healthKitUUID: UUID
    /// Distance covered in kilometers (matches HealthKit's Double precision)
    var totalDistance: Double
    /// When the workout started
    var startDate: Date
    /// When the workout ended
    var endDate: Date
    /// Activity type of the healthKit (indoor running, indoor cycling, etc...)
    var workoutActivityType: HKWorkoutActivityType
    /// If the workout is an indoor one (defined by checking if specific metadata exists)
    var isIndoor: Bool

    // MARK: - Relationships
    /// The gear item (or items) used for this workout
    var gear: [Gear]

    // MARK: - Initialization
    init(
        id: UUID = UUID(),
        healthKitUUID: UUID,
        workoutType: String,
        totalDistance: Double,
        startDate: Date,
        endDate: Date,
        gear: [Gear] = []
    ) {
        self.id = id
        self.createdDate = Date()
        self.lastUpdatedDate = Date()
        self.version = 1
        self.healthKitUUID = healthKitUUID
        self.totalDistance = totalDistance
        self.startDate = startDate
        self.endDate = endDate
        self.gear = gear
    }

    // MARK: Computed properties
    // Map the string-based `workoutType` to a `WorkoutType` value used for gear logic.
    var workoutType: WorkoutType {
        switch workoutActivityType {
        case .running:
            return isIndoor ? WorkoutType.indoorRun : WorkoutType.outdoorRun
        case .walking:
            return isIndoor ? WorkoutType.indoorWalk : WorkoutType.outdoorWalk
        case .cycling:
            return isIndoor ? WorkoutType.indoorCycle : WorkoutType.outdoorCycle
        case .other:
        default:
            return WorkoutType.other
        }
    }

}

// MARK: Extensions
extension Workout {
    func isIndoor(hkWorkout: HKWorkout) -> Bool {
        if let metadata = hkWorkout.metadata,
            let isIndoor = metadata[HKMetadataKeyIndoorWorkout] as? Bool
        {
            return isIndoor
        }
        return false
    }
}
