//
//  WorkoutListView.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 26/01/2026.
//

import SwiftUI
import SwiftData

struct WorkoutListView: View {
    
    /// Dismiss handler for closing the sheet
    @Environment(\.dismiss) private var dismiss
    
    var gear: Gear
    var amountToDisplay: Int = -1
    
    private var filteredWorkouts: [Workout] {
        guard let workouts = gear.workouts else { return [] }
        var filtered = workouts.sorted(by: { $0.endDate > $1.endDate })
        
        if amountToDisplay != -1 {
            filtered = filtered.prefix(amountToDisplay).map { $0 }
        }
        
        return filtered
    }
    
    var body: some View {
        NavigationStack {
            VStack {
                if amountToDisplay == -1 {
                    GaugeView(gear: gear)
                        .padding(.top, 20)
                }
                List {
                    ForEach(filteredWorkouts, id: \.self) { wo in
                        WorkoutListCard(workout: wo)
                    }
                }
                .listStyle(.plain)
                .scrollContentBackground(.hidden)
                .background(.clear)
            }
        }
        .toolbar {
            ToolbarItem(placement: .cancellationAction) {
                CancelButton
            }
        }
    }
    
    var CancelButton: some View {
        Button(action: {
            dismiss()
        }) {
            Image(systemName: "xmark")
                .foregroundStyle(.appTint)
        }
    }
    
    
}


#Preview {
    WorkoutListView(gear: Gear.SampleGear())
}
