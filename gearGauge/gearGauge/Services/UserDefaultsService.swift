//
//  UserDefaultService.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 06/11/2025.
//
import Foundation

struct UserDefaultsService {
    private static let defaults = UserDefaults.standard
    
    static func keyExists(_ key: String) -> Bool {
        return defaults.object(forKey: key) != nil
    }
    
    static func set<T>(value: T, forKey key: String) {
        defaults.set(value, forKey: key)
    }
    
    static func get<T>(forKey key: String) -> T? {
        return keyExists(key) ? defaults.value(forKey: key) as? T : nil
    }
    
    // MARK: - Typed Convenience Methods
    
    /// Get a Bool value from UserDefaults
    static func getBool(forKey key: String) -> Bool? {
        return keyExists(key) ? defaults.bool(forKey: key) : nil
    }
    
    /// Get a String value from UserDefaults
    static func getString(forKey key: String) -> String? {
        return defaults.string(forKey: key)
    }
    
    /// Get an Int value from UserDefaults
    static func getInt(forKey key: String) -> Int? {
        return keyExists(key) ? defaults.integer(forKey: key) : nil
    }
    
    /// Get a Double value from UserDefaults
    static func getDouble(forKey key: String) -> Double? {
        return keyExists(key) ? defaults.double(forKey: key) : nil
    }
}

