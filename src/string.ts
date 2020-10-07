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

  length(targetLength: number) {
    return this.addValidator((value: string): InvalidResult | null => {
      if (value.length === targetLength) {
        return null
      }
      return this.buildResult({
        code: 'string.length',
        value,
        data: {
          targetLength
        },
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
        data: {
          minLength
        },
        message: `The string value should have a minimum length of \`${minLength}\`(value: \`${value}\`, length: \`${value.length}\`)`
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
        data: {
          maxLength
        },
        message: `The string value should have a maximum length of \`${maxLength}\`(value: \`${value}\`, length: \`${value.length}\`)`
      })
    })
  }

  range(minLength: number, maxLength: number) {
    return this.addValidator((value: string): InvalidResult | null => {
      if (value.length >= minLength && value.length <= maxLength) {
        return null
      }
      return this.buildResult({
        code: 'string.range',
        value,
        data: {
          minLength,
          maxLength
        },
        message: `The string value should have a length between \`${minLength}\` and \`${maxLength}\`(value: \`${value}\`, length: \`${value.length}\`)`
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
        data: {},
        message: `The string value should be empty(value: \`${value}\`, length: \`${value.length}\`)`
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
        data: {},
        message: `The string value should not be empty(value: \`${value}\`, length: \`${value.length}\`)`
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
        data: {
          expectedValue: target
        },
        message: `The string value should be equal to \`${target}\`, not equal to \`${value}\``
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
        data: {
          targets
        },
        message: `The string value should be one of \`${stringifyList(
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
        data: {
          target
        },
        message: `The string value should be equal to \`${target}\`(value: \`${value}\`)`
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
            data: {
              targets
            },
            message: `The string value should be none of \`${stringifyList(
              targets
            )}\`(value: \`${value}\`)`
          })
        }
      }
      return null
    })
  }

  match(regExp: RegExp) {
    return this.addValidator((value: string): InvalidResult | null => {
      if (regExp.test(value)) {
        return null
      }

      return this.buildResult({
        code: 'string.match',
        value,
        data: {
          regExp
        },
        message: `The string value should match \`${regExp}\`(value: \`${value}\`)`
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
        data: {
          target
        },
        message: `The string value should start with \`${target}\`(value: \`${value}\`)`
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
        data: {
          target
        },
        message: `The string value should end with \`${target}\`(value: \`${value}\`)`
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
        data: {
          target
        },
        message: `The string value should include \`${target}\`(value: \`${value}\`)`
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
        data: {
          target
        },
        message: `The string value should not include \`${target}\`(value: \`${value}\`)`
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
        data: {},
        message: `The string value should be alphanumeric(value: \`${value}\`)`
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
        data: {},
        message: `The string value shouldbe alphabetical(value: \`${value}\`)`
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
        data: {},
        message: `The string value should be numeric(value: \`${value}\`)`
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
        data: {},
        message: `The string value should be a date(value: \`${value}\`)`
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
        data: {},
        message: `The string value should be lowercase(value: \`${value}\`)`
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
        data: {},
        message: `The string value should be uppercase(value: \`${value}\`)`
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
        data: {},
        message: `The string value should be a URL(value: \`${value}\`)`
      })
    })
  }
}

export function tStr() {
  return new StringPredicate()
}
