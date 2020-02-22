import is from '@sindresorhus/is'
import {
  Validator,
  Predicate,
  ValidatorList,
  ShapeSchema,
  Unshape,
  report
} from './tval'
import { appendKeyToValidationResult, createTypeValidator } from './utils'

const objectValidator = createTypeValidator<any>('Object')

class ObjectPredicate<O extends object = {}> implements Predicate<O> {
  validators: ValidatorList<O>

  constructor(validators?: Validator<any>[]) {
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

  partialShape<SS extends ShapeSchema>(
    shapeSchema: SS
  ): ObjectPredicate<Unshape<SS> & O> {
    return this.addValidator(value => {
      const keys = Object.keys(shapeSchema)

      for (const key of keys) {
        const propPredicate = shapeSchema[key]
        const propValue = value[key]

        const predicateResult = report(propPredicate, propValue)
        if (predicateResult == null) {
          continue
        }
        return predicateResult
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
    return this.addValidator(value => {
      const keys = Object.keys(shapeSchema)
      const uncheckedKeySet = new Set(Object.keys(value))

      for (const key of keys) {
        const propPredicate = shapeSchema[key]
        const propValue = value[key]

        const validationResult = report(propPredicate, propValue)
        if (validationResult == null) {
          uncheckedKeySet.delete(key)
          continue
        }

        return appendKeyToValidationResult(validationResult, key)
      }

      if (uncheckedKeySet.size > 0) {
        const missingKey = [...uncheckedKeySet][0]
        return `Expected property, \`${missingKey}\`, not to exist, got \`${is(
          value[missingKey]
        )}\``
      }

      return null
    })
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
