export interface Readable {
  getLastVersion(): string | undefined;
  getTotal(): number;
}
