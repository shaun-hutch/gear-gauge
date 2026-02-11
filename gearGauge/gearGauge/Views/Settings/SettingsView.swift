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
    @State private var isSyncingWorkouts: Bool = false
    /// If the user has requested notification authorization
    @State private var hasRequestedNotificationAuth: Bool = false
    /// If notifications are currently enabled
    @State private var notificationsEnabled: Bool = false
    /// if the user has premium status (has purchased)
    @State private var hasPremium: Bool = false
    
    private let options: [String] = ["Kilometers", "Miles"]
    
    var healthKitWorkoutService: WorkoutServiceProtocol
    
    var workoutSyncService: WorkoutSyncServiceProtocol
    
    var body: some View {
        VStack {
            AppTitleView()
            List {
                Section(header: Text(.healthKit)) {
                    HealthKitToggleListItem
                    if hasRequestedHealthKitAuth {
                        healthKitOpenSettingsListItem
                    }
                    
                }
                
                Section(header: Text(.notifications)) {
                    NotificationToggleListItem
                    if hasRequestedNotificationAuth && !notificationsEnabled {
                        NotificationOpenSettingsListItem
                    }
                }
                
                Section(header: Text(.workoutLoading)) {
                    HealthKitBackgroundFetchListItem
                    if hasRequestedHealthKitAuth {
                        ImportWorkoutsListItem
                    }
                }
                
                Section(header: Text(.distanceUnit)) {
                    DistanceDenominationListItem
                }
                Section(header: Text(.premium)) {
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
                Text(.healthKitIntegration)
                Spacer()
                HStack {
                    Text(hasRequestedHealthKitAuth ? .requested : .request)
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
                    Text(.openInHealth)
                    Spacer()
                    HStack {
                        Text(.open)
                            .foregroundStyle(.appTint)
                        Image(systemName: "arrow.up.right.square.fill")
                            .foregroundStyle(.appTint)
                            .font(.body.bold())
                    }
                }
                Text(.inHealthProfilePrivacyAppsGearGauge)
                    .font(.caption2)
                    .foregroundStyle(.secondary)
            }
        }
        .buttonStyle(.plain) // Maintains list row appearance
    }
    
    // MARK: Notification section items
    
    /// Toggle for requesting notification permission
    var NotificationToggleListItem: some View {
        Toggle(isOn: Binding(
            get: { notificationsEnabled },
            set: { newValue in
                if newValue {
                    Task {
                        await requestNotificationPermissions()
                    }
                } else {
                    // User must disable in Settings app
                    openAppSettings()
                }
            }
        )) {
            Label(.workoutSyncAlerts, systemImage: "bell.fill")
        }
        .tint(.appTint)
    }
    
    /// Button to open iOS Settings app for notification permissions
    var NotificationOpenSettingsListItem: some View {
        Button(action: {
            openAppSettings()
        }) {
            HStack {
                Image(systemName: "gear")
                    .foregroundStyle(.appTint)
                Text(.openSettingsToEnableNotifications)
                    .foregroundStyle(.primary)
            }
        }
        .buttonStyle(.plain)
    }
    
    // MARK: Background fetch & import
    
    var HealthKitBackgroundFetchListItem: some View {
        Toggle(.backgroundFetch, isOn: $backgroundFetchEnabled)
            .tint(.appTint)
            .onChange(of: backgroundFetchEnabled) { _, newValue in
                UserDefaultsService.set(value: newValue, forKey: Constants.hasBackgroundFetchEnabled)
                
                if (newValue) {
                    Task {
                        workoutSyncService.startObserving()
                    }
                }
            }
    }
    
    var ImportWorkoutsListItem: some View {
        Button(action: {
            importWorkouts()
        }) {
            HStack (alignment: .center){
                if (isSyncingWorkouts) {
                    ProgressView()
                        .progressViewStyle(.circular)
                        .tint(.appTint)
                } else {
                    Image(systemName: "square.and.arrow.down")
                        .foregroundStyle(.appTint)
                        .font(.body.bold())
                }
                Text(isSyncingWorkouts ? .syncing : .syncWorkouts)
                    .foregroundStyle(.appTint)
                    .font(.body.bold())
                
            }
            .frame(maxWidth: .infinity, alignment: .center)
        }
        .disabled(isSyncingWorkouts)
    }
    
    // MARK: Distance unit section item
    
    var DistanceDenominationListItem: some View {
        Picker(.emptyString, selection: $pickerDistanceUnit) {
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
            Text(.status)
            Spacer()
            Text(hasPremium ? .premium : .free)
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
                    Text(.restore)
                        .foregroundStyle(.appTint)
                }
            }
            .buttonStyle(.plain)
            Spacer()
            Button(action: {
                print("purchase!")
            }) {
                HStack {
                    Text(.purchase)
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
            Text(.createdByShaunHutchinson)
                .font(.caption2)
        }
        .listRowBackground(Color(.clear))
        .frame(maxWidth: .infinity, alignment: .center)
    }
    
    
    private func loadSettings() {
        hasRequestedHealthKitAuth = UserDefaultsService.get(forKey: Constants.hasRequestedHealthKitAuthorization) ?? false
        pickerDistanceUnit = UserDefaultsService.get(forKey: Constants.distanceUnit) ?? 0
        backgroundFetchEnabled = UserDefaultsService.get(forKey: Constants.hasBackgroundFetchEnabled) ?? false
        hasRequestedNotificationAuth = UserDefaultsService.get(
            forKey: Constants.hasRequestedNotificationAuthorization
        ) ?? false
        
        // Load cached notification status immediately to prevent toggle flicker
        notificationsEnabled = UserDefaultsService.get(forKey: Constants.notificationsEnabled) ?? false
        
        // Then update with actual current status in background
        Task {
            notificationsEnabled = await NotificationService.shared.checkAuthorizationStatus()
        }
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
    
    /// Requests notification authorization from the user
    private func requestNotificationPermissions() async {
        let granted = await NotificationService.shared.requestAuthorization()
        hasRequestedNotificationAuth = true
        notificationsEnabled = granted
        
        // Cache the status for immediate access on next load
        UserDefaultsService.set(value: granted, forKey: Constants.notificationsEnabled)
        
        if !granted {
            print("⚠️ Notification permission denied - user must enable in Settings")
        }
    }
    
    /// Opens iOS Settings app to this app's page
    private func openAppSettings() {
        if let url = URL(string: UIApplication.openSettingsURLString) {
            UIApplication.shared.open(url)
        }
    }
    
    private func importWorkouts() {
        guard hasRequestedHealthKitAuth else { return }
        
        // Set syncing state to true immediately
        isSyncingWorkouts = true
        
        Task {
            do {
                try await workoutSyncService.syncWorkouts()
                print("✅ Workout sync completed")
            } catch {
                print("❌ Workout sync failed: \(error)")
            }
            
            // Reset syncing state when complete
            isSyncingWorkouts = false
        }
    }
    
    private var appVersionString: String {
        let version = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "?"
        return "v\(version)"
    }
}
