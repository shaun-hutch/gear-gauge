//
//  GaugeView.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 09/11/2025.
//

import SwiftUI

struct GaugeView: View {
    var gear: Gear
    
    @Environment(\.colorScheme) private var colorScheme
    
    // Track animation state
    @State private var animationProgress: CGFloat = 0
    
    private let lineWidth: CGFloat = 40
    
    var body: some View {
        ZStack {
            ProgressGauge(maxDistance: 1, currentDistance: 1, lineWidth: lineWidth)
                .stroke(.appTint.opacity(0.3), style: StrokeStyle(lineWidth: lineWidth, lineCap: .round, lineJoin: .round))
            
            .glassEffect()
            
            ProgressGauge(maxDistance: gear.maxDistance, currentDistance: gear.currentDistance, lineWidth: lineWidth)
                .trim(from: 0, to: animationProgress)
                .stroke(.appTint, style: StrokeStyle(lineWidth: lineWidth, lineCap: .round, lineJoin: .round))
       
                    .shadow(color: .white.opacity(0.5), radius: 2, x: 0, y: -1)
                    .shadow(color: .black.opacity(0.3), radius: 2, x: 0, y: 1)

            Image(systemName: gear.type.displayIcon)
                .font(.system(size: 100))
                .foregroundStyle(.appTint)
            
                .symbolRenderingMode(.hierarchical)
                .background(Circle()
                    .fill(.appTint.opacity(0.3))
                    .frame(width: 200, height: 200)
                    .glassEffect()
                )
        }
        .frame(width: 300, height: 300)
        .onAppear {
            animateProgress()
        }
        // if user creates a gear item
        .onChange(of: gear) {
            animateProgress()
        }
        
    }
    
    private func animateProgress() {
        withAnimation(.spring(response: 2, dampingFraction: 0.9)){
            animationProgress = 1
        }
    }
}

#Preview {
    var gear = Gear.SampleGear()
    gear.currentDistance = 500
    
    return GaugeView(gear: gear)
}
