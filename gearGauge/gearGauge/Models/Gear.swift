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
@Model
final class Gear: BaseEntity {
    // MARK: audit properties
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
    
    // MARK: main properties
    /// name of the gear
    var name: String
    /// what category the gear is
    var type: GearType
    /// how far the gear has gone in kilometres.
    /// Users can set this on create to manually set a distance on gear creation
    var currentDistance: Double
    /// maximum distance before replacement in kilometres
    var maxDistance: Double
    /// optional notes about the gear
    var notes: String?
    /// if the gear is the primary gear for the user
    var isPrimary: Bool
    /// if the gear is currently active
    var isActive: Bool
    
    
    // MARK: - Relationships
    /// Workouts associated with this gear item
    /// When a workout is deleted, it's removed from this gear's workout list (nullify)
    /// The inverse relationship is defined on the Workout.gear property
    @Relationship(deleteRule: .nullify, inverse: \Workout.gear)
    var workouts: [Workout]?
    
    // MARK: - Initialisation
    init(
        id: UUID = UUID(),
        name: String,
        type: GearType,
        currentDistance: Double = 0,
        maxDistance: Double,
        notes: String? = nil,
        isPrimary: Bool = false,
        isActive: Bool = true
    ) {
        self.id = id
        self.createdDate = Date()
        self.lastUpdatedDate = Date()
        self.version = 1
        self.name = name
        self.type = type
        self.currentDistance = currentDistance
        self.maxDistance = maxDistance
        self.notes = notes
        self.isPrimary = isPrimary
        self.isActive = isActive
        self.workouts = []
    }
    
}
