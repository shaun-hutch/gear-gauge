/** Outcome of a create/update/delete mutation. */
export interface MutationResult {
  ok: boolean;
  /** Human-readable error message when `ok` is false. */
  error?: string;
}
