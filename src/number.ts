import { Validator, Predicate, ValidatorList, InvalidResult } from './tval'
import { createTypeValidator, stringifyList } from './utils'
import is, { TypeName } from '@sindresorhus/is/dist'

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

  buildResult(result: Omit<InvalidResult, 'valueType'>): InvalidResult {
    return {
      ...result,
      valueType: TypeName.number
    }
  }

  equal<N2 extends number>(target: N2): NumberPredicate<N2> {
    return this.addValidator((value: number): InvalidResult | null => {
      if (value === target) {
        return null
      }
      return this.buildResult({
        code: 'number.equal',
        value,
        validatorArgs: [target],
        messagePredicate: `be equal to \`${target}\`(value: \`${value}\`)`
      })
    })
  }

  oneOf<N2 extends number>(...targets: N2[]): NumberPredicate<N & N2> {
    return this.addValidator((value: number): InvalidResult | null => {
      for (const target of targets) {
        if (target === value) return null
      }
      return this.buildResult({
        code: 'number.oneOf',
        value,
        validatorArgs: targets,
        messagePredicate: `be one of \`${stringifyList(
          targets
        )}\`(value: \`${value}\`)`
      })
    })
  }

  notEqual<N2 extends number>(target: N2): NumberPredicate<Exclude<N, N2>> {
    return this.addValidator((value: number): InvalidResult | null => {
      if (value !== target) {
        return null
      }
      return this.buildResult({
        code: 'number.notEqual',
        value,
        validatorArgs: [target],
        messagePredicate: `not be equal to \`${target}\`(value: \`${value}\`)`
      })
    })
  }

  noneOf<N2 extends number>(...targets: N2[]): NumberPredicate<Exclude<N, N2>> {
    return this.addValidator((value: number): InvalidResult | null => {
      for (const target of targets) {
        if (target === value) {
          return this.buildResult({
            code: 'number.noneOf',
            value,
            validatorArgs: targets,
            messagePredicate: `not be one of \`${stringifyList(
              targets
            )}\`(value: \`${value}\`)`
          })
        }
      }
      return null
    })
  }

  inRange(minValue: number, maxValue: number): NumberPredicate<N> {
    return this.addValidator((value: number): InvalidResult | null => {
      if (value >= minValue && value <= maxValue) {
        return null
      }
      return this.buildResult({
        code: 'number.inRange',
        value,
        validatorArgs: [minValue, maxValue],
        // TODO: Review predicate
        messagePredicate: `be in range from \`${minValue}\` to \`${maxValue}\`(value: ${value})`
      })
    })
  }

  greaterThan(targetValue: number) {
    return this.addValidator((value: number): InvalidResult | null => {
      if (value > targetValue) {
        return null
      }
      return this.buildResult({
        code: 'number.greaterThan',
        value,
        validatorArgs: [targetValue],
        // TODO: Review predicate
        messagePredicate: `be greater than \`${targetValue}\`(value: \`${value}\`)`
      })
    })
  }

  greaterThanOrEqual(targetValue: number) {
    return this.addValidator((value: number): InvalidResult | null => {
      if (value >= targetValue) {
        return null
      }
      return this.buildResult({
        code: 'number.greaterThanOrEqual',
        value,
        validatorArgs: [targetValue],
        // TODO: Review predicate
        messagePredicate: `be greater than or equal to \`${targetValue}\`(value: \`${value}\`)`
      })
    })
  }

  lessThan(targetValue: number) {
    return this.addValidator((value: number): InvalidResult | null => {
      if (value < targetValue) {
        return null
      }
      return this.buildResult({
        code: 'number.lessThan',
        value,
        validatorArgs: [targetValue],
        // TODO: Review predicate
        messagePredicate: `be less than \`${targetValue}\`(value: \`${value}\`)`
      })
    })
  }

  lessThanOrEqual(targetValue: number) {
    return this.addValidator((value: number): InvalidResult | null => {
      if (value <= targetValue) {
        return null
      }
      return this.buildResult({
        code: 'number.lessThanOrEqual',
        value,
        validatorArgs: [targetValue],
        // TODO: Review predicate
        messagePredicate: `be less than or equal to \`${targetValue}\`(value: \`${value}\`)`
      })
    })
  }

  integer() {
    return this.addValidator((value: number): InvalidResult | null => {
      if (is.integer(value)) {
        return null
      }

      return this.buildResult({
        code: 'number.integer',
        value,
        messagePredicate: `be an integer(value: \`${value}\`)`
      })
    })
  }

  finite() {
    return this.addValidator((value: number): InvalidResult | null => {
      if (!is.infinite(value)) {
        return null
      }

      return this.buildResult({
        code: 'number.finite',
        value,
        messagePredicate: `be finite(value: \`${value}\`)`
      })
    })
  }

  infinite() {
    return this.addValidator((value: number): InvalidResult | null => {
      if (is.infinite(value)) {
        return null
      }

      return this.buildResult({
        code: 'number.infinite',
        value,
        messagePredicate: `be infinite(value: \`${value}\`)`
      })
    })
  }

  positive() {
    return this.addValidator((value: number): InvalidResult | null => {
      if (value > 0) {
        return null
      }

      return this.buildResult({
        code: 'number.positive',
        value,
        messagePredicate: `be positive(value: \`${value}\`)`
      })
    })
  }

  negative() {
    return this.addValidator((value: number): InvalidResult | null => {
      if (value < 0) {
        return null
      }

      return this.buildResult({
        code: 'number.negative',
        value,
        messagePredicate: `be negative(value: \`${value}\`)`
      })
    })
  }

  integerOrInfinite() {
    return this.addValidator((value: number): InvalidResult | null => {
      if (is.integer(value) || is.infinite(value)) {
        return null
      }

      return this.buildResult({
        code: 'number.integerOrInfinite',
        value,
        messagePredicate: `be an integer or infinite(value: \`${value}\`)`
      })
    })
  }

  uint8() {
    return this.integer().inRange(0, 255)
  }

  uint16() {
    return this.integer().inRange(0, 65535)
  }
  uint32() {
    return this.integer().inRange(0, 4294967295)
  }

  int8() {
    return this.integer().inRange(-128, 127)
  }

  int16() {
    return this.integer().inRange(-32768, 32767)
  }
  int32() {
    return this.integer().inRange(-2147483648, 2147483647)
  }
}

export function tNum() {
  return new NumberPredicate()
}
