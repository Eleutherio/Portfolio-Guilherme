export class EnvironmentValidationError extends Error {
  constructor(scope: "client" | "server", variables: string[]) {
    super(`Invalid ${scope} environment variable(s): ${[...new Set(variables)].sort().join(", ")}`);
    this.name = "EnvironmentValidationError";
  }
}
