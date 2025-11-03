//
//  WorkoutType.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 03/11/2025.
//

import SwiftUI

enum WorkoutType: String, CaseIterable, Identifiable {
    case outdoorRun
    case indoorRun
    case outdoorWalk
    case indoorWalk
    case outdoorCycle
    case indoorCycle

    var id: String { self.rawValue }

    var displayName: String {
        switch self {
        case .outdoorRun:
            return String(localized: .workoutTypeOutdoorRun)
        case .indoorRun:
            return String(localized: .workoutTypeIndoorRun)
        case .outdoorWalk:
            return String(localized: .workoutTypeOutdoorWalk)
        case .indoorWalk:
            return String(localized: .workoutTypeIndoorWalk)
        case .outdoorCycle:
            return String(localized: .workoutTypeOutdoorCycle)
        case .indoorCycle:
            return String(localized: .workoutTypeIndoorCycle)

        }
    }

    var displayIcon: String {
        switch self {
        case .outdoorRun:
            return "figure.run.circle"
        case .indoorRun:
            return "figure.run.treadmill.circle"
        case .outdoorWalk:
            return "figure.walk.circle"
        case .indoorWalk:
            return "figure.walk.treadmill.circle"
        case .outdoorCycle:
            return "figure.outdoor.cycle.circle"
        case .indoorCycle:
            return "figure.indoor.cycle.circle"
        }
    }
}
