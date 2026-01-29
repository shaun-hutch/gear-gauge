//
//  FormatHelpers.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 18/11/2025.
//

import SwiftUI

class FormatHelpers {
    // NumberFormatter with grouping disabled so the TextField shows "1000" not "1,000"
    static let numberFormatterNoGrouping: NumberFormatter = {
        let f = NumberFormatter()
        f.numberStyle = .decimal
        f.usesGroupingSeparator = false
        f.maximumFractionDigits = 2
        f.minimumFractionDigits = 0
        return f
    }()
    
    // DateFormatter for Workout List Card
    // Example: Thu 29 Jan, 9:50pm
    static let workoutDateFormatter: DateFormatter = {
        let f = DateFormatter()
        f.dateFormat = "E d MMM, h:mma"
        f.amSymbol = "am"
        f.pmSymbol = "pm"
        return f
    }()
}
