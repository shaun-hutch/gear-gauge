//
//  SettingsView.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 06/11/2025.
//

import SwiftUI

struct SettingsView: View {
    /// If the user has requested HealthKit authorization at least once
    /// Note: This tracks if the authorization sheet was shown, NOT if access was granted
    @State private var hasRequestedHealthKitAuth: Bool = false
    /// Distance unit selection (0 = km, 1 = mi)
    @State private var pickerDistanceUnit: Int = 0
    /// If the user is in process of requesting HealthKit permission
    @State private var isRequestingHealthKit: Bool = false
    /// If the user wants automatic background fetching of workouts
    @State private var backgroundFetchEnabled: Bool = false
    /// If the user has requested to manually import workouts
    @State private var isImportingWorkouts: Bool = false
    /// if the user has premium status (has purchased)
    @State private var hasPremium: Bool = false
    
    private let options: [String] = ["Kilometers", "Miles"]
    
    var healthKitWorkoutService: WorkoutServiceProtocol
    
    var body: some View {
        NavigationStack {
            VStack {
                List {
                    Section(header: Text("HealthKit")) {
                        HealthKitToggleListItem
                        if hasRequestedHealthKitAuth {
                            healthKitOpenSettingsListItem
                        }
                        
                    }
                    Section(header: Text("Workout Loading")) {
                        HealthKitBackgroundFetchListItem
                        if hasRequestedHealthKitAuth {
                            ImportWorkoutsListItem
                        }
                    }
                    
                    Section(header: Text("Distance Unit")) {
                        DistanceDenominationListItem
                    }
                    Section(header: Text("Premium")) {
                        PremiumStatusListItem
                        UpgradeRestorePurchaseListItem
                    }
                    
                    VersionInfoListItem
                    
                }
                .listSectionSpacing(2)
                
            }
            .onAppear {
                loadSettings()
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.large)
        }
    }
    
    
    // MARK: HealthKit section items
    
    var HealthKitToggleListItem: some View {
        Button(action: {
            // Only allow requesting if not already requested
            guard !hasRequestedHealthKitAuth else { return }
            
            isRequestingHealthKit = true
            Task {
                await requestHealthKitPermissions()
                isRequestingHealthKit = false
            }
        }) {
            HStack {
                Text("HealthKit Integration")
                Spacer()
                HStack {
                    Text(hasRequestedHealthKitAuth ? "Requested" : "Request")
                        .foregroundStyle(.appTint)
                    if isRequestingHealthKit {
                        ProgressView()
                            .progressViewStyle(.circular)
                            .tint(.appTint)
                    } else {
                        Image(systemName: hasRequestedHealthKitAuth ? "checkmark" : "heart.fill")
                            .foregroundStyle(.appTint)
                            .font(.body.bold())
                    }
                }
            }
        }
        .buttonStyle(.plain) // Maintains list row appearance
        .disabled(hasRequestedHealthKitAuth) // Disable entire row once requested
    }
    
    var healthKitOpenSettingsListItem: some View {
        Button(action: {
            openHealthAppsPage()
        }) {
            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text("Open in Health")
                    Spacer()
                    HStack {
                        Text("Open")
                            .foregroundStyle(.appTint)
                        Image(systemName: "arrow.up.right.square.fill")
                            .foregroundStyle(.appTint)
                            .font(.body.bold())
                    }
                }
                Text("In Health: Profile → Privacy → Apps → gearGauge")
                    .font(.caption2)
                    .foregroundStyle(.secondary)
            }
        }
        .buttonStyle(.plain) // Maintains list row appearance
    }
    
    // MARK: Background fetch & import
    
    var HealthKitBackgroundFetchListItem: some View {
        Toggle("Background Fetch", isOn: $backgroundFetchEnabled)
            .tint(.appTint)
            .onChange(of: backgroundFetchEnabled) { _, newValue in
                UserDefaultsService.set(value: newValue, forKey: Constants.hasBackgroundFetchEnabled)
            }
    }
    
    var ImportWorkoutsListItem: some View {
        Button(action: {
            importWorkouts()
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
    
    // MARK: Distance unit section item
    
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
    
    // MARK: Premium status
    
    var PremiumStatusListItem: some View {
        HStack {
            Text("Status")
            Spacer()
            Text(hasPremium ? "Premium" : "Free")
                .foregroundStyle(hasPremium ? .appTint : .primary)
                .font(.body.bold())
        }
    }
    
    var UpgradeRestorePurchaseListItem: some View {
        HStack {
            Button(action: {
                print("restore purchase!")
            }) {
                HStack {
                    Image(systemName: "purchased.circle")
                        .foregroundStyle(.appTint)
                        .font(.body.bold())
                    Text("Restore")
                        .foregroundStyle(.appTint)
                }
            }
            .buttonStyle(.plain)
            Spacer()
            Button(action: {
                print("purchase!")
            }) {
                HStack {
                    Text("Purchase")
                        .foregroundStyle(.appTint)
                    Image(systemName: "dollarsign.circle")
                        .foregroundStyle(.appTint)
                        .font(.body.bold())
                }
            }
            .buttonStyle(.plain)
        }
    }
    
    
    
    // MARK: Version information
    
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
        hasRequestedHealthKitAuth = UserDefaultsService.get(forKey: Constants.hasRequestedHealthKitAuthorization) ?? false
        pickerDistanceUnit = UserDefaultsService.get(forKey: Constants.distanceUnit) ?? 0
        backgroundFetchEnabled = UserDefaultsService.get(forKey: Constants.hasBackgroundFetchEnabled) ?? false
    }
    
    /// Requests HealthKit authorization from the user
    /// Note: Due to HealthKit's privacy design, we cannot determine if the user
    /// granted or denied permission. We only track that the authorization sheet
    /// was shown. Actual access is verified when attempting to fetch workouts.
    private func requestHealthKitPermissions() async {
        do {
            try await healthKitWorkoutService.requestAccess()
            // Mark that we've shown the authorization sheet
            // This does NOT mean access was granted, only that the flow completed
            hasRequestedHealthKitAuth = true
            UserDefaultsService.set(value: true, forKey: Constants.hasRequestedHealthKitAuthorization)
            print("✅ HealthKit authorization flow completed")
        } catch {
            // Only catches device capability errors, not authorization denials
            print("❌ Failed to request HealthKit permissions: \(error)")
            hasRequestedHealthKitAuth = false
            UserDefaultsService.set(value: false, forKey: Constants.hasRequestedHealthKitAuthorization)
        }
    }
    
    private func openHealthAppsPage() {
        let url = URL(string: "x-apple-health://")!
        
        if UIApplication.shared.canOpenURL(url) {
            print("can open")
            UIApplication.shared.open(url)
        } else {
            print("cannot")
        }
    }
    
    private func importWorkouts() {
        print("import workouts!")
    }
    
    private var appVersionString: String {
        let version = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "?"
        return "v\(version)"
    }
}
