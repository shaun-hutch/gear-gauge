//
//  WorkoutStore.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 05/11/2025.
//

import Foundation
import SwiftData

protocol WorkoutStoreProtocol {
    /// Fetch all workout items
    /// - Returns: Array of all workouts
    /// - Throws: Error if fetch fails
    func fetchAll() throws -> [Workout]
    
    /// Create a new workout item
    /// - Parameter workout: The workout to create
    /// - Throws: Error if creation fails
    func create(workout: Workout) throws
    
    /// Create multiple workout items
    /// - Parameter workouts: Array of workouts to create
    /// - Throws: Error if creation fails
    func createBulk(workouts: [Workout]) throws
    
    /// Update an existing workout item
    /// - Parameter workout: The workout to update
    /// - Throws: Error if update fails
    func update(workout: Workout) throws
    
    /// Delete a workout item
    /// - Parameter workout: The workout to delete
    /// - Throws: Error if deletion fails
    func delete(workout: Workout) throws
    
    /// Delete multiple workout items
    /// - Parameter workouts: Array of workouts to delete
    /// - Throws: Error if deletion fails
    func deleteBulk(workouts: [Workout]) throws
}

@MainActor
final class WorkoutStore: WorkoutStoreProtocol {
    private let datastore: DataStoreProtocol
    
    init(dataStore: DataStoreProtocol) {
        self.datastore = dataStore
    }
    
    func fetchAll() throws -> [Workout] {
        try datastore.fetch(Workout.self, predicate: nil, sortDescriptors: [])
    }
    
    func create(workout: Workout) throws {
        try datastore.create(workout)
    }
    
    func createBulk(workouts: [Workout]) throws {
        try datastore.createBulk(workouts)
    }
    
    func update(workout: Workout) throws {
        try datastore.update(workout)
    }
    
    func delete(workout: Workout) throws {
        try datastore.delete(workout)
    }
    
    func deleteBulk(workouts: [Workout]) throws {
        try datastore.deleteBulk(workouts)
    }
}

