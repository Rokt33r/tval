import { Validator, Predicate, ValidatorList, InvalidResult } from './tval'
import { createTypeValidator, stringifyList } from './utils'

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
    return this.addValidator((value: string): InvalidResult | null => {
      if (value.length === length) {
        return null
      }
      return {
        code: 'string.length',
        messagePredicate: `have length \`${length}\`, not \`${value.length}\``,
        value,
        validatorArgs: [length]
      }
    })
  }

  equal<S2 extends string>(target: S2): StringPredicate<S2> {
    return this.addValidator((value: string): InvalidResult | null => {
      if (value === target) {
        return null
      }
      return {
        code: 'string.equal',
        messagePredicate: `be equal to \`${target}\`, not equal to \`${value}\``,
        value,
        validatorArgs: [target]
      }
    })
  }

  oneOf<S2 extends string>(...targets: S2[]): StringPredicate<S & S2> {
    return this.addValidator((value: string): InvalidResult | null => {
      for (const target of targets) {
        if (target === value) return null
      }

      return {
        code: 'string.oneOf',
        messagePredicate: `be one of \`${stringifyList(
          targets
        )}\`, not \`${value}\``,
        value,
        validatorArgs: targets
      }
    })
  }

  notEqual<S2 extends string>(target: S2): StringPredicate<Exclude<S, S2>> {
    return this.addValidator((value: string): InvalidResult | null => {
      if (value !== target) {
        return null
      }

      return {
        code: 'string.notEqual',
        messagePredicate: `be equal to \`${target}\`, not \`${value}\``,
        value,
        validatorArgs: [target]
      }
    })
  }

  noneOf<S2 extends string>(...targets: S2[]): StringPredicate<Exclude<S, S2>> {
    return this.addValidator((value: string): InvalidResult | null => {
      for (const target of targets) {
        if (target === value) {
          return {
            code: 'string.noneOf',
            messagePredicate: `be none of \`${stringifyList(
              targets
            )}\`, not \`${value}\``,
            value,
            validatorArgs: targets
          }
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
  // startWith
  // endWith
  // include
  // exclude
  // alphanumeric
  // alphabetical
  // numeric
  // date
  // lowercase
  // uppercase
  // url
}

export function tStr() {
  return new StringPredicate()
}
