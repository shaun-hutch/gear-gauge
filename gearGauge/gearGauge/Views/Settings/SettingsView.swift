//
//  SettingsView.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 06/11/2025.
//

import SwiftUI

struct SettingsView: View {    
    // value representing userDefault
    @State private var healthKitEnabled: Bool = false
    // distance unit (0 = km, 1 = mi)
    @State private var pickerDistanceUnit: Int = 0
    // if the user is in process of requesting HealthKit permission
    @State private var isRequestingHealthKit: Bool = false
    // if the user wants automatic background fetching of workouts
    @State private var backgroundFetchEnabled: Bool = false
    // if the user has requested to manually import workouts
    @State private var isImportingWorkouts: Bool = false
    
    private let options: [String] = ["Kilometers", "Miles"]
    
    var body: some View {
        NavigationView {
            VStack {
                List {
                    Section(header: Text("HealthKit")) {
                        HealthKitToggleListItem
                        HealthKitBackgroundFetchListItem
                        if (healthKitEnabled) {
                            ImportWorkoutsListItem
                        }
                        
                    }
                    Section(header: Text("Distance Unit")) {
                        DistanceDenominationListItem
                    }
                    VersionInfoListItem
                    
                }
                .scrollDisabled(true)
                
            }
            .onAppear {
                loadSettings()
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.large)
        }
    }
    
    
    var HealthKitToggleListItem: some View {
        HStack {
            Text("HealthKit Integration")
            Spacer()
            if healthKitEnabled {
                Image(systemName: "checkmark")
                    .foregroundStyle(.appTint)
                    .font(.body.bold())
                
            } else if isRequestingHealthKit {
                ProgressView()
                    .progressViewStyle(.circular)
                    .tint(.appTint)
                
            } else {
                Button(action: {
                    isRequestingHealthKit = true
                    print("requested!")
                    Task {
                        try await Task.sleep(nanoseconds: 1_000_000_000)
                        isRequestingHealthKit = false
                    }
                }) {
                    HStack {
                        Text("Request")
                            .foregroundStyle(.appTint)
                        Image(systemName: "heart.fill")
                            .foregroundStyle(.appTint)
                            .font(.body.bold())
                    }
                }
            }
        }
    }
    
    var HealthKitBackgroundFetchListItem: some View {
        Toggle("Background Fetch", isOn: $backgroundFetchEnabled)
            .tint(.appTint)
            .onChange(of: backgroundFetchEnabled) { _, newValue in
                UserDefaultsService.set(value: newValue, forKey: Constants.hasBackgroundFetchEnabled)
            }
    }
    
    var ImportWorkoutsListItem: some View {
        Button(action: {
            
        }) {
            HStack (alignment: .center){
                Image(systemName: "square.and.arrow.down")
                    .foregroundStyle(.appTint)
                    .font(.body.bold())
                Text("Import Workouts")
                    .foregroundStyle(.appTint)
                    .font(.body.bold())
                    
            }
            .frame(maxWidth: .infinity, alignment: .center)
        }
    }
    
    
    var DistanceDenominationListItem: some View {
        Picker("", selection: $pickerDistanceUnit) {
            ForEach(0..<options.count, id: \.self) { index in
                Text(options[index])
            }
        }
        .onChange(of: pickerDistanceUnit) { _, newValue in
            UserDefaultsService.set(value: newValue, forKey: Constants.distanceUnit)
        }
        .pickerStyle(.inline)
        .labelsHidden()
    }
    
    var VersionInfoListItem: some View {
        VStack {
            HStack {
                Image(systemName: "shoe")
                    .foregroundStyle(.appTint)
                    .font(.caption2)
                Text(appVersionString)
                    .font(.caption2)
                    .padding(.vertical, 4)
            }
            Text("Created by Shaun Hutchinson")
                .font(.caption2)
        }
        .listRowBackground(Color(.clear))
        .frame(maxWidth: .infinity, alignment: .center)
    }
    
    
    private func loadSettings() {
        healthKitEnabled = UserDefaultHelpers.getHealthKitAccess() ?? false
        pickerDistanceUnit = UserDefaultsService.get(forKey: Constants.distanceUnit) ?? 0
        backgroundFetchEnabled = UserDefaultsService.get(forKey: Constants.hasBackgroundFetchEnabled) ?? false
    }
    
    private func requestHealthKitPermissions() {
        
    }
    
    private var appVersionString: String {
        let version = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "?"
        return "v\(version)"
    }
}
