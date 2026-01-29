//
//  GearListCard.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 24/01/2026.
//

import SwiftUI

struct GearListCard : View {
    var gear: Gear
    
    @State private var showWorkoutHistory: Bool = false
    
    private var distanceUnit: Int {
        UserDefaultHelpers.distanceUnit
    }
    private var distanceUnitSuffix: String {
        UserDefaultHelpers.distanceUnitSuffix
    }
    
    var body: some View {
        VStack {
            HStack {
                VStack(alignment: .leading) {
                    HStack {
                        Text(gear.name)
                            .font(.largeTitle.bold())
                            .foregroundStyle(.appTint)
                        
                        // Primary badge
                        if gear.isPrimary {
                            Image(systemName: "star.fill")
                                .foregroundStyle(.yellow)
                                .font(.title3)
                        }
                        
                        Spacer()
                    }
                    HStack(spacing: 8) {
                        Text(distanceLabel)
                            .font(.subheadline.bold())
                            .foregroundStyle(.appTint)
                        
                        // Status badges
                        if gear.endDate != nil {
                            Label("Retired", systemImage: "archivebox.fill")
                                .font(.caption)
                                .padding(6)
                                .background(.red.opacity(0.2))
                                .foregroundStyle(.red)
                                .cornerRadius(16)
                        } else if !gear.isActive {
                            Label("Inactive", systemImage: "pause.circle.fill")
                                .font(.caption)
                                .padding(6)
                                .background(.gray.opacity(0.2))
                                .foregroundStyle(.gray)
                                .cornerRadius(16)
                        }
                    }
                }
                Spacer()
                VStack {
                    Image(systemName: gear.type.displayIcon)
                        .foregroundStyle(.appTint)
                        .font(.title)
                }
            }
            .padding(.bottom, 4)
            HStack {
                ForEach(gear.workoutTypes) { woType in
                    Image(systemName: woType.displayIcon)
                        .font(.title)
                        .foregroundStyle(.appTint)
                }
                Spacer()
                Button(action: {
                    showWorkoutHistory = true
                }) {
                    HStack {
                        Image(systemName: "clock")
                            .font(.title)
                            .foregroundStyle(.appTint)
                        Text("Workouts")
                            .font(.headline)
                            .fontWeight(.regular)
                            .foregroundStyle(.appTint)
                    }
                    
                }
                .buttonStyle(.borderless)
            }
            
            if (gear.workouts != nil && !(gear.workouts?.isEmpty ?? false)) {
                // button for exercise history
            }
        }
        .padding(12)
        .background(.appTint.opacity(0.2))
        .containerShape(.rect(cornerRadius: 20, style: .continuous))
        .glassEffect(in: .rect(cornerRadius: 20))
        .listRowInsets(EdgeInsets(top: 8, leading: 12, bottom: 8, trailing: 12))
        .listRowBackground(Color.clear)
        .listRowSeparator(.hidden)
        .sheet(isPresented: $showWorkoutHistory) {
            WorkoutListView(gear: gear)
                .presentationDetents([.medium, .large])
        }
    }
    
    var distanceLabel: String {
        
        let currentDistanceValue = String(format: "%.0f", distanceUnit == 1 ? Double.ConvertToMi(gear.currentDistance) : gear.currentDistance)
        
        let maxDistanceValue = String(format: "%.0f", distanceUnit == 1 ? Double.ConvertToMi(gear.maxDistance) : gear.maxDistance)
        
        return "\(currentDistanceValue) / \(maxDistanceValue) \(distanceUnitSuffix)"
        
        
    }
    
    
}

#Preview {
    GearListCard(gear: Gear.SampleGear())
}
