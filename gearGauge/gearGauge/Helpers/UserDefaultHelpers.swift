//
//  UserDefaultHelpers.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 07/11/2025.
//

struct UserDefaultHelpers {
    /// Checks if this is the first launch of the app
    /// - Returns: `true` if this is the first launch, `false` otherwise
    static func firstLaunch() -> Bool {
        print("Checking if first launch...")
        
        // Get the value from UserDefaults
        let value = UserDefaultsService.getBool(forKey: Constants.hasDoneFirstLaunch)
        print("hasDoneFirstLaunch value: \(String(describing: value))")
        
        // If value is nil, this is the first launch
        if value == nil {
            print("First launch detected - setting defaults")
            UserDefaultsService.setDefaults()
            return true
        } else {
            print("Not first launch - hasDoneFirstLaunch = \(value!)")
            return false
        }
    }
}
