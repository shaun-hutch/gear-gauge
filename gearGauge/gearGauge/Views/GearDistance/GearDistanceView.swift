//
//  GearDistanceView.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 13/12/2025.
//

import SwiftUI

struct GearDistanceView: View {
    var gear: Gear
    var frameSize: CGFloat = 200
    
    @State private var showRemaining: Bool = false // if true, the remaining distance (total - current) will be shown
    
    @State private var distanceUnit: Int = 0
    @State private var distanceUnitSuffix: String = "km"
    
    var body: some View {
        VStack {
            distanceLabel(gear)
        }
        .rotation3DEffect(
            .degrees(showRemaining ? 360 : 0),
            axis: (x: 0, y: 1, z: 0)
        )
        .onTapGesture {
            withAnimation(.spring(response: 0.2, dampingFraction: 0.9)) {
                showRemaining.toggle()
            }
        }
        .onAppear {
            distanceUnit = UserDefaultHelpers.distanceUnit
            distanceUnitSuffix = UserDefaultHelpers.distanceUnitSuffix
        }
    }
    
    func distanceLabel(_ mainGear: Gear) -> some View {
        
        #if os(watchOS)
        let distanceFontSize: CGFloat = 20
        let distanceLabelFontSize: CGFloat = 10
        #else
        let distanceFontSize: CGFloat = 70
        let distanceLabelFontSize: CGFloat = 20
        #endif
        
        
        let remainingNumber = mainGear.maxDistance - mainGear.currentDistance
        
        let currentDistanceValue = String(format: "%.0f", distanceUnit == 1 ? Double.ConvertToMi(mainGear.currentDistance) : mainGear.currentDistance)
        let remainingDistanceValue = String(format: "%.0f", distanceUnit == 1 ? abs(Double.ConvertToMi(remainingNumber)) : abs(remainingNumber))
                
        let label = showRemaining ? "\(remainingDistanceValue)" : "\(currentDistanceValue)"
        let suffix = showRemaining ? "\(distanceUnitSuffix) \(remainingNumber < 0 ? "over" : "remaining")" : "\(distanceUnitSuffix) logged"
        
        return VStack {
            Text(label)
                .foregroundStyle(.appTint)
                .font(.system(size: distanceFontSize))
                .fontWeight(.bold)
                .frame(alignment: .center)
            Text(suffix)
                .foregroundStyle(.appTint)
                .font(.system(size: distanceLabelFontSize))
                .fontWeight(.bold)
            .frame(alignment: .center)
                
        }
        
        .padding(20)
        
        
    }
}


#Preview {
    GearDistanceView(gear: Gear.SampleGear())
}
