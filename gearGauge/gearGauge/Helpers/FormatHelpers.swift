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
}
