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
}


struct DismissKeyboardView_Previews: PreviewProvider {
    struct PreviewWrapper: View {
        @FocusState var focused: Bool
        
        var body: some View {
            DismissKeyboardView(fieldFocused: $focused)
                .frame(width: 400, height: 100)
                .background(Color.gray.opacity(0.2))
        }
    }
    
    static var previews: some View {
        PreviewWrapper()
            .previewLayout(.sizeThatFits)
    }
}
