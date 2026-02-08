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
    
    var workoutSyncService: WorkoutSyncService?
    
    /// The gear being edited (nil if creating new gear)
    var existingGear: Gear?
    
    /// if the page is to be loaded up in a read only view
    var readOnly: Bool = false
    
    // MARK: Private variables
    /// Absolute limits to prevent accidental huge values (stored in the user's chosen unit)
    private let absoluteMinDistance: Double = 0.0
    private let absoluteMaxDistance: Double = Constants.maximumGearDistance
    
    private let distanceUnit: Int = UserDefaultHelpers.distanceUnit
    private let distanceUnitSuffix: String = UserDefaultHelpers.distanceUnitSuffix
    
    // MARK: - Local State
    
    /// Local editable state for the gear being created/edited
    @State private var name: String = ""
    @State private var type: GearType = .shoes
    
    /// Distance values (may be in km or miles depending on user preference, always save in km)
    @State private var currentDistance: Double = 0.0
    @State private var maxDistance: Double = 0.0
    
    /// String representations for TextField display
    @State private var currentDistanceText: String = ""
    @State private var maxDistanceText: String = ""
        
    @State private var notes: String = ""
    @State private var isPrimary: Bool = true
    @State private var isActive: Bool = true
    @State private var startDate: Date = Date()
    
    /// What workout types the gear is for
    @State private var workoutTypes: [WorkoutType] = []
    
    /// Validation error message
    @State private var validationError: String?
    
    /// Shared focus state for text inputs (used to manage and dismiss the keyboard)
    @FocusState private var fieldFocused: Bool
    
    @State private var isEditing: Bool = true
    
    /// State for primary gear confirmation
    @State private var showPrimaryGearConfirmation: Bool = false
    @State private var existingPrimaryGear: Gear? = nil
    
    /// State for retiring gear
    @State private var showRetireGearConfirmation: Bool = false
    @State private var isRetiring: Bool = false
    
    // MARK: - Computed Properties
    
    /// True if creating new gear, false if editing existing
    private var isNewGear: Bool {
        existingGear == nil
    }
    
    private var workoutTypesList: [WorkoutType] {
        type == .shoes ? WorkoutType.shoeTypes : WorkoutType.bikeTypes
    }
    
    var body: some View {
        NavigationStack {
            Form {
                Section(header: Text(.details)) {
                    GearNameField
                    GearTypeField
                    GearStartDateField
                }
                
                Section(header: Text(.notes)) {
                    GearNotesField
                }
                
                Section(header: Text(.workoutTypes)) {
                    workoutTypePicker
                }
                
                Section(header: Text(.distance)) {
                    InitialDistanceField
                    MaxDistanceField
                }
                
                Section {
                    PrimaryGearToggle
                    IsActiveGearToggle
                }
                
                if readOnly && existingGear != nil {
                    RetireGearButton
                }
                
                if let error = validationError {
                    Section {
                        Text(error)
                            .foregroundStyle(.red)
                            .font(.caption)
                    }
                }
            }
            .disabled(!isEditing)
            .navigationTitle(isNewGear ? String(localized: .newGear) : String(localized: .editGear))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    CancelButton
                }
                ToolbarItem(placement: .confirmationAction) {
                    if isEditing {
                        ConfirmButton
                    } else if existingGear?.endDate == nil {
                        EditGearButton
                    }
                }
            }
            .onAppear {
                loadGear()
                isEditing = !readOnly
            }
            .toolbar {
                ToolbarItem(placement: .keyboard) {
                    DismissKeyboardView(fieldFocused: $fieldFocused)
                }
                .sharedBackgroundVisibility(.hidden)
                
            }
        }
    }
    
    // MARK: UI edit components
    var GearNameField: some View {
        TextField(.name, text: $name)
            .focused($fieldFocused)
    }
    
    var GearTypeField: some View {
        Picker(.typeGearType, selection: $type) {
            ForEach(GearType.allCases, id: \.self) { gType in
                HStack(spacing: 10) {
                    Image(systemName: gType.displayIcon)
                        .foregroundStyle(.appTint)
                        .tint(.appTint)
                    
                    Text(gType.displayName)
                    
                    
                }
                .tag(gType)
                
                
            }
        }
        .tint(.appTint)
        .pickerStyle(.menu)
    }
    
    var GearStartDateField: some View {
        DatePicker(.startDate, selection: $startDate, displayedComponents: [.date])
            .tint(.appTint)
        
    }
    
    var GearNotesField: some View {
        TextEditor(text: $notes)
            .frame(minHeight: 100)
            .focused($fieldFocused)
    }
    
    
    var InitialDistanceField: some View {
        HStack {
            // if we came here from viewing then user clicking edit, keep this field read only at all times
            Text((readOnly || existingGear != nil) ? .currentDistance : .initialDistance)
            Spacer()
            HStack(spacing: 6) {
                TextField(
                    text: $currentDistanceText,
                    prompt: Text("0").foregroundStyle(.tertiary)
                ) {}
                .disabled(readOnly) // this should always be disabled
                .keyboardType(.numberPad)
                .multilineTextAlignment(.trailing)
                .frame(minWidth: 60, maxWidth: 120)
                .onChange(of: currentDistanceText) { _, newValue in
                    if let parsed = Double(newValue) {
                        currentDistance = parsed
                        onInitialDistanceChange(value: parsed)
                    } else if newValue.isEmpty {
                        currentDistance = 0.0
                        onInitialDistanceChange(value: 0.0)
                    }
                }
                .focused($fieldFocused)
                Text(distanceUnitSuffix)
                    .foregroundStyle(.secondary)
            }
        }
    }
    
    var MaxDistanceField: some View {
        HStack {
            Text(.maximumDistance)
            Spacer()
            HStack(spacing: 6) {
                TextField(
                    text: $maxDistanceText,
                    prompt: Text("0").foregroundStyle(.tertiary)
                ) {}
                .keyboardType(.numberPad)
                .multilineTextAlignment(.trailing)
                .frame(minWidth: 60, maxWidth: 120)
                .onChange(of: maxDistanceText) { _, newValue in
                    if let parsed = Double(newValue) {
                        maxDistance = parsed
                        onMaxDistanceChange(value: parsed)
                    } else if newValue.isEmpty {
                        maxDistance = 0.0
                        onMaxDistanceChange(value: 0.0)
                    }
                }
                .focused($fieldFocused)
                Text(distanceUnitSuffix)
                    .foregroundStyle(.secondary)
            }
        }
        
    }
    
    
    var PrimaryGearToggle: some View {
        Toggle(.primaryGear, isOn: $isPrimary)
            .tint(.appTint)
            .onChange(of: isPrimary) { oldValue, newValue in
                // Only show confirmation if:
                // 1. User is setting this to primary (newValue == true)
                // 2. There is an existing primary gear
                // 3. The existing primary gear is not the current gear being edited
                if newValue && existingPrimaryGear != nil && existingPrimaryGear?.id != existingGear?.id {
                    showPrimaryGearConfirmation = true
                    isPrimary = true
                }
            }
            .alert(.primaryGearChangeConfirmationTitle, isPresented: $showPrimaryGearConfirmation) {
                Button(.cancel, role: .cancel) {
                    isPrimary = false
                }
                Button(.setAsPrimary, role: .destructive) {
                    isPrimary = true
                }
            } message: {
                if let primaryGearName = existingPrimaryGear?.name {
                    Text("'\(primaryGearName)' is currently set as your primary gear. Setting this gear as primary will replace it.")
                }
            }
    }
    
    var IsActiveGearToggle: some View {
        Toggle(.active, isOn: $isActive)
            .tint(.appTint)
    }
    
    // disclosure group is a collapsible/expandable section

    var workoutTypePicker: some View {
        VStack(alignment: .leading, spacing: 0) {
            DisclosureGroup {
                VStack(spacing: 4) {
                    ForEach(workoutTypesList, id: \.self) { woType in
                        if workoutTypes.contains(woType) {
                            selectedWorkoutTypeRow(woType)
                        } else {
                            unselectedWorkoutTypeRow(woType)
                        }
                    }
                }
                .padding(.top, 8)
            } label: {
                VStack(alignment: .leading, spacing: 4) {
                    Label(.workoutTypes, systemImage: "figure.run")
                        .foregroundStyle(.primary)
                    
                    if !workoutTypes.isEmpty {
                        Text(selectedWorkoutTypesText)
                            .font(.caption)
                            .foregroundStyle(.secondary)
                            .lineLimit(2)
                    } else {
                        Text(.noWorkoutTypesSelected)
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                }
            }
            .tint(.appTint)
        }
    }
    
    var RetireGearButton: some View {
        VStack {
            Spacer()
            Button(action: {
                // sets retirement date to now, makes inactive, saves gear and closes sheet
                showRetireGearConfirmation = true
            }) {
                HStack {
                    Text(.retireGear)
                        .font(.default).bold()
                        .foregroundStyle(.red)
                        .padding(.leading, 16)
                    Image(systemName: "arrow.down.to.line.alt")
                        .font(.title)
                        .foregroundStyle(.red)
                        .frame(width: 56, height: 56)
                }
            }
            .buttonBorderShape(.circle)
            .glassEffect(.regular.tint(.red.opacity(0.2)).interactive())
            .padding(20)
            .background(.clear)
            Spacer()
            
        }
        .alert(.retireGear, isPresented: $showRetireGearConfirmation) {
            Button(.cancel, role: .cancel) {
                showRetireGearConfirmation = false
            }
            Button(.retire, role: .destructive) {
                isRetiring = true
                showRetireGearConfirmation = false
                saveGear()
                
            }
        }
    }
    
    private var unselectedWorkoutTypes: [WorkoutType] {
        workoutTypesList.filter { !workoutTypes.contains($0) }
    }
    
    private var selectedWorkoutTypesText: String {
        workoutTypes.map { $0.displayName }.joined(separator: ", ")
    }
    
    @ViewBuilder
    private func selectedWorkoutTypeRow(_ woType: WorkoutType) -> some View {
        Button {
            removeWorkoutType(woType)
        } label: {
            HStack {
                Image(systemName: woType.displayIcon)
                    .foregroundStyle(.appTint)
                
                Text(woType.displayName)
                    .foregroundStyle(.primary)
                
                Spacer()
                
                Image(systemName: "checkmark.circle")
                    .foregroundStyle(.appTint)
                    .imageScale(.medium)
            }
            .padding(.vertical, 8)
            .padding(.horizontal, 12)
            .background(Color.appTint.opacity(0.1))
            .clipShape(RoundedRectangle(cornerRadius: 8))
        }
        .buttonStyle(.plain)
    }
    
    @ViewBuilder
    private func unselectedWorkoutTypeRow(_ woType: WorkoutType) -> some View {
        Button {
            addWorkoutType(woType)
        } label: {
            HStack {
                Image(systemName: woType.displayIcon)
                    .foregroundStyle(.secondary)
                
                Text(woType.displayName)
                    .foregroundStyle(.secondary)
                
                Spacer()
                
                Image(systemName: "plus.circle")
                    .foregroundStyle(.appTint)
                    .imageScale(.medium)
            }
            .padding(.vertical, 8)
            .padding(.horizontal, 12)
            .background(.clear)
            .clipShape(RoundedRectangle(cornerRadius: 8))

        }
        .buttonStyle(.plain)
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
    
    var EditGearButton: some View {
        Button(action: {
            isEditing = true
        }) {
            Image(systemName: "pencil")
                .foregroundStyle(.appTint)
        }
    }
    
    // MARK: - Private Methods
    
    /// Load gear data into local state for editing
    /// If existingGear is nil, uses default values for new gear
    private func loadGear() {
        // Check for existing primary gear when loading
        existingPrimaryGear = gearViewModel.primaryGear
        
        // if existingGear has been populated
        if let gear = existingGear {
            // Edit mode - populate from existing gear
            name = gear.name
            type = gear.type
            currentDistance = distanceUnit == 1 ? Double.ConvertToMi(gear.currentDistance) : gear.currentDistance
            maxDistance = distanceUnit == 1 ? Double.ConvertToMi(gear.maxDistance) : gear.maxDistance
            currentDistanceText = FormatHelpers.numberFormatterNoGrouping.string(from: NSNumber(value: currentDistance)) ?? ""
            maxDistanceText = FormatHelpers.numberFormatterNoGrouping.string(from: NSNumber(value: maxDistance)) ?? ""
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
            currentDistanceText = ""
            maxDistanceText = FormatHelpers.numberFormatterNoGrouping.string(from: NSNumber(value: maxDistance)) ?? ""
            notes = ""
            // Set isPrimary to true only if there's no existing primary gear
            isPrimary = existingPrimaryGear == nil
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
        
        // If setting this gear as primary, unset the existing primary gear
        if isPrimary, let existingPrimary = existingPrimaryGear, existingPrimary.id != existingGear?.id {
            existingPrimary.isPrimary = false
            _ = gearViewModel.updateGear(existingPrimary)
        }
        
        // if there is existing gear, update that
        if let gear = existingGear {
            // Update existing gear
            gear.name = name
            gear.type = type
            gear.currentDistance = distanceUnit == 1 ? Double.ConvertToKm(currentDistance) : currentDistance
            gear.maxDistance = distanceUnit == 1 ? Double.ConvertToKm(maxDistance) : maxDistance
            gear.notes = notes.isEmpty ? nil : notes
            gear.isPrimary = isPrimary
            gear.isActive = isActive
            gear.startDate = startDate
            gear.workoutTypes = workoutTypes
            
            if (isRetiring) {
                print("Retiring gear: \(gear.id) \(gear.name)")
                gear.endDate = Date()
                gear.isActive = false
                gear.isPrimary = false
            }
            
            if gearViewModel.updateGear(gear) {
                dismiss()
            } else {
                validationError = "Failed to update gear"
                isRetiring = false
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
                // run sync here
                Task {
                    try? await workoutSyncService?.syncWorkouts()
                }
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
    
    private func addWorkoutType(_ type: WorkoutType) {
        withAnimation(.easeInOut(duration: 0.2)) {
            workoutTypes.append(type)
        }
    }
    
    private func removeWorkoutType(_ type: WorkoutType) {
        withAnimation(.easeInOut(duration: 0.2)) {
            workoutTypes.removeAll { $0 == type }
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
    
    EditGearView(gearViewModel: gearViewModel, existingGear: nil)
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

#Preview("Read Only") {
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
    
    return EditGearView(gearViewModel: gearViewModel, existingGear: sampleGear, readOnly: true)
        .modelContainer(container)
}
