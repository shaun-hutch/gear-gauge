//
//  Gear.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 03/11/2025.
//

import SwiftUI
import SwiftData

/// A piece of fitness gear which is tracked by the user.
/// Stores distance travelled for a piece of gear, like shoes or a bicycle
@available(iOS 26, *)
@Model
final class Gear: BaseEntity {
    // MARK: main properties
    /// name of the gear
    var name: String
    
    /// The starting distance for the gear in kilometres.
    /// This allows users to set a starting value if gear was already used before tracking began
    var initialDistance: Double
    
    /// Cached total distance from all associated workouts in kilometres.
    /// This is denormalized for performance - updated when workouts are linked/unlinked.
    var cachedTotalWorkoutDistance: Double
    
    /// Maximum distance before replacement in kilometres
    var maxDistance: Double
    /// optional notes about the gear
    var notes: String?
    /// if the gear is the primary gear for the user
    var isPrimary: Bool
    /// if the gear is currently active
    var isActive: Bool
    /// gear start date
    var startDate: Date
    /// gear end date (retirement date)
    var endDate: Date?
    
    // MARK: Raw enum value handling
    
    /// what category the gear is (stored as raw String value for SwiftData)
    private var typeRawValue: String
    
    /// Raw values of workout types (stored for SwiftData compatibility)
    private var workoutTypeRawValues: [String]
    
    /// The type of gear (computed from raw value)
    /// SwiftData cannot store enums, just primitive values
    var type: GearType {
        get {
            GearType(rawValue: typeRawValue) ?? .shoes
        }
        set {
            typeRawValue = newValue.rawValue
        }
    }
    
    /// What types of workouts this gear is for (computed from raw values)
    var workoutTypes: [WorkoutType] {
        get {
            workoutTypeRawValues.compactMap { WorkoutType(rawValue: $0) }
        }
        set {
            workoutTypeRawValues = newValue.map { $0.rawValue }
        }
    }
    
    // MARK: Computed fields
    
    /// Current distance travelled by this gear in kilometres.
    /// Computed as initialDistance + cached workout distances for O(1) access.
    var currentDistance: Double {
        return initialDistance + cachedTotalWorkoutDistance
    }
    
    var currentDistanceMiles: Double { Double.ConvertToMi(currentDistance) }
    
    var maxDistanceMiles: Double { Double.ConvertToMi(maxDistance) }
    
    // MARK: - Relationships
    /// Workouts associated with this gear item
    /// When a workout is deleted, it's removed from this gear's workout list (nullify)
    /// The inverse relationship is defined on the Workout.gear property
    @Relationship(deleteRule: .nullify, inverse: \Workout.gear)
    var workouts: [Workout]?
    
    // MARK: - Initialisation
    init(
        name: String,
        type: GearType,
        initialDistance: Double = 0,
        maxDistance: Double,
        notes: String? = nil,
        isPrimary: Bool = false,
        isActive: Bool = true,
        startDate: Date,
        endDate: Date? = nil,
        workoutTypes: [WorkoutType] = [],
        workouts: [Workout] = []
    ) {
        self.name = name
        self.typeRawValue = type.rawValue
        self.initialDistance = initialDistance
        self.cachedTotalWorkoutDistance = 0 // Initialize to 0, will be recalculated
        self.maxDistance = maxDistance
        self.notes = notes
        self.isPrimary = isPrimary
        self.isActive = isActive
        self.workouts = workouts
        self.startDate = startDate
        self.endDate = endDate
        self.workoutTypeRawValues = workoutTypes.map { $0.rawValue }
        
        // Call parent initializer with defaults
        super.init()
    }
    
    // MARK: - Cache Management
    
    /// Recalculates and updates the cached total workout distance.
    /// This should be called when workouts are added, removed, or modified.
    /// Only counts workouts that are not soft-deleted.
    func recalculateCachedDistance() {
        cachedTotalWorkoutDistance = workouts?.filter { !$0.isDeleted }.reduce(0) { $0 + $1.totalDistance } ?? 0
    }
    
}

extension Gear {
    static func SampleGear() -> Gear {
        return self.init(
            name: "Asics Gel Kayano",
            type: .shoes,
            initialDistance: 900,
            maxDistance: 1000,
            notes: "Great running shoes",
            isPrimary: true,
            isActive: true,
            startDate: Date.newDateTime(year: 2025, month: 3, day: 15),
            workoutTypes: [.outdoorRun, .indoorRun],
            workouts: Workout.SampleWorkouts()
        )
    }
}
