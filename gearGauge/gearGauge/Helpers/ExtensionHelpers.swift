//
//  ExtensionHelpers.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 06/11/2025.
//

import SwiftUI

extension Color {
    static let appTintColor = Color("AppTintColor")
}

extension UserDefaultsService {
    /// sets the UserDefaults to initial values (including first launch has now completed)
    /// if
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
