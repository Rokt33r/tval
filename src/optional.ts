import { Predicate, Validator, validate } from './tval'

export function tOptional<T>(
  predicate: Predicate<T>
): Predicate<T | undefined> {
  const validator: Validator<any> = (value, context) => {
    if (value == null) return null
    return validate(predicate, value)
  }
  return {
    validators: [validator]
  }
}
