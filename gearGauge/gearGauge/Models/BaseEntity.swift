//
//  BaseEntity.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 03/11/2025.
//

import Foundation
import SwiftData

/// Base class for all persistent entities
/// Provides audit trail fields for tracking entity lifecycle
@available(iOS 26, *)
@Model
class BaseEntity {
    /// Unique identifier for the entity
    var id: UUID
    
    /// Timestamp when the entity was first created
    var createdDate: Date?
    
    /// Timestamp when the entity was last modified
    var lastUpdatedDate: Date?
    
    /// Version number for conflict resolution and iCloud sync
    var version: Int
    
    /// Soft delete flag - marks entity as deleted without removing from database
    var isDeleted: Bool
    
    init(
        id: UUID = UUID(),
        createdDate: Date? = Date(),
        lastUpdatedDate: Date? = Date(),
        version: Int = 1,
        isDeleted: Bool = false
    ) {
        self.id = id
        self.createdDate = createdDate
        self.lastUpdatedDate = lastUpdatedDate
        self.version = version
        self.isDeleted = isDeleted
    }
    
    // MARK: - Audit Methods
    
    /// Update audit fields for entity modification
    /// Should be called whenever entity properties are changed
    func markAsUpdated() {
        self.lastUpdatedDate = Date()
        self.version += 1
    }
    
    /// Mark entity as soft deleted
    /// Updates audit fields and sets isDeleted flag
    func markAsDeleted() {
        self.isDeleted = true
        self.lastUpdatedDate = Date()
        self.version += 1
    }
}
