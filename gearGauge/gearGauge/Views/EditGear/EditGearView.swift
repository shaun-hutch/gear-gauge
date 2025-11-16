//
//  EditGearView.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 06/11/2025.
//

import SwiftUI
import SwiftData

struct EditGearView: View {
    // MARK: - Environment
    
    /// Dismiss handler for closing the sheet
    @Environment(\.dismiss) private var dismiss
    
    // MARK: - Dependencies
    
    /// ViewModel for gear operations (loading and saving)
    var gearViewModel: GearViewModel
    
    /// The gear being edited (nil if creating new gear)
    var existingGear: Gear?
    
    // MARK: - Local State
    
    /// Local editable state for the gear being created/edited
    @State private var name: String = ""
    @State private var type: GearType = .shoes
    
    /// Distance values (may be in km or miles depending on user preference, always save in km)
    @State private var currentDistance: Double = 0
    @State private var maxDistance: Double = 0
    
    @State private var notes: String = ""
    @State private var isPrimary: Bool = false
    @State private var isActive: Bool = true
    @State private var startDate: Date = Date()
    
    /// What workout types the gear is for
    @State private var workoutTypes: [WorkoutType] = []
    
    /// Validation error message
    @State private var validationError: String?
    
    // MARK: - Computed Properties
    
    /// True if creating new gear, false if editing existing
    private var isNewGear: Bool {
        existingGear == nil
    }
    
    
    var body: some View {
        NavigationStack {
            Form {
                Section(header: Text("Details")) {
                    GearNameField
                    GearTypeField
                }
                
                Section(header: Text("Notes")) {
                    GearNotesField
                }
                
                Section(header: Text("Distance")) {
                    // TODO: Add distance input fields
                    // TODO: Respect user's distance unit preference
                }
                
                Section {
                    Toggle("Primary Gear", isOn: $isPrimary)
                    Toggle("Active", isOn: $isActive)
                }
                
                if let error = validationError {
                    Section {
                        Text(error)
                            .foregroundStyle(.red)
                            .font(.caption)
                    }
                }
            }
            .navigationTitle(isNewGear ? "New Gear" : "Edit Gear")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button(action: {
                        dismiss()
                    }) {
                        Image(systemName: "xmark")
                            .foregroundStyle(.appTint)
                    }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button(action: {
                        saveGear()
                    }) {
                        Image(systemName: "checkmark")
                            .foregroundStyle(.appTint)
                    }
                    .disabled(name.isEmpty)
                }
            }
            .onAppear {
                loadGear()
            }
        }
    }
    
    // MARK: UI edit components
    var GearNameField: some View {
        TextField("Name", text: $name)
            .textContentType(.name)
    }
    
    var GearTypeField: some View {
        Picker("Type", selection: $type) {
            ForEach(GearType.allCases, id: \.self) {
                Text($0.rawValue.capitalized)
            }
        }
        .pickerStyle(.menu)
        .tint(.appTint)
    }
    
    var GearNotesField: some View {
        TextEditor(text: $notes)
            .frame(minHeight: 100)
            .background(Color.clear)
    }
    
    
    // MARK: - Private Methods
    
    /// Load gear data into local state for editing
    /// If existingGear is nil, uses default values for new gear
    private func loadGear() {
        // if existingGear has been populated
        if let gear = existingGear {
            // Edit mode - populate from existing gear
            name = gear.name
            type = gear.type
            currentDistance = gear.currentDistance
            maxDistance = gear.maxDistance
            notes = gear.notes ?? ""
            isPrimary = gear.isPrimary
            isActive = gear.isActive
            startDate = gear.startDate
            workoutTypes = gear.workoutTypes
        } else {
            // New gear mode - use defaults
            name = ""
            type = .shoes
            currentDistance = 0
            maxDistance = 1000 // Default max distance
            notes = ""
            isPrimary = false
            isActive = true
            startDate = Date()
            workoutTypes = []
        }
    }
    
    /// Save gear using the view model
    /// Creates new gear or updates existing gear depending on mode
    private func saveGear() {
        // Validate
        guard !name.isEmpty else {
            validationError = "Name is required"
            return
        }
        
        guard maxDistance > 0 else {
            validationError = "Max distance must be greater than 0"
            return
        }
        
        validationError = nil
        
        // if there is existing gear, update that
        if let gear = existingGear {
            // Update existing gear
            gear.name = name
            gear.type = type
            gear.currentDistance = currentDistance
            gear.maxDistance = maxDistance
            gear.notes = notes.isEmpty ? nil : notes
            gear.isPrimary = isPrimary
            gear.isActive = isActive
            gear.startDate = startDate
            gear.workoutTypes = workoutTypes
            
            if gearViewModel.updateGear(gear) {
                dismiss()
            } else {
                validationError = "Failed to update gear"
            }
        } else {
            // Create new gear
            let newGear = Gear(
                name: name,
                type: type,
                currentDistance: currentDistance,
                maxDistance: maxDistance,
                notes: notes.isEmpty ? nil : notes,
                isPrimary: isPrimary,
                isActive: isActive,
                startDate: startDate,
                workoutTypes: workoutTypes
            )
            
            if gearViewModel.createGear(newGear) {
                dismiss()
            } else {
                validationError = "Failed to create gear"
            }
        }
    }
}

#Preview("New Gear") {
    // Create a single in-memory container for the preview
    let container = SharedModelContainer.create(inMemory: true)
    let context = container.mainContext
    
    // Create mock stores for preview using the same context
    let mockDataStore = DataStore(modelContext: context)
    let mockGearStore = GearStore(dataStore: mockDataStore)
    
    // Create ViewModels with mock stores
    let gearViewModel = GearViewModel(gearStore: mockGearStore)
    
    return EditGearView(gearViewModel: gearViewModel, existingGear: nil)
        .modelContainer(container)
}

#Preview("Edit Gear") {
    // Create a single in-memory container for the preview
    let container = SharedModelContainer.create(inMemory: true)
    let context = container.mainContext
    
    // Create mock stores for preview using the same context
    let mockDataStore = DataStore(modelContext: context)
    let mockGearStore = GearStore(dataStore: mockDataStore)
    
    // Create sample gear
    let sampleGear = Gear.SampleGear()
    
    // Create ViewModels with mock stores
    let gearViewModel = GearViewModel(gearStore: mockGearStore)
    
    return EditGearView(gearViewModel: gearViewModel, existingGear: sampleGear)
        .modelContainer(container)
}
