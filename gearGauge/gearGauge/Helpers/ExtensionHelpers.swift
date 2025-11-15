//
//  ExtensionHelpers.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 06/11/2025.
//

import SwiftUI

// MARK: UserDefaultsService
extension UserDefaultsService {
    /// sets the UserDefaults to initial values (including first launch has now completed)
    static func setDefaults() {
        // if the app has done a first launch, then do nothing here
        if let hasLaunched = getBool(forKey: Constants.hasDoneFirstLaunch), hasLaunched == true {
            print("already true, shouldn't be here")
            return
        }
        
        // otherwise set initial values
        set(value: true, forKey: Constants.hasDoneFirstLaunch)
        set(value: false, forKey: Constants.hasPremium)
        
        // set other defaults here
    }
}

// MARK: Date
extension Date {
    /// Creates a new Date struct with provided parameters
    /// - Parameters:
    ///   - year: year of the date
    ///   - month: month of the date (1-12)
    ///   - day: day of the date's month (1-31)
    ///   - hour: hour of the day (0-23)
    ///   - minute: minute of the day (0-59)
    /// - Returns: a new Date struct
    static func newDateTime(year: Int, month: Int, day: Int, hour: Int? = 0, minute: Int? = 0) -> Date {
        var components = DateComponents()
        components.year = year
        components.month = month
        components.day = day
        components.hour = hour
        components.minute = minute
        
        return Calendar.current.date(from: components) ?? Date()
    }
}
