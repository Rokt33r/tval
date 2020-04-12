export interface InvalidResult {
  valueType?: string
  valuePaths?: string[]
  code: string
  value: any
  messagePredicate: string
  subResults?: InvalidResult[]
  validatorArgs?: any[]
}

export class ValidationError extends Error {
  code: string
  value: any
  subResults?: InvalidResult[]
  validatorArgs?: any[]

  constructor(invalidResult: InvalidResult, context: Function) {
    const message = getInvalidErrorMessage(invalidResult)
    super(message)

    /* istanbul ignore next */
    if ('captureStackTrace' in Error) {
      Error.captureStackTrace(this, context)
    }

    this.name = 'ArgumentError'
    this.code = invalidResult.code
    this.value = invalidResult.value
    this.validatorArgs = invalidResult.validatorArgs
  }
}

export function isValidationError(error: Error): error is ValidationError {
  return error instanceof ValidationError
}

export function getInvalidErrorMessage({
  valueType,
  valuePaths,
  messagePredicate
}: InvalidResult): string {
  const prefix = valueType != null ? `${valueType} ` : ''
  const subject =
    valuePaths != null && valuePaths.length > 0
      ? `The ${prefix}property, ${valuePaths.join('.')}`
      : `The ${prefix}value`
  return `${subject} should ${messagePredicate}`
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
