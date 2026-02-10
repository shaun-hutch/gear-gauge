//
//  gearGaugeTests.swift
//  gearGaugeTests
//
//  Created by Shaun Hutchinson on 02/11/2025.
//

import Testing
@testable import gearGauge

struct gearGaugeTests {

    @Test func example() async throws {
        // Write your test here and use APIs like `#expect(...)` to check expected conditions.
    }
    
    @Test func testCachedDistanceCalculation() async throws {
        // Create a gear with initial distance
        let gear = Gear(
            name: "Test Shoes",
            type: .shoes,
            initialDistance: 100,
            maxDistance: 1000,
            startDate: Date(),
            workoutTypes: [.outdoorRun]
        )
        
        // Initially, cached distance should be 0 (no workouts)
        #expect(gear.cachedTotalWorkoutDistance == 0)
        #expect(gear.currentDistance == 100)
        
        // Create some sample workouts
        let workout1 = Workout(
            healthKitUUID: UUID(),
            activityType: .running,
            totalDistance: 5.0,
            startDate: Date(),
            endDate: Date()
        )
        
        let workout2 = Workout(
            healthKitUUID: UUID(),
            activityType: .running,
            totalDistance: 10.0,
            startDate: Date(),
            endDate: Date()
        )
        
        // Add workouts to gear
        gear.workouts = [workout1, workout2]
        gear.recalculateCachedDistance()
        
        // Cached distance should now be sum of workouts
        #expect(gear.cachedTotalWorkoutDistance == 15.0)
        #expect(gear.currentDistance == 115.0)
    }
    
    @Test func testCachedDistanceWithDeletedWorkouts() async throws {
        // Create a gear with workouts
        let gear = Gear(
            name: "Test Shoes",
            type: .shoes,
            initialDistance: 0,
            maxDistance: 1000,
            startDate: Date(),
            workoutTypes: [.outdoorRun]
        )
        
        let workout1 = Workout(
            healthKitUUID: UUID(),
            activityType: .running,
            totalDistance: 5.0,
            startDate: Date(),
            endDate: Date()
        )
        
        let workout2 = Workout(
            healthKitUUID: UUID(),
            activityType: .running,
            totalDistance: 10.0,
            startDate: Date(),
            endDate: Date()
        )
        
        gear.workouts = [workout1, workout2]
        gear.recalculateCachedDistance()
        
        #expect(gear.cachedTotalWorkoutDistance == 15.0)
        
        // Soft delete one workout
        workout1.markAsDeleted()
        gear.recalculateCachedDistance()
        
        // Cached distance should exclude deleted workout
        #expect(gear.cachedTotalWorkoutDistance == 10.0)
        #expect(gear.currentDistance == 10.0)
    }

}
