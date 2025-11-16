//
//  Constants.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 07/11/2025.
//

struct Constants {
    /// key to denote if the app has done a first launch
    static let hasDoneFirstLaunch = "hasDoneFirstLaunch"
    /// key to denote if the user has paid for premium
    static let hasPremium = "hasPremium"
    /// key to denote if the user has requested HealthKit authorization at least once
    /// Note: This does NOT mean access was granted, only that the authorization sheet was shown
    static let hasRequestedHealthKitAuthorization = "hasRequestedHealthKitAuthorization"
    /// key to denote what unit the user has selected (kilometers/miles)
    static let distanceUnit = "distanceUnit"
    /// key to denote if background workout fetching is enabled
    static let hasBackgroundFetchEnabled = "hasBackgroundFetchEnabled"
}
