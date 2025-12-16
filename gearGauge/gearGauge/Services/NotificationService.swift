//
//  NotificationService.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 17/12/2025.
//

import UserNotifications
import Foundation

/// Service responsible for managing local notifications
/// Handles permission requests and scheduling notifications for workout syncs
@MainActor
final class NotificationService {
    
    // MARK: - Singleton
    
    /// Shared instance for app-wide notification management
    static let shared = NotificationService()
    
    private init() {}
    
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
        return settings.authorizationStatus == .authorized
    }
    
    // MARK: - Workout Sync Notifications
    
    /// Sends a notification when workouts are synced from HealthKit
    /// - Parameters:
    ///   - count: Number of workouts synced
    ///   - gearNames: Optional array of gear names that received workouts
    func sendWorkoutSyncNotification(count: Int, gearNames: [String]? = nil) async {
        // Check if we have permission
        guard await checkAuthorizationStatus() else {
            print("⚠️ Cannot send notification - no authorization")
            return
        }
        
        // Don't send notification if no workouts were synced
//        guard count > 0 else {
//            return
//        }
        
        // Create notification content
        let content = UNMutableNotificationContent()
        content.title = "Workouts Synced"
        
        // Build message based on count and gear
        if count == 1 {
            content.body = "1 new workout has been added"
        } else if count == 0 {
            content.body = "No new workouts have been synced" // TEST NOTIFICATION
        } else {
            content.body = "\(count) new workouts have been added"
        }
        
        // Add gear information if provided
        if let gearNames = gearNames, !gearNames.isEmpty {
            let gearList = gearNames.prefix(3).joined(separator: ", ")
            let suffix = gearNames.count > 3 ? " and \(gearNames.count - 3) more" : ""
            content.body += " to \(gearList)\(suffix)"
        }
        
        content.sound = .default
        content.badge = NSNumber(value: count)
        
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
    func clearWorkoutNotifications() {
        UNUserNotificationCenter.current().removeAllDeliveredNotifications()
        UNUserNotificationCenter.current().setBadgeCount(0)
        print("🧹 Cleared workout notifications")
    }
}
