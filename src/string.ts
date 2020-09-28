import { Validator, Predicate, ValidatorList, InvalidResult } from './tval'
import { createTypeValidator, stringifyList } from './utils'
import is, { TypeName } from '@sindresorhus/is/dist'

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

  buildResult(result: Omit<InvalidResult, 'valueType'>): InvalidResult {
    return {
      ...result,
      valueType: TypeName.string
    }
  }

  length(length: number) {
    return this.addValidator((value: string): InvalidResult | null => {
      if (value.length === length) {
        return null
      }
      return this.buildResult({
        code: 'string.length',
        value,
        message: `The string value should have length \`${length}\`(value: \`${value}\`, length: \`${value.length}\`)`
      })
    })
  }

  minLength(minLength: number) {
    return this.addValidator((value: string): InvalidResult | null => {
      if (value.length === minLength) {
        return null
      }
      return this.buildResult({
        code: 'string.minLength',
        value,
        validatorArgs: [minLength],
        messagePredicate: `have a minimum length of \`${minLength}\`(value: \`${value}\`, length: \`${value.length}\`)`
      })
    })
  }

  maxLength(maxLength: number) {
    return this.addValidator((value: string): InvalidResult | null => {
      if (value.length === maxLength) {
        return null
      }
      return this.buildResult({
        code: 'string.maxLength',
        value,
        validatorArgs: [maxLength],
        messagePredicate: `have a minimum length of \`${maxLength}\`(value: \`${value}\`, length: \`${value.length}\`)`
      })
    })
  }

  empty(): StringPredicate<''> {
    return this.addValidator((value: string): InvalidResult | null => {
      if (value === '') {
        return null
      }

      return this.buildResult({
        code: 'string.empty',
        value,
        messagePredicate: `be empty(value: \`${value}\`, length: \`${value.length}\`)`
      })
    })
  }

  nonEmpty() {
    return this.addValidator((value: string): InvalidResult | null => {
      if (value !== '') {
        return null
      }

      return this.buildResult({
        code: 'string.nonEmpty',
        value,
        messagePredicate: `be not be empty(value: \`${value}\`, length: \`${value.length}\`)`
      })
    })
  }

  equal<S2 extends string>(target: S2): StringPredicate<S2> {
    return this.addValidator((value: string): InvalidResult | null => {
      if (value === target) {
        return null
      }
      return this.buildResult({
        code: 'string.equal',
        value,
        validatorArgs: [target],
        messagePredicate: `be equal to \`${target}\`, not equal to \`${value}\``
      })
    })
  }

  oneOf<S2 extends string>(...targets: S2[]): StringPredicate<S & S2> {
    return this.addValidator((value: string): InvalidResult | null => {
      for (const target of targets) {
        if (target === value) return null
      }

      return this.buildResult({
        code: 'string.oneOf',
        value,
        validatorArgs: targets,
        messagePredicate: `be one of \`${stringifyList(
          targets
        )}\`(value: \`${value}\`)`
      })
    })
  }

  notEqual<S2 extends string>(target: S2): StringPredicate<Exclude<S, S2>> {
    return this.addValidator((value: string): InvalidResult | null => {
      if (value !== target) {
        return null
      }

      return this.buildResult({
        code: 'string.notEqual',
        value,
        validatorArgs: [target],
        messagePredicate: `be equal to \`${target}\`(value: \`${value}\`)`
      })
    })
  }

  noneOf<S2 extends string>(targets: S2[]): StringPredicate<Exclude<S, S2>> {
    return this.addValidator((value: string): InvalidResult | null => {
      for (const target of targets) {
        if (target === value) {
          return this.buildResult({
            code: 'string.noneOf',
            value,
            validatorArgs: targets,
            messagePredicate: `be none of \`${stringifyList(
              targets
            )}\`(value: \`${value}\`)`
          })
        }
      }
      return null
    })
  }

  match(regexp: RegExp) {
    return this.addValidator((value: string): InvalidResult | null => {
      if (regexp.test(value)) {
        return null
      }

      return this.buildResult({
        code: 'string.match',
        value,
        validatorArgs: [regexp],
        messagePredicate: `match \`${regexp}\`(value: \`${value}\`)`
      })
    })
  }

  startWith(target: string) {
    return this.addValidator((value: string): InvalidResult | null => {
      if (value.startsWith(target)) {
        return null
      }

      return this.buildResult({
        code: 'string.startWith',
        value,
        validatorArgs: [target],
        messagePredicate: `start with \`${target}\`(value: \`${value}\`)`
      })
    })
  }

  endWith(target: string) {
    return this.addValidator((value: string): InvalidResult | null => {
      if (value.endsWith(target)) {
        return null
      }

      return this.buildResult({
        code: 'string.endWith',
        value,
        validatorArgs: [target],
        messagePredicate: `end with \`${target}\`(value: \`${value}\`)`
      })
    })
  }

  include(target: string) {
    return this.addValidator((value: string): InvalidResult | null => {
      if (value.includes(target)) {
        return null
      }

      return this.buildResult({
        code: 'string.include',
        value,
        validatorArgs: [target],
        messagePredicate: `include \`${target}\`(value: \`${value}\`)`
      })
    })
  }

  notInclude(target: string) {
    return this.addValidator((value: string): InvalidResult | null => {
      if (!value.includes(target)) {
        return null
      }

      return this.buildResult({
        code: 'string.notInclude',
        value,
        validatorArgs: [target],
        messagePredicate: `not include \`${target}\`(value: \`${value}\`)`
      })
    })
  }

  alphanumeric() {
    return this.addValidator((value: string): InvalidResult | null => {
      if (/^[a-z\d]+$/i.test(value)) {
        return null
      }

      return this.buildResult({
        code: 'string.alphanumeric',
        value,
        messagePredicate: `be alphanumeric(value: \`${value}\`)`
      })
    })
  }

  alphabetical() {
    return this.addValidator((value: string): InvalidResult | null => {
      if (/^[a-z]+$/i.test(value)) {
        return null
      }

      return this.buildResult({
        code: 'string.alphabetical',
        value,
        messagePredicate: `be alphabetical(value: \`${value}\`)`
      })
    })
  }

  numeric() {
    return this.addValidator((value: string): InvalidResult | null => {
      if (/^(?:\+|-)?\d+$/i.test(value)) {
        return null
      }

      return this.buildResult({
        code: 'string.alphabetical',
        value,
        messagePredicate: `be numeric(value: \`${value}\`)`
      })
    })
  }

  date() {
    return this.addValidator((value: string): InvalidResult | null => {
      if (!isNaN(Date.parse(value))) {
        return null
      }

      return this.buildResult({
        code: 'string.date',
        value,
        messagePredicate: `be a date(value: \`${value}\`)`
      })
    })
  }

  lowercase() {
    return this.addValidator((value: string): InvalidResult | null => {
      if (value === value.toLowerCase()) {
        return null
      }

      return this.buildResult({
        code: 'string.lowercase',
        value,
        messagePredicate: `be lowercase(value: \`${value}\`)`
      })
    })
  }

  uppercase() {
    return this.addValidator((value: string): InvalidResult | null => {
      if (value === value.toUpperCase()) {
        return null
      }

      return this.buildResult({
        code: 'string.uppercase',
        value,
        messagePredicate: `be uppercase(value: \`${value}\`)`
      })
    })
  }

  url() {
    return this.addValidator((value: string): InvalidResult | null => {
      if (is.urlString(value)) {
        return null
      }

      return this.buildResult({
        code: 'string.url',
        value,
        messagePredicate: `be a URL(value: \`${value}\`)`
      })
    })
  }
}

export function tStr() {
  return new StringPredicate()
}
