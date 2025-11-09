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
    
    var body: some View {
        VStack {
            Circle()
                .strokeBorder(lineWidth: 20)
                .overlay {
                    VStack {
                        Image(systemName: gear.type.displayIcon)
                            .font(.system(size: 240))
                            .foregroundStyle(Color.appTintColor)
                        
                    }
                }
                .overlay {
                    ProgressGauge(maxDistance: gear.maxDistance, currentDistance: gear.currentDistance)
                        .stroke(colorScheme == .dark ? Color.black : Color.white, style: StrokeStyle(lineWidth: 16, lineCap: .round, lineJoin: .round))
                }
                .frame(width: 300, height: 300)
                .foregroundStyle(Color.appTintColor)
            
            
        }
        .padding()
    }
}

#Preview {
    GaugeView(gear: Gear.SampleGear())
}
