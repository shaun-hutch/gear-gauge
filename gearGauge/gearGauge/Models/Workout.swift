//
//  Workout.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 03/11/2025.
//

import HealthKit
import SwiftData
import SwiftUI

@available(iOS 26, *)
@Model
final class Workout: BaseEntity {
    // MARK: Main properties
    /// HealthKit UUID for this workout (for deduplication)
    @Attribute(.unique) var healthKitUUID: UUID
    /// Distance covered in kilometers (matches HealthKit's Double precision)
    var totalDistance: Double
    /// When the workout started
    var startDate: Date
    /// When the workout ended
    var endDate: Date
    /// Activity type raw value from HealthKit (stored as UInt for SwiftData compatibility)
    private var workoutActivityTypeRawValue: UInt
    /// If the workout is an indoor one (defined by checking if specific metadata exists)
    var isIndoor: Bool
    
    /// Activity type of the HealthKit workout (computed from raw value)
    /// SwiftData cannot store enums, just primitive values
    var workoutActivityType: HKWorkoutActivityType {
        get {
            HKWorkoutActivityType(rawValue: workoutActivityTypeRawValue) ?? .other
        }
        set {
            workoutActivityTypeRawValue = newValue.rawValue
        }
    }

    // MARK: - Relationships
    /// The gear item (or items) used for this workout
    var gear: [Gear]

    // MARK: - Initialization
    init(
        healthKitUUID: UUID,
        activityType: HKWorkoutActivityType,
        totalDistance: Double,
        startDate: Date,
        endDate: Date,
        isIndoor: Bool = false,
        gear: [Gear] = []
    ) {
        self.healthKitUUID = healthKitUUID
        self.workoutActivityTypeRawValue = activityType.rawValue
        self.totalDistance = totalDistance
        self.startDate = startDate
        self.endDate = endDate
        self.isIndoor = isIndoor
        self.gear = gear
        
        // Call parent initializer with defaults
        super.init()
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
