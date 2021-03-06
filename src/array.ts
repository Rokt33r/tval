import { Validator, Predicate, ValidatorList, validate } from './tval'
import { appendValuePath, createTypeValidator } from './utils'

const arrayValidator = createTypeValidator<Array<any>>('Array')

class ArrayPredicate<A extends Array<any>> implements Predicate<A> {
  validators: ValidatorList<A>

  constructor(validators?: Validator<any>[]) {
    if (validators == null) {
      this.validators = [arrayValidator]
    } else {
      this.validators = validators
    }
  }

  addValidator<A2 extends Array<any>>(
    validator: Validator<A2>
  ): ArrayPredicate<A2> {
    return new ArrayPredicate([...this.validators, validator])
  }

  ofType<I extends A[number]>(predicate: Predicate<I>): ArrayPredicate<I[]> {
    return this.addValidator((value: Array<unknown>) => {
      for (let index = 0; index < value.length; index++) {
        const validationResult = validate(predicate, value)
        if (validationResult == null) {
          continue
        }
        return appendValuePath(validationResult, index.toString())
      }
      return null
    })
  }

  // empty
  // nonEmpty
  // length
  // minLength
  // maxLength
  // include
  // includeAny
  // exclude
  // deepEqual
}

export function tArr() {
  return new ArrayPredicate()
}
