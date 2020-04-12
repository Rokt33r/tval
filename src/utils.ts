import is from '@sindresorhus/is'
import { Validator } from './tval'

export function createTypeValidator<T>(expectedType: string): Validator<T> {
  return value => {
    const valueType = is(value)
    if (valueType === expectedType) {
      return null
    }
    return {
      code: 'type',
      value,
      messagePredicate: `be of type \`${expectedType}\` but received type \`${valueType}\``,
      validatorArgs: [expectedType]
    }
  }
}
