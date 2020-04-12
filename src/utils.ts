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

export function stringifyList(
  list: any[],
  stringifier: (value: any) => string = JSON.stringify,
  displayLimit: number = 10
) {
  const displayList = displayLimit < 0 ? list : list.slice(0, displayLimit)
  const overflow = displayLimit < 0 ? 0 : list.length - displayLimit

  const stringifiedContent = displayList
    .map(item => stringifier(item))
    .join(', ')

  return overflow > 0
    ? `[${stringifiedContent},…+${overflow} more]`
    : `[${stringifiedContent}]`
}
