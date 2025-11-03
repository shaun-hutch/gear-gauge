//
//  BaseEntity.swift
//  gearGauge
//
//  Created by Shaun Hutchinson on 03/11/2025.
//

import Foundation

protocol BaseEntity: Identifiable {
    /// unique ID of the entity
    var id: UUID { get set }
    /// when the entity was created
    var createdDate: Date? { get set }
    /// when the entity was last updated
    var lastUpdatedDate: Date? { get set }
    /// version number of the entity
    var version: Int { get set }

}
