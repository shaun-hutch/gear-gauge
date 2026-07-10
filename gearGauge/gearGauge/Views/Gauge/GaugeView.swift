//
//  GaugeView.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 09/11/2025.
//

import SwiftUI

// MARK: - GaugeView

struct GaugeView: View {
    var gear: Gear
    
    @Environment(\.colorScheme) private var colorScheme
    
    #if os(watchOS)
    private let frameSize: CGFloat = 200
    private let lineWidth: CGFloat = 30
    #else
    private let frameSize: CGFloat = 300
    private let lineWidth: CGFloat = 40
    #endif
    
    /// Upper bound for the gauge range — clamps to at least the current distance
    /// so the ring still renders sensibly when over max (e.g., overdue replacement)
    private var gaugeUpperBound: Double {
        max(gear.maxDistance, gear.currentDistance)
    }
    
    var body: some View {
        VStack(spacing: 16) {
            Gauge(value: gear.currentDistance, in: 0...gaugeUpperBound) {
                // Hidden visually; VoiceOver can still read the gear name.
                Text(gear.name)
                    .accessibilityHidden(true)
            } currentValueLabel: {
                // Minimal centre number — the rich tap‑to‑flip label lives below.
                Text(gear.currentDistance, format: .number.precision(.fractionLength(0)))
                    .font(.system(size: frameSize * 0.12, weight: .bold))
                    .foregroundStyle(.appTint)
            }
            .gaugeStyle(CircularGaugeStyle(lineWidth: lineWidth))
            .tint(.appTint)
            .frame(width: frameSize, height: frameSize)
            
            // Rich distance label with tap‑to‑flip between logged / remaining.
            GearDistanceView(gear: gear, frameSize: frameSize * 0.6)
        }
    }
}

// MARK: - Custom GaugeStyle

/// A full‑size circular gauge style that respects the container frame.
/// Unlike `.accessoryCircular`, this draws a thick progress ring suitable
/// for the main app interface rather than a Watch complication.
struct CircularGaugeStyle: GaugeStyle {
    /// Stroke width of the gauge ring.
    let lineWidth: CGFloat
    
    func makeBody(configuration: Configuration) -> some View {
        // `configuration.value` is already normalised to 0…1 by the Gauge component.
        let fraction = configuration.value
        
        return ZStack {
            // Background track — full circle.
            Circle()
                .stroke(.appTint.opacity(0.3), lineWidth: lineWidth)
                .glassEffect()
            
            // Progress arc — clockwise from 12 o'clock.
            // Using Path.addArc instead of Circle().trim() avoids the
            // visual artifact of a line drawn from the centre to the arc ends.
            ArcShape(fraction: fraction)
                .stroke(.appTint,
                        style: StrokeStyle(lineWidth: lineWidth, lineCap: .round, lineJoin: .round))
                .shadow(color: .white.opacity(0.5), radius: 2, x: 0, y: -1)
                .shadow(color: .black.opacity(0.3), radius: 2, x: 0, y: 1)
            
            // Centre label.
            configuration.currentValueLabel
        }
        .padding(lineWidth / 2) // prevent the stroke from clipping at edges
    }
}

// MARK: - Arc Shape

/// Draws a circular arc from 12 o'clock clockwise, used by `CircularGaugeStyle`
/// to avoid the centre‑line artifact that `Circle().trim()` produces.
private struct ArcShape: Shape {
    let fraction: Double // 0…1
    
    func path(in rect: CGRect) -> Path {
        let center = CGPoint(x: rect.midX, y: rect.midY)
        let radius = min(rect.width, rect.height) / 2
        
        return Path { path in
            path.addArc(
                center: center,
                radius: radius,
                startAngle: .degrees(-90),                           // 12 o'clock
                endAngle: .degrees(-90 + 360 * fraction),            // clockwise
                clockwise: false
            )
        }
    }
}

#Preview {
    let gear = Gear.SampleGear()
    gear.initialDistance = 900
    
    return GaugeView(gear: gear)
}
