import is from '@sindresorhus/is'
import { Validator, InvalidResult } from './tval'

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
      validatorArgs: [expectedType],
      messagePredicate: `be \`${expectedType}\` type, not \`${valueType}\` type`
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

export function appendValuePath(
  result: InvalidResult,
  path: string,
  ...morePaths: string[]
): InvalidResult {
  return {
    ...result,
    valuePaths:
      result.valuePaths != null
        ? [...result.valuePaths, path, ...morePaths]
        : [path, ...morePaths]
  }
}

export function getSubject(result: InvalidResult): string {
  const prefix = getSubjectPrefix(result)
  const { valuePaths } = result

  return valuePaths != null && valuePaths.length > 0
    ? `The ${prefix}property, ${valuePaths.join('.')}`
    : `The ${prefix}value`
}

function getSubjectPrefix({ code, valueType }: InvalidResult) {
  switch (code) {
    case 'type':
    case 'any':
      return ''
    default:
      return `${valueType}`
  }
}
