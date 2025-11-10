//
//  HomeView.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 06/11/2025.
//

import SwiftUI
import SwiftData

struct HomeView: View {
    var gearStore: GearStoreProtocol
    
    @State private var gear: Gear?
    @State private var isLoading: Bool = true
    @State private var error: Error?
    
    var body: some View {
        Group {
            if isLoading {
                ProgressView()
            } else if let error = error {
                Text("unable to load gear")
            } else if let gear = gear {
                GaugeView(gear: gear)
            } else {
                Text("No primary gear")
            }
            
            
        }.onAppear {
            fetchPrimaryGear()
        }
        
    
        
    }
    
    private func fetchPrimaryGear() {
        isLoading = true
        error = nil
        
        do {
            gear = try gearStore.fetchPrimary()
            isLoading = false
        } catch {
            self.error = error
            isLoading = false
        }
    }
        
    
}


#Preview {
    HomeView(gearStore: MockGearStore())
}
