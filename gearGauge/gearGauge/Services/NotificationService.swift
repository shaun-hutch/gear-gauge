//
//  NotificationService.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 17/12/2025.
//

import UserNotifications
import Foundation
import UIKit

/// Service responsible for managing local notifications
/// Handles permission requests and scheduling notifications for workout syncs
@MainActor
final class NotificationService: NSObject, UNUserNotificationCenterDelegate {
    
    // MARK: - Singleton
    
    /// Shared instance for app-wide notification management
    static let shared = NotificationService()
    
    private override init() {
        super.init()
        // Set self as delegate to handle notification interactions
        UNUserNotificationCenter.current().delegate = self
    }
    
    // MARK: - Authorization
    
    /// Requests notification permission from the user
    /// Shows the system authorization alert
    /// - Returns: True if permission was granted, false otherwise
    func requestAuthorization() async -> Bool {
        do {
            let granted = try await UNUserNotificationCenter.current()
                .requestAuthorization(options: [.alert, .sound, .badge])
            
            if granted {
                print("✅ Notification permission granted")
                UserDefaultsService.set(value: true, forKey: Constants.hasRequestedNotificationAuthorization)
            } else {
                print("⚠️ Notification permission denied")
            }
            
            return granted
        } catch {
            print("❌ Failed to request notification permission: \(error)")
            return false
        }
    }
    
    /// Checks the current notification authorization status
    /// - Returns: True if notifications are authorized, false otherwise
    func checkAuthorizationStatus() async -> Bool {
        let settings = await UNUserNotificationCenter.current().notificationSettings()
        let isAuthorized = settings.authorizationStatus == .authorized
        
        // Cache the result in UserDefaults for immediate access on next load
        UserDefaultsService.set(value: isAuthorized, forKey: Constants.notificationsEnabled)
        
        return isAuthorized
    }
    
    // MARK: - Workout Sync Notifications
    
    /// Sends a notification when workouts are synced from HealthKit
    /// - Parameters:
    ///   - count: Number of workouts synced
    ///   - gearNames: Optional array of gear names that received workouts
    func sendWorkoutSyncNotification(count: Int) async {
        // Check if we have permission
        guard await checkAuthorizationStatus() else {
            print("⚠️ Cannot send notification - no authorization")
            return
        }
                
        // Create notification content
        let content = UNMutableNotificationContent()
        content.title = "Workouts Synced"
        
        // Build message based on count and gear
        if count == 1 {
            content.body = "1 new workout has been added"
        } else if count == 0 {
            content.body = "No new workouts have been synced"
        } else {
            content.body = "\(count) new workouts have been added"
        }
        
        content.sound = .default
        
        // Create trigger (deliver immediately)
        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 1, repeats: false)
        
        // Create request with unique identifier
        let identifier = "workout-sync-\(UUID().uuidString)"
        let request = UNNotificationRequest(identifier: identifier, content: content, trigger: trigger)
        
        // Schedule notification
        do {
            try await UNUserNotificationCenter.current().add(request)
            print("📬 Workout sync notification scheduled")
        } catch {
            print("❌ Failed to schedule notification: \(error)")
        }
    }
    
    /// Clears all delivered workout sync notifications
    /// Call this when user opens the app to reset badge count
    func clearWorkoutNotifications() async {
        UNUserNotificationCenter.current().removeAllDeliveredNotifications()
        try? await UNUserNotificationCenter.current().setBadgeCount(0)
        print("🧹 Cleared workout notifications")
    }
    
    // MARK: - UNUserNotificationCenterDelegate
    
    /// Called when user taps on a notification
    /// Clears the badge count
    ///
    /// Note: `nonisolated` exempts this method from @MainActor isolation since
    /// system delegate callbacks are invoked on background threads.
    nonisolated func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        didReceive response: UNNotificationResponse,
        withCompletionHandler completionHandler: @escaping () -> Void
    ) {
        Task {
            try? await center.setBadgeCount(0)
            print("👆 Notification tapped - Badge cleared")
            completionHandler()
        }
    }
    
    /// Called when a notification arrives while app is in foreground
    /// Suppresses notification display since user is already using the app
    nonisolated func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        willPresent notification: UNNotification,
        withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
    ) {
        // Don't show notification when app is in foreground
        completionHandler([])
    }
}
