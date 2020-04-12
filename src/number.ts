import { Validator, Predicate, ValidatorList, InvalidResult } from './tval'
import { createTypeValidator } from './utils'

const numberValidator = createTypeValidator<number>('number')

export class NumberPredicate<N extends number = number>
  implements Predicate<N> {
  validators: ValidatorList<N>

  constructor(validators?: Validator<any>[]) {
    if (validators == null) {
      this.validators = [numberValidator]
    } else {
      this.validators = validators
    }
  }

  addValidator<S2 extends number>(
    validator: Validator<S2>
  ): NumberPredicate<S2> {
    return new NumberPredicate([...this.validators, validator])
  }

  equal<N2 extends number>(target: N2): NumberPredicate<N2> {
    return this.addValidator((value: number): InvalidResult | null => {
      if (value === target) {
        return null
      }
      return {
        code: 'number.equal',
        messagePredicate: `be equal to \`${target}\`, got \`${value}\``,
        value,
        validatorArgs: [target]
      }
    })
  }

  oneOf<N2 extends number>(...targets: N2[]): NumberPredicate<N & N2> {
    return this.addValidator((value: number): InvalidResult | null => {
      for (const target of targets) {
        if (target === value) return null
      }
      return {
        code: 'number.oneOf',
        messagePredicate: `be one of \`${renderExpectedList(
          targets
        )}\`, got \`${value}\``,
        value,
        validatorArgs: targets
      }
    })
  }
  notEqual<N2 extends number>(target: N2): NumberPredicate<Exclude<N, N2>> {
    return this.addValidator((value: number): InvalidResult | null => {
      if (value !== target) {
        return null
      }
      return {
        code: 'number.notEqual',
        messagePredicate: `not be equal to \`${target}\`, got \`${value}\``,
        value,
        validatorArgs: [target]
      }
    })
  }

  noneOf<N2 extends number>(...targets: N2[]): NumberPredicate<Exclude<N, N2>> {
    return this.addValidator((value: number): InvalidResult | null => {
      for (const target of targets) {
        if (target === value) {
          return {
            code: 'number.noneOf',
            messagePredicate: `not be one of \`${renderExpectedList(
              targets
            )}\`, got \`${value}\``,
            value,
            validatorArgs: targets
          }
        }
      }
      return null
    })
  }

  // TODO:
  // inRange
  // greaterThan
  // greaterThanOrEqual
  // lessThan
  // lessThanOrEqual
  // integer
  // finite
  // infinite
  // positive
  // negative
  // integerOrInfinite
  // uint
  // uint16
  // uint32
  // int8
  // int16
  // int32
}

function renderExpectedList(targets: number[]) {
  const limit = 10
  const overflow = targets.length - limit
  return targets.length > limit
    ? JSON.stringify(targets.slice(0, limit)).replace(
        /]$/,
        `,…+${overflow} more]`
      )
    : JSON.stringify(targets)
}

export function tNum() {
  return new NumberPredicate()
}
