import {
  Validator,
  Predicate,
  ValidatorList,
  ShapeSchema,
  Unshape,
  validate,
  InvalidResult
} from './tval'
import { stringifyList } from './utils'
import is, { Class } from '@sindresorhus/is'
import isEqual from 'lodash.isequal'

const objectValidator: Validator<any> = (value: any) => {
  if (is.object(value)) {
    return null
  }
  const valueType = is(value)

  return {
    code: 'type',
    value,
    valueType,
    validatorArgs: [],
    messagePredicate: `be \`object\` type(type: \`${valueType}\`)`
  }
}

class ObjectPredicate<O extends object = {}> implements Predicate<O> {
  validators: ValidatorList<O>

  constructor(validators: Validator<any>[] = []) {
    if (validators == null) {
      this.validators = [objectValidator]
    } else {
      this.validators = validators
    }
  }

  addValidator<O2 extends object>(
    validator: Validator<O2>
  ): ObjectPredicate<O2> {
    return new ObjectPredicate([...this.validators, validator])
  }

  buildResult(result: Omit<InvalidResult, 'valueType'>) {
    const valueType = is(result.value)
    return {
      ...result,
      valueType
    }
  }

  partialShape<SS extends ShapeSchema>(
    shapeSchema: SS
  ): ObjectPredicate<Unshape<SS> & O> {
    return this.addValidator(value => {
      const keys = Object.keys(shapeSchema)

      for (const key of keys) {
        const propPredicate = shapeSchema[key]
        const propValue = value[key]

        const validateResult = validate(propPredicate, propValue)
        if (validateResult == null) {
          continue
        }
        return validateResult
      }

      return null
    })
  }

  shape<SS extends ShapeSchema>(
    shapeSchema: SS,
    exact: false
  ): ObjectPredicate<Unshape<SS> & O>
  shape<SS extends ShapeSchema>(
    shapeSchema: SS,
    exact: true
  ): ObjectPredicate<Unshape<SS>>
  shape<SS extends ShapeSchema>(
    shapeSchema: SS,
    exact?: boolean
  ): ObjectPredicate<object> {
    if (exact) {
      return this.exactShape(shapeSchema)
    }
    return this.partialShape(shapeSchema)
  }

  exactShape<SS extends ShapeSchema>(
    shapeSchema: SS
  ): ObjectPredicate<Unshape<SS>> {
    return this.addValidator((value: any): InvalidResult | null => {
      const keys = Object.keys(shapeSchema)
      const uncheckedKeySet = new Set(Object.keys(value))

      for (const key of keys) {
        const propPredicate = shapeSchema[key]
        const propValue = value[key]

        const validationResult = validate(propPredicate, propValue)
        if (validationResult == null) {
          uncheckedKeySet.delete(key)
          continue
        }

        return {
          ...validationResult,
          valuePaths:
            validationResult.valuePaths == null
              ? [key]
              : [...validationResult.valuePaths, key]
        }
      }

      if (uncheckedKeySet.size > 0) {
        return this.buildResult({
          code: 'object.exactShape',
          value,
          validatorArgs: [shapeSchema],
          messagePredicate: `not have extra keys, \`${stringifyList([
            ...uncheckedKeySet
          ])}\``
        })
      }

      return null
    })
  }
  
  empty() {
    return this.addValidator((value: any): InvalidResult | null => {
      const keys = Object.keys(value)
      if (keys.length === 0) {
        return null
      }

      return this.buildResult({
        code: 'object.empty',
        value,
        messagePredicate: `be empty(keys: \`${JSON.stringify(keys)}\`)`
      })
    })
  }

  nonEmpty() {
    return this.addValidator((value: any): InvalidResult | null => {
      const keys = Object.keys(value)
      if (keys.length === 0) {
        return null
      }

      return this.buildResult({
        code: 'object.nonEmpty',
        value,
        messagePredicate: `not be empty`
      })
    })
  }

  valuesOfType<O>(predicate: Predicate<O>): Predicate<{ [key: string]: O }> {
    return this.addValidator((value: any): InvalidResult | null => {
      const entries = Object.entries(value)
      for (const [key, value] of entries) {
        const result = validate(predicate, value)
        if (result != null) {
          return {
            ...result,
            valuePaths:
              result.valuePaths == null ? [key] : [...result.valuePaths, key]
          }
        }
      }
      return null
    })
  }

  deepEqual<O>(target: O): Predicate<O> {
    return this.addValidator((value: any): InvalidResult | null => {
      if (isEqual(target, value)) {
        return null
      }

      return this.buildResult({
        code: 'object.deepEqual',
        value,
        validatorArgs: [target],
        messagePredicate: `be deeply equal to \`${JSON.stringify(
          target
        )}\`(value: \`${JSON.stringify(value)}\`)`
      })
    })
  }


  plain() {
    return this.addValidator((value: any): InvalidResult | null => {
      if (is.plainObject(value)) {
        return null
      }

      return this.buildResult({
        code: 'object.plain',
        value,
        messagePredicate: `be a plain object`
      })
    })
  }

  instanceOf<O>(target: Class<O>): Predicate<O> {
    return this.addValidator((value: any): InvalidResult | null => {
      if (value instanceof target) {
        return null
      }
      return this.buildResult({
        code: 'object.instanceOf',
        value,
        validatorArgs: [target],
        messagePredicate: `be instance of ...(value: ${value})`
      })
    })
  }
  
  hasKeys(...keys: readonly string[]): Predicate<O> {
    return this.addValidator((value: any): InvalidResult | null => {
      if (value[])
    })
  }

  hasAnyKeys(...keys: readonly string[]): Predicate<O> {
    return this.addValidator
  }
}

export function tObj() {
  return new ObjectPredicate()
}

export function tShape<SS extends ShapeSchema>(
  shapeSchema: SS,
  exact: boolean = false
): ObjectPredicate<Unshape<SS>> {
  if (exact) {
    return new ObjectPredicate().exactShape(shapeSchema)
  }
  return new ObjectPredicate().partialShape(shapeSchema)
}
