//
//  WorkoutSyncServiceProtocol.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 15/12/2025.
//

@MainActor
protocol WorkoutSyncServiceProtocol {
    @discardableResult
    func syncWorkouts() async throws -> Int
    
    func startObserving() -> Task<Void, Never>
    
    var isSyncing: Bool { get set }
}
