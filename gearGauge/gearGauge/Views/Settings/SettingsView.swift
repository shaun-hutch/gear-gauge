//
//  SettingsView.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 06/11/2025.
//

import SwiftUI

struct SettingsView: View {
    @Environment(\.colorScheme) var colorScheme
    
    
    
    // value representing userDefault
    @State private var healthKitEnabled: Bool = false
    // distance unit (0 = km, 1 = mi)
    @State private var distanceUnit: Int = 0
    
    // if the user is in process of requesting HealthKit permission
    @State private var isRequestingHealthKit: Bool = false
    
    private let options: [String] = ["Kilometers", "Miles"]
    
    var body: some View {
        VStack {
            List {
                Section(header: Text("HealthKit")) {
                    HealthKitToggleListItem
                }
                Section(header: Text("Distance Units")) {
                    DistanceDenominationListItem
                }
                        
                
            }
        }
        .onAppear {
            loadSettings()
//            setupPickerAppearance()
        }
    }
    
    
    var HealthKitToggleListItem: some View {
        HStack {
            Text("HealthKit Integration")
            Spacer()
            if healthKitEnabled {
                Image(systemName: "checkmark.circle.fill")
                    .tint(Color.appTintColor)
            } else {
                Button(action: {
                    
                }) {
                    HStack {
                        Text("Request")
                        Image(systemName: "heart.circle")
                            .tint(Color.appTintColor)
                    }
                }
            }
        }
        
    }
    
    var DistanceDenominationListItem: some View {
        Picker("Distance Units", selection: $distanceUnit) {
            ForEach(0..<options.count, id: \.self) { index in
                Text(options[index])
            }
        }
        .pickerStyle(.segmented)
        
    }
    
    
    private func loadSettings() {
        // if no default set, have it at false
        healthKitEnabled = UserDefaultHelpers.getHealthKitAccess() ?? false
    }
    
    private func requestHealthKitPermissions() {
        
    }
}
