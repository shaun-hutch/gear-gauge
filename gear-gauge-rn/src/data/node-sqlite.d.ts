/**
 * Minimal local type declarations for Node's built-in `node:sqlite` module,
 * used only by `sqliteTestHelper.ts` to back Jest integration tests with a real
 * in-memory SQLite engine. Declared here because `@types/node` is not included
 * in the project's tsconfig `types` list (see repo testing notes).
 */
declare module "node:sqlite" {
  export type SQLInputValue = null | number | bigint | string | Uint8Array;

  export interface StatementResult {
    changes: number | bigint;
    lastInsertRowid: number | bigint;
  }

  export class StatementSync {
    run(...anonymousParameters: SQLInputValue[]): StatementResult;
    all(...anonymousParameters: SQLInputValue[]): Record<string, unknown>[];
    get(
      ...anonymousParameters: SQLInputValue[]
    ): Record<string, unknown> | undefined;
  }

  export class DatabaseSync {
    constructor(path: string);
    exec(sql: string): void;
    prepare(sql: string): StatementSync;
    close(): void;
  }
}
