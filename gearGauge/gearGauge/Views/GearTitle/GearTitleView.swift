//
//  GearIconView.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 13/12/2025.
//

import SwiftUI

struct GearTitleView: View {
    var type: GearType = .shoes
    var name: String
    
    
    var body: some View {
        HStack {
            iconImage
            nameLabel
            Spacer()

        }
        .padding(4)
    }
    
    var iconImage: some View {
        Image(systemName: type.displayIcon)
            .font(.system(size: 30))
            .foregroundStyle(.appTint)
            .background(RoundedRectangle(cornerRadius: 20)
                .fill(.appTint.opacity(0.3))
                .frame(width: 80, height: 50)
            )
            .frame(width: 80, height: 50)
            .glassEffect(in: .rect(cornerRadius: 20))
    }
    
    var nameLabel: some View {
        Text(name)
            .font(.title)
            .foregroundStyle(.appTint)
            .frame(alignment: .trailing)
    }
}

#Preview {
    GearTitleView(type: .shoes, name: "Asics Gel Kayano 30")
    
    GearTitleView(type: .bicycle, name: "Some Cool Bike 2")
}
