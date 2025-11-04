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
    
    /// Create multiple entities in a single transaction
    /// If any creation fails, all changes are rolled back
    /// - Parameter entities: Array of entities to create
    /// - Throws: Error if creation fails
    func createBulk<T: PersistentModel & BaseEntity>(_ entities: [T]) throws
    
    /// Delete multiple entities in a single transaction
    /// If any deletion fails, all changes are rolled back
    /// - Parameter entities: Array of entities to delete
    /// - Throws: Error if deletion fails
    func deleteBulk<T: PersistentModel & BaseEntity>(_ entities: [T]) throws
}


/// A data access layer for managing CRUD operations on SwiftData models
/// Provides centralized model context operations for Gear and Workout entities
@MainActor
final class DataStore: DataStoreProtocol {
    internal let modelContext: ModelContext
    
    func create<T: PersistentModel & BaseEntity>(_ entity: T) throws {
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
        entity.markAsUpdated()
        try save()
    }
    
    func delete<T: PersistentModel & BaseEntity>(_ entity: T) throws {
        entity.markAsDeleted()
        try save()
    }
    
    // MARK: - Bulk Operations
    
    /// Create multiple entities in a single transaction
    /// All entities are inserted and saved atomically
    /// If save fails, all changes are rolled back automatically
    /// - Parameter entities: Array of entities to create
    /// - Throws: Error if creation fails
    func createBulk<T: PersistentModel & BaseEntity>(_ entities: [T]) throws {
        for entity in entities {
            modelContext.insert(entity)
        }
        try save()
    }
    
    /// Delete multiple entities in a single transaction
    /// All entities are marked as deleted and saved atomically
    /// If save fails, all changes are rolled back automatically
    /// - Parameter entities: Array of entities to delete
    /// - Throws: Error if deletion fails
    func deleteBulk<T: PersistentModel & BaseEntity>(_ entities: [T]) throws {
        for entity in entities {
            entity.markAsDeleted()
        }
        try save()
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
    private func save() throws {
        do {
            try modelContext.save()
        } catch {
            rollback()
        }
    }
    
    /// Rollback any unsaved changes
    private func rollback() {
        modelContext.rollback()
    }
}
