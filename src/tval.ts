import { TypeName } from '@sindresorhus/is'

export interface InvalidResult<T extends {} = {}> {
  code: string
  value: any
  valueType: TypeName
  message: string
  data: T
}

export class ValidationError extends Error {
  result: InvalidResult

  constructor(invalidResult: InvalidResult, context: Function) {
    super(invalidResult.message)

    /* istanbul ignore next */
    if ('captureStackTrace' in Error) {
      Error.captureStackTrace(this, context)
    }

    this.name = 'ArgumentError'
    this.result = invalidResult
  }
}

export function isValidationError(error: Error): error is ValidationError {
  return error instanceof ValidationError
}

export interface Validator<T, C = {}> {
  (input: any, context?: C): InvalidResult | null
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

export function validate<R>(
  predicate: Predicate<R>,
  value: any
): InvalidResult | null {
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

export function assert<R>(
  predicate: Predicate<R>,
  value: any
): asserts value is R {
  const result = validate(predicate, value)
  if (result != null) {
    throw new ValidationError(result, assert)
  }
}

export function isValid<R>(predicate: Predicate<R>, value: any): value is R {
  const result = validate(predicate, value)
  return result == null
}
