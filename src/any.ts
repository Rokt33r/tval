import { Predicate, validate, Validator, getInvalidErrorMessage } from './tval'
import is from '@sindresorhus/is/dist'

export function tAnyx<T>(...predicates: Predicate<any>[]): Predicate<T> {
  const validator: Validator<any> = (value, context) => {
    const results = []
    for (const predicate of predicates) {
      const result = validate(predicate, value)
      if (result == null) return null
      results.push(result)
    }
    const valueType = is(value)
    return {
      code: 'any',
      value,
      valueType,
      subResults: results,
      validatorArgs: predicates,
      messagePredicate: [
        `match any of following conditions`,
        ...results.map(
          result => `- ${getInvalidErrorMessage(result).replace(/\n/g, '\n  ')}`
        )
      ].join('\n')
    }
  }

  return {
    validators: [validator]
  }
}

export function tAny<T1>(predicator1: Predicate<T1>): Predicate<T1>
export function tAny<T1, T2>(
  predicator1: Predicate<T1>,
  predicator2: Predicate<T2>
): Predicate<T1 | T2>
export function tAny<T1, T2, T3>(
  predicator1: Predicate<T1>,
  predicator2: Predicate<T2>,
  predicator3: Predicate<T3>
): Predicate<T1 | T2 | T3>
export function tAny<T1, T2, T3, T4>(
  predicator1: Predicate<T1>,
  predicator2: Predicate<T2>,
  predicator3: Predicate<T3>,
  predicator4: Predicate<T4>
): Predicate<T1 | T2 | T3 | T4>
export function tAny<T1, T2, T3, T4, T5>(
  predicator1: Predicate<T1>,
  predicator2: Predicate<T2>,
  predicator3: Predicate<T3>,
  predicator4: Predicate<T4>,
  predicator5: Predicate<T5>
): Predicate<T1 | T2 | T3 | T4 | T5>
export function tAny<T1, T2, T3, T4, T5, T6>(
  predicator1: Predicate<T1>,
  predicator2: Predicate<T2>,
  predicator3: Predicate<T3>,
  predicator4: Predicate<T4>,
  predicator5: Predicate<T5>,
  predicator6: Predicate<T6>
): Predicate<T1 | T2 | T3 | T4 | T5 | T6>
export function tAny<T1, T2, T3, T4, T5, T6, T7>(
  predicator1: Predicate<T1>,
  predicator2: Predicate<T2>,
  predicator3: Predicate<T3>,
  predicator4: Predicate<T4>,
  predicator5: Predicate<T5>,
  predicator6: Predicate<T6>,
  predicator7: Predicate<T7>
): Predicate<T1 | T2 | T3 | T4 | T5 | T6 | T7>
export function tAny<T1, T2, T3, T4, T5, T6, T7, T8>(
  predicator1: Predicate<T1>,
  predicator2: Predicate<T2>,
  predicator3: Predicate<T3>,
  predicator4: Predicate<T4>,
  predicator5: Predicate<T5>,
  predicator6: Predicate<T6>,
  predicator7: Predicate<T7>,
  predicator8: Predicate<T8>
): Predicate<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8>
export function tAny<T1, T2, T3, T4, T5, T6, T7, T8, T9>(
  predicator1: Predicate<T1>,
  predicator2: Predicate<T2>,
  predicator3: Predicate<T3>,
  predicator4: Predicate<T4>,
  predicator5: Predicate<T5>,
  predicator6: Predicate<T6>,
  predicator7: Predicate<T7>,
  predicator8: Predicate<T8>,
  predicator9: Predicate<T9>
): Predicate<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9>
export function tAny<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
  predicator1: Predicate<T1>,
  predicator2: Predicate<T2>,
  predicator3: Predicate<T3>,
  predicator4: Predicate<T4>,
  predicator5: Predicate<T5>,
  predicator6: Predicate<T6>,
  predicator7: Predicate<T7>,
  predicator8: Predicate<T8>,
  predicator9: Predicate<T9>,
  predicator10: Predicate<T10>
): Predicate<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10>
export function tAny(...predicators: Predicate<any>[]): Predicate<any> {
  return tAnyx(...predicators)
}
