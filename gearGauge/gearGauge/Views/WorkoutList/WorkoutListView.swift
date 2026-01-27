//
//  WorkoutListView.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 26/01/2026.
//

import SwiftUI
import SwiftData

struct WorkoutListView: View {
    
    var gear: Gear
    var amountToDisplay: Int = -1
    
    private var distanceUnit: Int {
        UserDefaultHelpers.distanceUnit
    }
    private var distanceUnitSuffix: String {
        UserDefaultHelpers.distanceUnitSuffix
    }
    
    private var filteredWorkouts: [Workout] {
        guard let workouts = gear.workouts else { return [] }
        var filtered = workouts.sorted(by: { $0.endDate > $1.endDate })
        
        if amountToDisplay != -1 {
            filtered = filtered.prefix(amountToDisplay).map { $0 }
        }
        
        return filtered
    }
    
    var body: some View {
        VStack {
            List {
                ForEach(filteredWorkouts, id: \.self) { wo in
                    VStack {
                        Text(wo.workoutType.displayName)
                            .font(.headline)
                        Text("\(wo.totalDistance as NSNumber, formatter: FormatHelpers.numberFormatterNoGrouping) \(distanceUnitSuffix)")
                            .font(.subheadline)
                    }
                }
            }
            .listStyle(.plain)
            .scrollContentBackground(.hidden)
            .background(.clear)
        }
        .onAppear {
            print("amount of workouts: \(gear.name) \(gear.workouts?.count ?? 0)")
        }
    }
    
    
}


#Preview {
    WorkoutListView(gear: Gear.SampleGear())
}
