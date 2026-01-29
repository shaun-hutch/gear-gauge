//
//  WorkoutListCard.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 29/01/2026.
//

import SwiftUI

struct WorkoutListCard: View {
    var workout: Workout
    
    private var distanceUnit: Int {
        UserDefaultHelpers.distanceUnit
    }
    private var distanceUnitSuffix: String {
        UserDefaultHelpers.distanceUnitSuffix
    }
    
    var body: some View {
        VStack {
            HStack {
                Image(systemName: workout.workoutType.displayIcon)
                    .foregroundStyle(.appTint)
                    .font(.system(size: 40))
                
                VStack(alignment: .leading) {
                    Text(workout.workoutType.displayName)
                        .font(.headline)
                        .foregroundStyle(.appTint)
                    Text("\(workout.totalDistance as NSNumber, formatter: FormatHelpers.numberFormatterNoGrouping) \(distanceUnitSuffix)")
                        .font(.subheadline)
                        .foregroundStyle(.appTint)
                    
                }
                Spacer()
                VStack {
                    Text(workout.startDate, formatter: FormatHelpers.workoutDateFormatter)
                        .font(.caption)
                        .foregroundStyle(.appTint)
                        .frame(width: 80, alignment: .trailing)
                }
            }
        }
        .padding(12)
        .background(.appTint.opacity(0.2))
        .containerShape(.rect(cornerRadius: 20, style: .continuous))
        .glassEffect(in: .rect(cornerRadius: 20))
        .listRowInsets(EdgeInsets(top: 8, leading: 30, bottom: 8, trailing: 30))
        .listRowBackground(Color.clear)
        .listRowSeparator(.hidden)
    }
}

#Preview {
    WorkoutListCard(workout: Workout.SampleWorkouts()[0])
}
