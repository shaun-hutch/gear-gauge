/**
 * GearType — categorises a piece of fitness gear.
 * Mirrors the Swift `GearType` enum in gearGauge/gearGauge/Models/GearType.swift
 */
export enum GearType {
  Shoes = 'shoes',
  Bicycle = 'bicycle',
}

/** Display metadata associated with each GearType variant. */
export interface GearTypeMeta {
  /** Human-readable label (localisable in the future). */
  displayName: string;
  /** SF Symbol / icon name used to represent this gear type in the UI. */
  displayIcon: string;
}

/**
 * Lookup map providing `displayName` and `displayIcon` for every GearType.
 * TS enums cannot hold methods, so metadata lives in this separate const.
 */
export const GEAR_TYPE_META: Record<GearType, GearTypeMeta> = {
  [GearType.Shoes]: {
    displayName: 'Shoes',
    displayIcon: 'shoe',
  },
  [GearType.Bicycle]: {
    displayName: 'Bicycle',
    displayIcon: 'bicycle',
  },
};

/** Convenience accessor — returns display metadata for the given GearType. */
export function getGearTypeMeta(type: GearType): GearTypeMeta {
  return GEAR_TYPE_META[type];
}
