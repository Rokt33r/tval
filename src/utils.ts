import is from '@sindresorhus/is'
import { Validator } from './tval'

export function appendKeyToValidationResult(result: string, key: string) {
  return result
    .replace(/^Expected value/, `Expected property, \`${key}\`,`)
    .replace(/^Expected property, `(.+)`/, `Expected property, \`$1.${key}\``)
}

export function createTypeValidator<T>(expectedType: string): Validator<T> {
  return value => {
    const valueType = is(value)
    if (valueType === expectedType) {
      return null
    }
    return `Expected value to be of type \`${expectedType}\` but received type \`${valueType}\``
  }
}
