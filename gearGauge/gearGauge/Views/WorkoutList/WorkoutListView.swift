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
    
    private var distanceUnit: Int {
        UserDefaultHelpers.distanceUnit
    }
    private var distanceUnitSuffix: String {
        UserDefaultHelpers.distanceUnitSuffix
    }
    
    var body: some View {
        VStack {
            if let workouts = gear.workouts {
                List {
                    ForEach(workouts, id: \.self) { wo in
                        VStack {
                            Text(wo.workoutType.displayName)
                                .font(.headline)
                            Text("\(wo.totalDistance.rounded(toPlaces: 1)) \(distanceUnitSuffix)")
                                .font(.subheadline)
                        }
                    }
                }
                .listStyle(.plain)
                .scrollContentBackground(.hidden)
                .background(.clear)
                
            }
        }
    }
}


#Preview {
    WorkoutListView(gear: Gear.SampleGear())
}
