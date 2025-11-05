//
//  ContentView.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 02/11/2025.
//

import SwiftUI
import SwiftData

struct ContentView: View {
    @Environment(\.modelContext) private var modelContext
    @Query private var gearItems: [Gear]
    
    // Initialize stores using the environment's modelContext
    private var dataStore: DataStoreProtocol {
        DataStore(modelContext: modelContext)
    }
    
    private var gearStore: GearStoreProtocol {
        GearStore(dataStore: dataStore)
    }

    var body: some View {
        NavigationSplitView {
            List {
                ForEach(gearItems) { gear in
                    NavigationLink {
                        GearDetailView(gear: gear)
                    } label: {
                        GearRowView(gear: gear)
                    }
                }
                .onDelete(perform: deleteGear)
            }
            .navigationTitle("Gear")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    EditButton()
                }
                ToolbarItem {
                    Button(action: addGear) {
                        Label("Add Gear", systemImage: "plus")
                    }
                }
            }
        } detail: {
            Text("Select a gear item")
        }
    }

    private func addGear() {
        withAnimation {
            let newGear = Gear(
                name: "New Gear",
                type: .shoes,
                maxDistance: 500
            )
            
            do {
                try gearStore.create(gear: newGear)
            } catch {
                print("Failed to create gear: \(error)")
            }
        }
    }

    private func deleteGear(offsets: IndexSet) {
        withAnimation {
            for index in offsets {
                do {
                    try gearStore.delete(gear: gearItems[index])
                } catch {
                    print("Failed to delete gear: \(error)")
                }
            }
        }
    }
}

// MARK: - Gear Row View
struct GearRowView: View {
    let gear: Gear
    
    var body: some View {
        HStack {
            Image(systemName: gear.type.displayIcon)
                .foregroundStyle(.tint)
            
            VStack(alignment: .leading) {
                Text(gear.name)
                    .font(.headline)
                
                HStack {
                    Text("\(gear.currentDistance, specifier: "%.1f") km")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                    
                    if gear.isPrimary {
                        Image(systemName: "star.fill")
                            .font(.caption2)
                            .foregroundStyle(.yellow)
                    }
                }
            }
            
            Spacer()
            
            // Distance progress indicator
            if gear.maxDistance > 0 {
                CircularProgressView(
                    current: gear.currentDistance,
                    max: gear.maxDistance
                )
                .frame(width: 40, height: 40)
            }
        }
        .opacity(gear.isActive ? 1.0 : 0.5)
    }
}

// MARK: - Gear Detail View
struct GearDetailView: View {
    let gear: Gear
    
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: gear.type.displayIcon)
                .font(.system(size: 60))
                .foregroundStyle(.tint)
            
            Text(gear.name)
                .font(.title)
            
            Text(gear.type.displayName)
                .font(.subheadline)
                .foregroundStyle(.secondary)
            
            Divider()
            
            HStack {
                VStack {
                    Text("Current Distance")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                    Text("\(gear.currentDistance, specifier: "%.1f") km")
                        .font(.title2)
                }
                
                Spacer()
                
                VStack {
                    Text("Max Distance")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                    Text("\(gear.maxDistance, specifier: "%.0f") km")
                        .font(.title2)
                }
            }
            .padding()
            
            if let notes = gear.notes {
                VStack(alignment: .leading) {
                    Text("Notes")
                        .font(.headline)
                    Text(notes)
                        .font(.body)
                        .foregroundStyle(.secondary)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding()
            }
            
            Spacer()
        }
        .padding()
        .navigationTitle("Gear Details")
    }
}

// MARK: - Circular Progress View
struct CircularProgressView: View {
    let current: Double
    let max: Double
    
    private var progress: Double {
        guard max > 0 else { return 0 }
        return min(current / max, 1.0)
    }
    
    private var progressColor: Color {
        if progress >= 0.9 {
            return .red
        } else if progress >= 0.7 {
            return .orange
        } else {
            return .green
        }
    }
    
    var body: some View {
        ZStack {
            Circle()
                .stroke(lineWidth: 3)
                .opacity(0.3)
                .foregroundStyle(.gray)
            
            Circle()
                .trim(from: 0, to: progress)
                .stroke(style: StrokeStyle(lineWidth: 3, lineCap: .round))
                .foregroundStyle(progressColor)
                .rotationEffect(.degrees(-90))
                .animation(.easeInOut, value: progress)
            
            Text("\(Int(progress * 100))%")
                .font(.caption2)
                .fontWeight(.bold)
        }
    }
}

#Preview {
    ContentView()
        .modelContainer(SharedModelContainer.create(inMemory: true))
}
