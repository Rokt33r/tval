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
      valueType,
      data: {
        expectedType
      },
      message: `The value should be \`${expectedType}\` type, not \`${valueType}\` type`
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
