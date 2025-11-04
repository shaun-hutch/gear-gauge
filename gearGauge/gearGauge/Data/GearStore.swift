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
    func deleteAll() throws
}

//final class GearStore: GearStoreProtocol {
//    func fetchAll() throws -> [Gear] {
//        <#code#>
//    }
//    
//    func fetchActive() throws -> [Gear] {
//        <#code#>
//    }
//    
//    func fetchPrimary() throws -> Gear? {
//        <#code#>
//    }
//    
//    func create(gear: Gear) throws {
//        <#code#>
//    }
//    
//    func update(gear: Gear) throws {
//        <#code#>
//    }
//    
//    func deleteAll() throws {
//        <#code#>
//    }
//    
//
//}
