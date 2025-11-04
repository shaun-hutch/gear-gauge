//
//  DataStore.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 04/11/2025.
//

import SwiftData
import SwiftUI


protocol DataStoreProtocol {
    var modelContext: ModelContext { get }
    
    // MARK: CRUD operations
    
    /// Create and insert a new entity into the model context
    /// - Parameter entity: The entity to create
    /// - Throws: Error if creation fails
    func create<T: PersistentModel & BaseEntity>(_ entity: T) throws
    
    /// Fetch all entities of a given type
    /// - Parameters:
    ///   - type: The type of entity to fetch
    ///   - predicate: Optional predicate to filter results
    ///   - sortDescriptors: Optional sort descriptors for ordering results
    /// - Returns: Array of entities matching the criteria
    /// - Throws: Error if fetch fails
    func fetch<T: PersistentModel & BaseEntity>(
        _ type: T.Type,
        predicate: Predicate<T>?,
        sortDescriptors: [SortDescriptor<T>]?,
    ) throws -> [T]
    
    /// Update an existing entity's audit fields
    /// - Parameter entity: The entity to update
    /// - Throws: Error if update fails
    func update<T: PersistentModel & BaseEntity>(_ entity: T) throws
    
    /// Delete a single entity
    /// - Parameter entity: The entity to delete
    /// - Throws: Error if deletion fails
    func delete<T: PersistentModel & BaseEntity>(_ entity: T) throws
}


/// A data access layer for managing CRUD operations on SwiftData models
/// Provides centralized model context operations for Gear and Workout entities
@MainActor
final class DataStore: DataStoreProtocol {
    internal let modelContext: ModelContext
    
    func create<T: PersistentModel & BaseEntity>(_ entity: T) throws {
        entity.createdDate = Date()
        entity.lastUpdatedDate = Date()
        entity.version = 1
        entity.isDeleted = false
        modelContext.insert(entity)
        try save()
    }
    
    func fetch<T: PersistentModel & BaseEntity>(_ type: T.Type, predicate: Predicate<T>?, sortDescriptors: [SortDescriptor<T>]?) throws -> [T] {
        let descriptor = FetchDescriptor<T>(
            predicate: predicate ?? nil,
            sortBy: sortDescriptors ?? []
        )
        return try modelContext.fetch(descriptor)
    }
    
    func update<T: PersistentModel & BaseEntity>(_ entity: T) throws {
        entity.lastUpdatedDate = Date()
        entity.version += 1
    }
    
    func delete<T: PersistentModel & BaseEntity>(_ entity: T) throws {
        <#code#>
    }
        
    // MARK: - Initialization
    
    /// Initialize DataStore with a model context
    /// - Parameter modelContext: The SwiftData model context to use for operations
    init(modelContext: ModelContext) {
        self.modelContext = modelContext
    }

    
    // MARK: - General Operations
    
    /// Save any pending changes to the model context
    /// - Throws: Error if save fails
    func save() throws {
        try modelContext.save()
    }
    
    /// Rollback any unsaved changes
    func rollback() {
        modelContext.rollback()
    }
}
