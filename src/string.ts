import { Validator, Predicate, ValidatorList } from './tval'
import { createTypeValidator } from './utils'

const stringValidator = createTypeValidator<string>('string')

export class StringPredicate<S extends string = string>
  implements Predicate<S> {
  validators: ValidatorList<S>

  constructor(validators?: Validator<any>[]) {
    if (validators == null) {
      this.validators = [stringValidator]
    } else {
      this.validators = validators
    }
  }

  addValidator<S2 extends string>(
    validator: Validator<S2>
  ): StringPredicate<S2> {
    return new StringPredicate([...this.validators, validator])
  }

  length(length: number) {
    return this.addValidator((value: string) => {
      if (value.length === length) {
        return null
      }
      return `Expected value to have length \`${length}\`, got \`${value.length}\` `
    })
  }

  equal<S2 extends string>(target: S2): StringPredicate<S2> {
    return this.addValidator((value: string) => {
      if (value === target) {
        return null
      }
      return `Expected value to be equal to \`${target}\`, got \`${value}\``
    })
  }

  oneOf<S2 extends string>(...targets: S2[]): StringPredicate<S & S2> {
    return this.addValidator((value: string) => {
      for (const target of targets) {
        if (target === value) return null
      }
      return `Expected value to be one of \`${renderExpectedList(
        targets
      )}\`, got \`${value}\``
    })
  }

  nonEqual<S2 extends string>(target: S2): StringPredicate<Exclude<S, S2>> {
    return this.addValidator((value: string) => {
      if (value !== target) {
        return null
      }
      return `Expected value to not be equal to \`${target}\`, got \`${value}\``
    })
  }

  noneOf<S2 extends string>(...targets: S2[]): StringPredicate<Exclude<S, S2>> {
    return this.addValidator((value: string) => {
      for (const target of targets) {
        if (target === value) {
          return `Expected value to be none of \`${renderExpectedList(
            targets
          )}\`, got \`${value}\``
        }
      }
      return null
    })
  }

  // TODO:
  // length
  // min
  // max
  // empty
  // nonEmpty
  // match
  // startsWith
  // endsWith
  // alphanumeric
  // alphabetical
  // numeric
  // date
  // lowercase
  // uppercase
  // url
}

function renderExpectedList(targets: string[]) {
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
  return new StringPredicate()
}
