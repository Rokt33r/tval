import { validate, tStr } from '../src'

describe('tStr', () => {
  it('validates value is string', () => {
    const result = validate(tStr(), 'Hello, World!')

    expect(result).toBe(null)
  })

  it('validates value is string(invalid)', () => {
    const result = validate(tStr(), 123)

    expect(result).toEqual({
      code: 'type',
      valueType: 'number',
      value: 123,
      validatorArgs: ['string'],
      messagePredicate: 'be `string` type, not `number` type'
    })
  })

  describe('equal', () => {
    it('validates value is equal to expected string', () => {
      const result = validate(tStr().equal('Hello, World!'), 'Hello, World!')

      expect(result).toBe(null)
    })

    it('validates value is equal to expected string(invalid)', () => {
      const result = validate(tStr().equal('Hello, World!'), 'Hola, Mundo!')

      expect(result).toEqual({
        code: 'string.equal',
        valueType: 'string',
        value: 'Hola, Mundo!',
        validatorArgs: ['Hello, World!'],
        messagePredicate:
          'be equal to `Hello, World!`, not equal to `Hola, Mundo!`'
      })
    })
  })

  describe('oneOf', () => {
    it('validates value is one of expected string(1st)', () => {
      const result = validate(tStr().oneOf('a', 'b'), 'a')

      expect(result).toBe(null)
    })
    it('validates value is one of expected string(2nd)', () => {
      const result = validate(tStr().oneOf('a', 'b'), 'b')

      expect(result).toBe(null)
    })
    it('validates value is one of expected string(invalid)', () => {
      const result = validate(tStr().oneOf('a', 'b'), 'c')

      expect(result).toMatchObject({
        code: 'string.oneOf'
      })
    })
  })
})
