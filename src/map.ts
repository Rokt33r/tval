import {
  Validator,
  Predicate,
  ValidatorList,
  validate,
  getInvalidErrorMessage,
  InvalidResult
} from './tval'
import { createTypeValidator } from './utils'
import { TypeName } from '@sindresorhus/is/dist'

const mapValidator = createTypeValidator<Map<unknown, unknown>>('Map')

class MapPredicate<K, V> implements Predicate<Map<K, V>> {
  validators: ValidatorList<Map<K, V>>

  constructor(validators?: Validator<any>[]) {
    if (validators == null) {
      this.validators = [mapValidator]
    } else {
      this.validators = validators
    }
  }

  addValidator<K2, V2>(
    validator: Validator<Map<K2, V2>>
  ): MapPredicate<K2, V2> {
    return new MapPredicate([...this.validators, validator])
  }

  buildResult(result: Omit<InvalidResult, 'valueType'>): InvalidResult {
    return {
      ...result,
      valueType: TypeName.Map
    }
  }

  keysOfType<K2 extends K>(
    predicate: Predicate<Map<K, V>>
  ): MapPredicate<K2, V> {
    return this.addValidator((mapValue: Map<any, any>) => {
      for (const [key] of mapValue) {
        const validationResult = validate(predicate, key)
        if (validationResult == null) {
          continue
        }
        const subResults =
          validationResult.subResults != null
            ? [validationResult, ...validationResult.subResults]
            : [validationResult]

        return this.buildResult({
          code: 'map.keysOfType',
          value: mapValue,
          validatorArgs: [predicate],
          subResults,
          messagePredicate: `have valid keys only(${getInvalidErrorMessage(
            validationResult
          )})`
        })
      }

      return null
    })
  }

  valuesOfType<V2 extends V>(
    predicate: Predicate<Map<K, V2>>
  ): MapPredicate<K, V2> {
    return this.addValidator((mapValue: Map<any, any>) => {
      for (const [key, value] of mapValue) {
        const validationResult = validate(predicate, value)
        if (validationResult == null) {
          continue
        }
        return {
          ...validationResult,
          valuePaths:
            validationResult.valuePaths != null
              ? [...validationResult.valuePaths, key]
              : [key]
        }
      }

      return null
    })
  }

  empty(): MapPredicate<K, V> {
    return this.addValidator((value: Map<any, any>) => {
      if (value.size > 0) {
        return this.buildResult({
          code: 'map.empty',
          value,
          validatorArgs: [],
          messagePredicate: `be empty(size: ${value.size})`
        })
      }

      return null
    })
  }

  nonEmpty(): MapPredicate<K, V> {
    return this.addValidator((value: Map<any, any>) => {
      if (value.size === 0) {
        return this.buildResult({
          code: 'map.nonEmpty',
          value,
          validatorArgs: [],
          messagePredicate: 'not be empty'
        })
      }

      return null
    })
  }

  size(size: number) {
    return this.addValidator((value: Map<any, any>) => {
      if (value.size !== size) {
        return this.buildResult({
          code: 'map.size',
          value,
          validatorArgs: [size],
          messagePredicate: `have size \`${size}\`(size: ${value.size}`
        })
      }

      return null
    })
  }

  minSize(size: number) {
    return this.addValidator((value: Map<any, any>) => {
      if (value.size < size) {
        return this.buildResult({
          code: 'map.minSize',
          value,
          validatorArgs: [size],
          messagePredicate: `have a minimum size of \`${size}\`(size: \`${value.size}\`)`
        })
      }

      return null
    })
  }

  maxSize(size: number) {
    return this.addValidator((value: Map<any, any>) => {
      if (value.size > size) {
        return this.buildResult({
          code: 'map.maxSize',
          value,
          validatorArgs: [size],
          messagePredicate: `have a maximum size of \`${size}\`, got \`${value.size}\``
        })
      }

      return null
    })
  }
}

export function tMap() {
  return new MapPredicate()
}
