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
    
    private let lineWidth: CGFloat = 50
    
    var body: some View {
        VStack {
            Circle()
                .strokeBorder(lineWidth: lineWidth)
                .overlay {
                    VStack {
                        Image(systemName: gear.type.displayIcon)
                            .font(.system(size: 120))
                            .foregroundStyle(Color.appTintColor)
                        
                    }
                }
                .overlay {
                    ProgressGauge(maxDistance: gear.maxDistance, currentDistance: gear.currentDistance, lineWidth: lineWidth)
                        .stroke(Color.appTintColor, style: StrokeStyle(lineWidth: lineWidth, lineCap: .round, lineJoin: .round))
                }
                .frame(width: 300, height: 300) // 150 radius
                .foregroundStyle(Color.appTintColor.opacity(0.3))
            
            
        }
        .padding()
    }
}

#Preview {
    var gear = Gear.SampleGear()
    gear.currentDistance = 1000
    
    return GaugeView(gear: gear)
}
