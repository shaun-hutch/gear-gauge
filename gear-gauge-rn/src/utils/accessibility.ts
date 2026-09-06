/**
 * Composes a screen-reader accessibility label from its individual parts.
 *
 * These labels are read aloud by VoiceOver and TalkBack. This helper:
 * - Coerces non-string parts (numbers) to strings.
 * - Skips null, undefined, empty and whitespace-only parts.
 * - Joins the remaining parts with ", " — screen readers treat the comma as a
 *   natural pause when announcing the label.
 *
 * @example
 * buildAccessibilityLabel('Outdoor Run', '2 days ago', '5.2 km')
 * // 'Outdoor Run, 2 days ago, 5.2 km'
 */
export type AccessibilityLabelPart = string | number | null | undefined;

export function buildAccessibilityLabel(
  ...parts: AccessibilityLabelPart[]
): string {
  return parts
    .map((part) =>
      part === null || part === undefined ? '' : String(part).trim(),
    )
    .filter((part) => part.length > 0)
    .join(', ');
}
