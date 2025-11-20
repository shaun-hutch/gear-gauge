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
    
    // MARK: Private variables
    /// Absolute limits to prevent accidental huge values (stored in the user's chosen unit)
    private let absoluteMinDistance: Double = 0.0
    private let absoluteMaxDistance: Double = Constants.maximumGearDistance
    
    // MARK: - Local State
    
    /// Local editable state for the gear being created/edited
    @State private var name: String = ""
    @State private var type: GearType = .shoes
    
    /// Distance values (may be in km or miles depending on user preference, always save in km)
    @State private var currentDistance: Double = 0.0
    @State private var maxDistance: Double = 0.0
    
    @State private var notes: String = ""
    @State private var isPrimary: Bool = false
    @State private var isActive: Bool = true
    @State private var startDate: Date = Date()
    
    /// What workout types the gear is for
    @State private var workoutTypes: [WorkoutType] = []
    
    /// Validation error message
    @State private var validationError: String?
    
    /// Focus state used to dismiss the keyboard for the notes field
    @FocusState private var notesFocused: Bool
    
    // MARK: - Computed Properties
    
    /// True if creating new gear, false if editing existing
    private var isNewGear: Bool {
        existingGear == nil
    }
    
    /// distance unit option from UserDefaults (0 = km, 1 = mi)
    private var distanceUnit: Int {
        UserDefaultsService.get(forKey: Constants.distanceUnit) ?? 0
    }
    private var distanceUnitSuffix: String {
        distanceUnit == 0 ? "km" : "mi"
    }
    
    
    var body: some View {
        NavigationStack {
            Form {
                Section(header: Text("Details")) {
                    GearNameField
                    GearTypeField
                    GearStartDateField
                }
                
                Section(header: Text("Notes")) {
                    GearNotesField
                }
                
                Section(header: Text("Distance")) {
                    InitialDistanceField
                    MaxDistanceField
                }
                
                Section {
                    PrimaryGearToggle
                    IsActiveGearToggle
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
                    CancelButton
                }
                ToolbarItem(placement: .confirmationAction) {
                    ConfirmButton
                }
            }
            .onAppear {
                loadGear()
            }
            .toolbar {
                ToolbarItem(placement: .keyboard) {
                    HStack {
                        Spacer()
                        Button(action: {
                            notesFocused = false
                        }) {
                            HStack {
                                Image(systemName: "checkmark")
                                    .foregroundStyle(.appTint)
                                    .font(.body.weight(.semibold))
                            }
                        }
                        .buttonBorderShape(.circle)
                        .padding(6)
                        .tint(.appTint)
                        .glassEffect(.regular.tint(.clear).interactive())
                        .frame(width: 44, height: 44, alignment: .trailing)
                    }
                    .padding(.bottom, 20)
                }
                .sharedBackgroundVisibility(.hidden)
                
            }
        }
    }
    
    // MARK: UI edit components
    var GearNameField: some View {
        TextField("Name", text: $name)
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
    
    var GearStartDateField: some View {
        DatePicker("Start Date", selection: $startDate, displayedComponents: [.date])
            .tint(.appTint)
        
    }
    
    var GearNotesField: some View {
        TextEditor(text: $notes)
            .frame(minHeight: 100)
            .focused($notesFocused)
    }
    
    
    var InitialDistanceField: some View {
        HStack {
            Text("Initial distance")
            Spacer()
            HStack(spacing: 6) {
                TextField("", value: $currentDistance, formatter: FormatHelpers.numberFormatterNoGrouping)
                    .keyboardType(.decimalPad)
                    .multilineTextAlignment(.trailing)
                    .frame(minWidth: 60, maxWidth: 120)
                    .onChange(of: currentDistance, { _, newValue in
                        onInitialDistanceChange(value: newValue)
                    })
                Text(distanceUnitSuffix)
                    .foregroundStyle(.secondary)
            }
        }
    }
    
    var MaxDistanceField: some View {
        HStack {
            Text("Maximum distance")
            Spacer()
            HStack(spacing: 6) {
                TextField("", value: $maxDistance, formatter: FormatHelpers.numberFormatterNoGrouping)
                    .keyboardType(.decimalPad)
                    .multilineTextAlignment(.trailing)
                    .frame(minWidth: 60, maxWidth: 120)
                    .onChange(of: maxDistance, { _, newValue in
                        onMaxDistanceChange(value: newValue)
                    })
                Text(distanceUnitSuffix)
                    .foregroundStyle(.secondary)
            }
        }
        
    }
    
    
    var PrimaryGearToggle: some View {
        Toggle("Primary Gear", isOn: $isPrimary)
            .tint(.appTint)
    }
    
    var IsActiveGearToggle: some View {
        Toggle("Active", isOn: $isActive)
            .tint(.appTint)
    }
    
    // MARK: Nav button actions
    var ConfirmButton: some View {
        Button(action: {
            saveGear()
        }) {
            Image(systemName: "checkmark")
                .foregroundStyle(.appTint)
        }
        .disabled(name.isEmpty)
    }
    
    var CancelButton: some View {
        Button(action: {
            dismiss()
        }) {
            Image(systemName: "xmark")
                .foregroundStyle(.appTint)
        }
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
            currentDistance = distanceUnit == 1 ? Double.ConvertToMi(kmValue: gear.currentDistance) : gear.currentDistance
            maxDistance = distanceUnit == 1 ? Double.ConvertToMi(kmValue: gear.maxDistance) : gear.maxDistance
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
            maxDistance = distanceUnit == 1 ? 600 : 1000 // Default max distance (600 mi, 1000 km)
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
            gear.currentDistance = distanceUnit == 1 ? Double.ConvertToKm(mileValue: currentDistance) : currentDistance
            gear.maxDistance = distanceUnit == 1 ? Double.ConvertToKm(mileValue: maxDistance) :
            maxDistance
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
    
    /// Recommended max distance per gear type (for UI hints, not enforced)
    private func recommendedMaxForType(_ type: GearType) -> Double {
        switch type {
        case .shoes:
            return distanceUnit == 1 ? 600 : 1000 // miles vs km
        case .bicycle:
            return distanceUnit == 1 ? 5000 : 8000
        }
    }
    
    /// Helper to clamp to absolute bounds
    private func clampedDistance(_ value: Double) -> Double {
        min(max(value, absoluteMinDistance), absoluteMaxDistance)
    }
    
    private func onInitialDistanceChange(value: Double) {
        let clamped = clampedDistance(value)
        if clamped != value {
            currentDistance = clamped
        }
        // if current exceeds max, push max up to match current
        if currentDistance > maxDistance {
            maxDistance = currentDistance
        }
    }
    
    private func onMaxDistanceChange(value: Double) {
        let clamped = clampedDistance(value)
        if clamped != value {
            maxDistance = clamped
        }
        // if max is now below current, raise current to match max (or alternatively lower current)
        if maxDistance < currentDistance {
            currentDistance = maxDistance
        }
    }
    
    // MARK: Validation checks
    // name not empty
    // max distance > 0
    // workout types selected
    
}

// MARK: Previews

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
