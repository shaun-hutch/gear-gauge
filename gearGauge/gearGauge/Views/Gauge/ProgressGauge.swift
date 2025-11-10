//
//  Gauge.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 09/11/2025.
//

import SwiftUI

struct ProgressGauge: Shape {
    let maxDistance: Double
    let currentDistance: Double
    let lineWidth: CGFloat
    
    init(maxDistance: Double, currentDistance: Double, lineWidth: CGFloat) {
        self.maxDistance = maxDistance
        self.currentDistance = currentDistance
        self.lineWidth = lineWidth
    }
    
    private var percentage: Double {
        return currentDistance / maxDistance
    }
    
    private var startAngle: Angle = Angle(degrees: -90)
    private var endAngle: Angle {
        Angle(degrees: -90 + (360 * CGFloat(percentage)))
    }
    
    func path(in rect: CGRect) -> Path {
        let center = CGPoint(x: rect.midX, y: rect.midY)
        let radius = min(rect.width, rect.height) / 2
        return Path { path in
            path.addArc(center: center, radius: radius - (lineWidth / 2), startAngle: startAngle, endAngle: endAngle, clockwise: false)
        }
    }
    
    
}
