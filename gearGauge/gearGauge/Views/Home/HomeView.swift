//
//  HomeView.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 06/11/2025.
//

import SwiftUI
import SwiftData

struct HomeView: View {
    let gearStore: GearStoreProtocol
    @State private var gear: Gear
    
    var body: some View {
        if gear != nil {
            GaugeView(gear: gear)
        }
        
        
        
        
        // fetch primary gear
        
        // show distance
        
        
        VStack {
            Text(.home)
        }
        .onAppear {
            Task {
                gear = try gearStore.fetchPrimary()
            }
        }
    }
        
    
}


#Preview {
    HomeView(gearStore: MockGearStore())
}
