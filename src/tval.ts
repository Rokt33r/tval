export interface Validator<T, C = {}> {
  (input: any, context?: C): string | null
}

export interface Predicate<R> {
  validators: ValidatorList<R>
}

export type ValidatorList<R> = Validator<any>[]

export type ShapeSchema = {
  [key: string]: Predicate<any>
}

export type PredicateResult<P extends Predicate<any>> = P extends Predicate<
  infer R
>
  ? R
  : never

export type Unshape<S> = S extends ShapeSchema
  ? {
      [K in keyof S]: PredicateResult<S[K]>
    }
  : never

export function assert<R>(
  predicate: Predicate<R>,
  value: any
): asserts value is R {
  const context = {}
  const { validators } = predicate
  for (const validator of validators) {
    const result = validator(value, context)
    if (result == null) {
      continue
    }
    throw new Error(result)
  }
}

export function isValid<R>(predicate: Predicate<R>, value: any): value is R {
  const context = {}
  const { validators } = predicate
  for (const validator of validators) {
    const result = validator(value, context)
    if (result == null) {
      continue
    }
    return false
  }
  return true
}

export function report<R>(predicate: Predicate<R>, value: any): string | null {
  const context = {}
  const { validators } = predicate
  for (const validator of validators) {
    const result = validator(value, context)
    if (result == null) {
      continue
    }
    return result
  }
  return null
}
