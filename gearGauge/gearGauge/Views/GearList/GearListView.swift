//
//  GearListView.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 06/11/2025.
//

import SwiftUI
import SwiftData

struct GearListView: View {
    // MARK: - Dependencies
    
    
    /// ViewModel that manages gear data and operations
    /// Provides access to all gear items and handles loading/error states
    var gearViewModel: GearViewModel
    
    // MARK: - State
    
    @State private var selectedGear: Gear?
    @State private var isCreating: Bool = false
    @State private var gearToDelete: Gear?
    @State private var showDeleteConfirmation = false
    
    var body: some View {
        ZStack {
            VStack {
                AppTitleView()
                List {
                    ForEach (gearViewModel.allGear, id: \.id) { gear in
                        GearListCard(gear: gear)
                            .onTapGesture {
                                selectedGear = gear
                            }
                            .swipeActions(edge: .trailing, allowsFullSwipe: false) {
                                Button(role: .destructive) {
                                    gearToDelete = gear
                                    showDeleteConfirmation = true
                                } label: {
                                    Label("Delete", systemImage: "trash")
                                }
                            }
                    }
                    
                }
                .listStyle(.plain)
                .scrollContentBackground(.hidden)
                .background(.clear)
                .contentMargins(.bottom, 100, for: .scrollContent)
            }
            .onAppear {
                getList()
            }
            .sheet(item: $selectedGear, onDismiss: {
                getList()
            }) { gear in
                EditGearView(
                    gearViewModel: gearViewModel,
                    existingGear: gear,
                    readOnly: true
                )
            }
            .sheet(isPresented: $isCreating, onDismiss: {
                getList()
            }) {
                EditGearView(
                    gearViewModel: gearViewModel
                )
            }
            .alert(
                "Delete \(gearToDelete?.name ?? "gear")?",
                isPresented: $showDeleteConfirmation
            ) {
                Button(.deleteButtonLabel, role: .destructive) {
                    if let gear = gearToDelete {
                        deleteGear(gear)
                    }
                }
                Button(.cancel, role: .cancel) {
                    gearToDelete = nil
                }
            } message: {
                Text(.deleteConfirmationMessage)
            }
        
            VStack {
                Spacer()
                HStack {
                    Spacer()
                    Button(action: {
                        isCreating = true
                    }) {
                        HStack {
                            Text(.addGear)
                                .font(.default).bold()
                                .foregroundStyle(.appTint)
                                .padding(.leading, 16)
                            Image(systemName: "plus")
                                .font(.title)
                                .foregroundStyle(.appTint)
                                .frame(width: 56, height: 56)
                        }
                    }
                    .buttonBorderShape(.circle)
                    .glassEffect(.regular.tint(.clear).interactive())
                    .padding(20)
                    .background(.clear)
                    
                }
            }
        }
    }
    
    // MARK: - Private Methods
    
    /// Deletes the specified gear item
    private func deleteGear(_ gear: Gear) {
        gearViewModel.deleteGear(gear)
        gearToDelete = nil
        getList()
    }
    
    private func getList() {
        gearViewModel.fetchAllGear()
    }
}

#Preview {
    /// Create shared model container for preview
    let container = SharedModelContainer.create(inMemory: true)
    let context = container.mainContext
    
    // Create and insert sample gear directly into context
    
    let retiredGear = Gear.SampleGear()
    retiredGear.isPrimary = false
    retiredGear.isActive = false
    retiredGear.endDate = Date()
    
    let nonPrimaryGear = Gear.SampleGear()
    nonPrimaryGear.isPrimary = false
    
    let inactiveGear = Gear.SampleGear()
    inactiveGear.isPrimary = false
    inactiveGear.isActive = false
    
    context.insert(Gear.SampleGear())
    context.insert(retiredGear)
    context.insert(nonPrimaryGear)
    context.insert(inactiveGear)
    
    
    try? context.save()
    
    // Create data store and gear store with the same context
    let mockDataStore = DataStore(modelContext: context)
    let mockGearStore = GearStore(dataStore: mockDataStore)
    
    // Create ViewModel with mock store
    let viewModel = GearViewModel(gearStore: mockGearStore)
    
    return GearListView(gearViewModel: viewModel)
        .modelContainer(container)
}
