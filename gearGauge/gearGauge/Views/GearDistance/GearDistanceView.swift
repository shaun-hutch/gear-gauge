//
//  GearDistanceView.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 13/12/2025.
//

import SwiftUI

struct GearDistanceView: View {
    var gear: Gear
    
    @State private var isAnimating: Bool = false
    @State private var showRemaining: Bool = false // if true, the remaining distance (total - current) will be shown
    
    var body: some View {
        ZStack {
            Circle()
                .fill(.appTint.opacity(0.3))
                .frame(width: 200, height: 200)
                .glassEffect()
                .scaleEffect(isAnimating ? 1.05 : 1.0)
            
            VStack {
                distanceLabel(gear)
            }
            .rotation3DEffect(
                .degrees(showRemaining ? 360 : 0),
                axis: (x: 0, y: 1, z: 0)
            )
        }
        .onTapGesture {
            withAnimation(.spring(response: 0.2, dampingFraction: 0.9)) {
                showRemaining.toggle()
            }
            
            // Pulse effect
            withAnimation(.easeOut(duration: 0.2)) {
                isAnimating = true
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
                withAnimation(.easeIn(duration: 0.2)) {
                    isAnimating = false
                }
            }
        }
    }
    
    func distanceLabel(_ mainGear: Gear) -> some View {
        let unit = UserDefaultHelpers.distanceUnitSuffix
        
        let currentDistanceValue = String(format: "%.0f", mainGear.currentDistance)
        let remainingDistanceValue = String(format: "%.0f", mainGear.maxDistance - mainGear.currentDistance)
                
        let label = showRemaining ? "\(remainingDistanceValue)" : "\(currentDistanceValue)"
        let suffix = showRemaining ? "\(unit) remaining" : "\(unit) logged"
        
        return VStack {
            

            Text(label)
                .foregroundStyle(.appTint)
                .font(.system(size: 70))
                .frame(alignment: .center)
            Text(suffix)
                .foregroundStyle(.appTint)
                .font(.system(size: 20))
            .frame(alignment: .center)
                
        }
        
        .padding(20)
        
        
    }
}


#Preview {
    GearDistanceView(gear: Gear.SampleGear())
}
