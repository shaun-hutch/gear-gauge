//
//  IGearService.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 04/11/2025.
//

import Foundation
import SwiftData

protocol GearStoreProtocol {
    /// Fetch all gear items
    /// - Returns: Array of all gear
    /// - Throws: Error if fetch fails
    func fetchAll() throws -> [Gear]
    
    /// Fetch only active gear items
    /// - Returns: Array of active gear (isActive = true)
    /// - Throws: Error if fetch fails
    func fetchActive() throws -> [Gear]
    
    /// Fetch the primary gear item
    /// - Returns: The primary gear if one exists
    /// - Throws: Error if fetch fails
    func fetchPrimary() throws -> Gear?
    
    /// Create a new gear item
    /// - Parameter gear: The gear to create
    /// - Throws: Error if creation fails
    func create(gear: Gear) throws
    
    /// Update an existing gear item
    /// - Parameter gear: The gear to update
    /// - Throws: Error if update fails
    func update(gear: Gear) throws
    
    /// Delete all gear items
    /// - Throws: Error if deletion fails
    func delete(gear: Gear) throws
}

@MainActor
final class GearStore: GearStoreProtocol {
    private let datastore: DataStoreProtocol
    
    private let activePredicate: Predicate<Gear>
    private let primaryPredicate: Predicate<Gear>
    
    init(dataStore: DataStoreProtocol) {
        self.datastore = dataStore
        
        // Initialize predicates in the init
        self.activePredicate = #Predicate<Gear> { gear in
            gear.isActive == true
        }
        
        self.primaryPredicate = #Predicate<Gear> { gear in
            gear.isPrimary == true
        }
    }
    
    func fetchAll() throws -> [Gear] {
        try datastore.fetch(Gear.self, predicate: nil, sortDescriptors: [])
    }
    
    func fetchActive() throws -> [Gear] {
        try datastore.fetch(Gear.self, predicate: activePredicate, sortDescriptors: [])
    }
    
    func fetchPrimary() throws -> Gear? {
        try datastore.fetch(Gear.self, predicate: primaryPredicate, sortDescriptors: []).first ?? nil
    }
    
    func create(gear: Gear) throws {
        try datastore.create(gear)
    }
    
    func update(gear: Gear) throws {
        try datastore.update(gear)
    }
    
    func delete(gear: Gear) throws {
        try datastore.delete(gear)
    }
    
    
}
