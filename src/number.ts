import { Validator, Predicate, ValidatorList } from './tval'
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

  equals<N2 extends number>(target: N2): NumberPredicate<N2> {
    return this.addValidator((value: number) => {
      if (value === target) {
        return null
      }
      return `Expected value to be equal to \`${target}\`, got \`${value}\``
    })
  }

  oneOf<S2 extends number>(...targets: S2[]): NumberPredicate<N & S2> {
    return this.addValidator((value: number) => {
      for (const target of targets) {
        if (target === value) return null
      }
      return `Expected value to be one of \`${renderTargetList(
        targets
      )}\`, got \`${value}\``
    })
  }
}

function renderTargetList(targets: number[]) {
  const limit = 10
  const overflow = targets.length - limit
  return targets.length > limit
    ? JSON.stringify(targets.slice(0, limit)).replace(
        /]$/,
        `,…+${overflow} more]`
      )
    : JSON.stringify(targets)
}

export function tStr() {
  return new NumberPredicate()
}
