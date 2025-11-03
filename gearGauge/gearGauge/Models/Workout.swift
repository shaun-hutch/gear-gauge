//
//  Workout.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 03/11/2025.
//

import SwiftUI
import SwiftData
import HealthKit

@Model
final class Workout: BaseEntity {
    // MARK: audit properties
    /// unique identifier
    var id: UUID
    /// date which entity was created
    var createdDate: Date?
    /// date which entity was last updated
    var lastUpdatedDate: Date?
    /// version of the most recent change to tne entity
    var version: Int
    
    // MARK: main properties
    /// HealthKit UUID for this workout (for deduplication)
    @Attribute(.unique) var healthKitUUID: UUID
    /// Type of workout (running, cycling, etc.)
    var workoutType: String
    /// Distance covered in kilometers (matches HealthKit's Double precision)
    var distance: Double
    /// When the workout started
    var startDate: Date
    /// When the workout ended
    var endDate: Date
    
    // MARK: - Relationships
    /// The gear item used for this workout (optional)
    var gear: Gear?
    
    // MARK: - Initialization
    init(
        id: UUID = UUID(),
        healthKitUUID: UUID,
        workoutType: String,
        distance: Double,
        startDate: Date,
        endDate: Date,
        duration: TimeInterval,
        gear: Gear? = nil
    ) {
        self.id = id
        self.createdDate = Date()
        self.lastUpdatedDate = Date()
        self.version = 1
        self.healthKitUUID = healthKitUUID
        self.workoutType = workoutType
        self.distance = distance
        self.startDate = startDate
        self.endDate = endDate
        self.gear = gear
    }
    
    // MARK: Computed properties
    var workoutTypeGearValue: WorkoutType {
        switch workoutType {
            case "Running":
            return .indoorRun
        default:
            return .running
        }
    }
}
