//
//  WorkoutViewModel.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 11/11/2025.
//

import Foundation
import SwiftUI

/// ViewModel for managing workout-related operations and state
/// Acts as the intermediary between views and the WorkoutStore service layer
@MainActor
@Observable
final class WorkoutViewModel {
    // MARK: - Published Properties
    
    /// All workout items fetched from the store
    var workouts: [Workout] = []
    
    /// Loading state for async operations
    var isLoading: Bool = false
    
    /// Error state for displaying error messages to user
    var error: Error?
    
    // MARK: - Dependencies
    
    /// The workout store service for data operations
    private let workoutStore: WorkoutStoreProtocol
    
    // MARK: - Initialization
    
    /// Initialize the ViewModel with a WorkoutStore
    /// - Parameter workoutStore: The store to use for workout operations (supports dependency injection)
    init(workoutStore: WorkoutStoreProtocol) {
        self.workoutStore = workoutStore
    }
    
    // MARK: - Fetch Operations
    
    /// Fetch all workout items from the store
    /// Updates the `workouts` property and manages loading/error states
    func fetchWorkouts() {
        isLoading = true
        error = nil
        
        do {
            workouts = try workoutStore.fetchAll()
            isLoading = false
        } catch {
            self.error = error
            isLoading = false
        }
    }
    
    // MARK: - CRUD Operations
    
    /// Create a new workout item
    /// - Parameter workout: The workout to create
    /// - Returns: True if successful, false otherwise
    @discardableResult
    func createWorkout(_ workout: Workout) -> Bool {
        error = nil
        
        do {
            try workoutStore.create(workout: workout)
            // Refresh the workout list after creation
            fetchWorkouts()
            return true
        } catch {
            self.error = error
            return false
        }
    }
    
    /// Create multiple workout items in bulk
    /// - Parameter workouts: Array of workouts to create
    /// - Returns: True if successful, false otherwise
    @discardableResult
    func createWorkoutsBulk(_ workouts: [Workout]) -> Bool {
        error = nil
        
        do {
            try workoutStore.createBulk(workouts: workouts)
            // Refresh the workout list after creation
            fetchWorkouts()
            return true
        } catch {
            self.error = error
            return false
        }
    }
    
    /// Update an existing workout item
    /// - Parameter workout: The workout to update
    /// - Returns: True if successful, false otherwise
    @discardableResult
    func updateWorkout(_ workout: Workout) -> Bool {
        error = nil
        
        do {
            try workoutStore.update(workout: workout)
            // Refresh the workout list after update
            fetchWorkouts()
            return true
        } catch {
            self.error = error
            return false
        }
    }
    
    /// Delete a workout item
    /// - Parameter workout: The workout to delete
    /// - Returns: True if successful, false otherwise
    @discardableResult
    func deleteWorkout(_ workout: Workout) -> Bool {
        error = nil
        
        do {
            try workoutStore.delete(workout: workout)
            // Refresh the workout list after deletion
            fetchWorkouts()
            return true
        } catch {
            self.error = error
            return false
        }
    }
    
    /// Delete multiple workout items in bulk
    /// - Parameter workouts: Array of workouts to delete
    /// - Returns: True if successful, false otherwise
    @discardableResult
    func deleteWorkoutsBulk(_ workouts: [Workout]) -> Bool {
        error = nil
        
        do {
            try workoutStore.deleteBulk(workouts: workouts)
            // Refresh the workout list after deletion
            fetchWorkouts()
            return true
        } catch {
            self.error = error
            return false
        }
    }
    
    // MARK: - Helper Methods
    
    /// Clear any existing error state
    func clearError() {
        error = nil
    }
}

