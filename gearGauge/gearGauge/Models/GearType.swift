//
//  GearType.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 03/11/2025.
//

import SwiftUI

enum GearType: String, CaseIterable, Identifiable {
    case shoes
    case bicycle

    var id: String { self.rawValue }

    var displayName: String {
        switch self {
        case .shoes:
            return String(localized: .gearTypeShoes)
        case .bicycle:
            return String(localized: .gearTypeBicycle)
        }
    }

    var displayIcon: String {
        switch self {
        case .shoes:
            return "shoe"
        case .bicycle:
            return "bicycle"
        }
    }
}
