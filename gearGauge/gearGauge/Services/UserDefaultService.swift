//
//  UserDefaultService.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 06/11/2025.
//
import Foundation

final class UserDefaultService {
    private var defaults = UserDefaults.standard
    
    func set<T>(value: T, forKey key: String) {
        defaults.set(value, forKey: key)
    }
    
    func get<T>(forKey key: String) -> T? {
        return defaults.value(forKey: key) as? T
    }
}

