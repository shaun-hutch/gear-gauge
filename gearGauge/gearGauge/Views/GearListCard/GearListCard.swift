//
//  GearListCard.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 24/01/2026.
//

import SwiftUI

struct GearListCard : View {
    var gear: Gear
    
    @State private var distanceUnit: Int = 0
    @State private var distanceUnitSuffix: String = "km"
    
    var body: some View {
        VStack {
            HStack {
                VStack(alignment: .leading) {
                    Text(gear.name)
                        .font(.largeTitle.bold())
                        .foregroundStyle(.appTint)
                    
                    Text(distanceLabel)
                        .font(.subheadline.bold())
                        .foregroundStyle(.appTint)
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
            }
        }
        .padding(12)
        .background(.appTint.opacity(0.2))
        .containerShape(.rect(cornerRadius: 20, style: .continuous))
        .glassEffect(in: .rect(cornerRadius: 20))
        .listRowInsets(EdgeInsets(top: 8, leading: 12, bottom: 8, trailing: 12))
        .listRowBackground(Color.clear)
        .listRowSeparator(.hidden)
        .onAppear {
            distanceUnit = UserDefaultHelpers.distanceUnit
            distanceUnitSuffix = UserDefaultHelpers.distanceUnitSuffix
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
