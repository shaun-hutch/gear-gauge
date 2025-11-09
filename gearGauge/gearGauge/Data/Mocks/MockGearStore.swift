//
//  MockGearStore.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 09/11/2025.
//

import Foundation

@MainActor
final class MockGearStore: GearStoreProtocol {
    // Sample gear data for previews
    private var mockGear: [Gear] = [
        Gear(name: "Shoes", type: .shoes, currentDistance: 300, maxDistance: 1000, notes: "pretty good", isPrimary: true, isActive: true, startDate: Date()),
        Gear(name: "Bike", type: .bicycle, currentDistance: 500, maxDistance: 3000, notes: "pretty good bike", isPrimary: false, isActive: true, startDate: Date())
    ]
    
    /// Initialize with optional sample data
    /// - Parameter sampleData: Array of Gear to use for mock responses
    init(sampleData: [Gear] = []) {
        self.mockGear = sampleData.count > 0 ? sampleData : mockGear
    }
    
    func fetchAll() throws -> [Gear] {
        return mockGear
    }
    
    func fetchActive() throws -> [Gear] {
        return mockGear.filter { $0.isActive }
    }
    
    func fetchPrimary() throws -> Gear? {
        return mockGear.first { $0.isPrimary }
    }
    
    func create(gear: Gear) throws {
        mockGear.append(gear)
    }
    
    func update(gear: Gear) throws {
        // Mock update - in a real mock you might track this
    }
    
    func delete(gear: Gear) throws {
        mockGear.removeAll { $0.id == gear.id }
    }
}

