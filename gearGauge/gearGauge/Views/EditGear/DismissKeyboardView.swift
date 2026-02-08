//
//  DismissKeyboardView.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 07/02/2026.
//

import SwiftUI

struct DismissKeyboardView: View {
    @FocusState.Binding var fieldFocused: Bool
    
    var body: some View {
        HStack {
            Spacer()
            Button(action: {
                fieldFocused = false
            }) {
                Image(systemName: "checkmark")
                    .foregroundStyle(.appTint)
                    .font(.body.weight(.medium))
                    .frame(width: 44, height: 44)
                    .clipShape(Circle())
                    .glassEffect(.regular.tint(.clear).interactive())
            }
        }
        .padding(.bottom, 20)
        .padding(.trailing, 8)
    }
}


struct DismissKeyboardView_Previews: PreviewProvider {
    struct PreviewWrapper: View {
        @FocusState var focused: Bool
        @State private var text: String = ""
        
        var body: some View {
            NavigationStack {
                Form {
                    TextField("Tap to show keyboard", text: $text)
                        .focused($focused)
                }
                .toolbar {
                    ToolbarItem(placement: .keyboard) {
                        DismissKeyboardView(fieldFocused: $focused)
                    }
                    .sharedBackgroundVisibility(.hidden)
                }
            }
        }
    }
    
    static var previews: some View {
        PreviewWrapper()
    }
}
