import { Predicate, Validator, report } from './tval'

export function tOptional<T>(
  predicate: Predicate<T>
): Predicate<T | undefined> {
  const validator: Validator<any> = (value, context) => {
    if (value == null) return null
    return report(predicate, value)
  }
  return {
    validators: [validator]
  }
}
