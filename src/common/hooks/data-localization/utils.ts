export class LocalDataError extends Error {
  private localDataError: boolean;

  constructor(msg: string) {
    super(msg);
    this.localDataError = true;
  }

  static isLocalDataError(err: unknown): err is LocalDataError {
    if (err instanceof LocalDataError) {
      return !!err.localDataError;
    }
    return false;
  }
}
