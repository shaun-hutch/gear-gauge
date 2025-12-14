//
//  AppTitleView.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 14/12/2025.
//

import SwiftUI

struct AppTitleView : View {
    var body: some View {
        Text("GearGauge")
            .font(Font.customFont(size: 45))
            .foregroundStyle(.appTint)
    }
}

#Preview {
    AppTitleView()
}
