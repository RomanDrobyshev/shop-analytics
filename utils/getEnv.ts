export function getEnv<T>(env: T, requiredVariables: string[]): T | never {
  requiredVariables.forEach((item: string) => {
    if (!env[item]) { throw new Error(`${item} doesn't exist!`); }
  });

  return env;
}
