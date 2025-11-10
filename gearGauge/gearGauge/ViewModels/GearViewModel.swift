//
//  GearViewModel.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 11/11/2025.
//

// view models are like a react hook as well - with their respective properties/functions

import Foundation
import SwiftUI

/// ViewModel for managing gear-related operations and state
/// Acts as the intermediary between views and the GearStore service layer
@MainActor
@Observable
final class GearViewModel {
    // MARK: - Published Properties
    
    /// All gear items fetched from the store
    var allGear: [Gear] = []
    
    /// Only active gear items (isActive = true)
    var activeGear: [Gear] = []
    
    /// The primary gear item (isPrimary = true)
    var primaryGear: Gear?
    
    /// Loading state for async operations
    var isLoading: Bool = false
    
    /// Error state for displaying error messages to user
    var error: Error?
    
    // MARK: - Dependencies
    
    /// The gear store service for data operations
    private let gearStore: GearStoreProtocol
    
    // MARK: - Initialization
    
    /// Initialize the ViewModel with a GearStore
    /// - Parameter gearStore: The store to use for gear operations (supports dependency injection)
    init(gearStore: GearStoreProtocol) {
        self.gearStore = gearStore
    }
    
    // MARK: - Fetch Operations
    
    /// Fetch all gear items from the store
    /// Updates the `allGear` property and manages loading/error states
    func fetchAllGear() {
        isLoading = true
        error = nil
        
        do {
            allGear = try gearStore.fetchAll()
            isLoading = false
        } catch {
            self.error = error
            isLoading = false
        }
    }
    
    /// Fetch only active gear items from the store
    /// Updates the `activeGear` property and manages loading/error states
    func fetchActiveGear() {
        isLoading = true
        error = nil
        
        do {
            activeGear = try gearStore.fetchActive()
            isLoading = false
        } catch {
            self.error = error
            isLoading = false
        }
    }
    
    /// Fetch the primary gear item from the store
    /// Updates the `primaryGear` property and manages loading/error states
    func fetchPrimaryGear() {
        isLoading = true
        error = nil
        
        do {
            primaryGear = try gearStore.fetchPrimary()
            isLoading = false
        } catch {
            self.error = error
            isLoading = false
        }
    }
    
    // MARK: - CRUD Operations
    
    /// Create a new gear item
    /// - Parameter gear: The gear to create
    /// - Returns: True if successful, false otherwise
    @discardableResult
    func createGear(_ gear: Gear) -> Bool {
        error = nil
        
        do {
            try gearStore.create(gear: gear)
            // Refresh the gear list after creation
            fetchAllGear()
            return true
        } catch {
            self.error = error
            return false
        }
    }
    
    /// Update an existing gear item
    /// - Parameter gear: The gear to update
    /// - Returns: True if successful, false otherwise
    @discardableResult
    func updateGear(_ gear: Gear) -> Bool {
        error = nil
        
        do {
            try gearStore.update(gear: gear)
            // Refresh the gear list after update
            fetchAllGear()
            return true
        } catch {
            self.error = error
            return false
        }
    }
    
    /// Delete a gear item
    /// - Parameter gear: The gear to delete
    /// - Returns: True if successful, false otherwise
    @discardableResult
    func deleteGear(_ gear: Gear) -> Bool {
        error = nil
        
        do {
            try gearStore.delete(gear: gear)
            // Refresh the gear list after deletion
            fetchAllGear()
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

