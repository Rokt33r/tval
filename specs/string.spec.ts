import { report, tStr } from '../src'

describe('tStr', () => {
  it('validates value is string', () => {
    const result = report(tStr(), 'Hello, World!')

    expect(result).toBe(null)
  })

  it('validates value is string(invalid)', () => {
    const result = report(tStr(), 123)

    expect(result).toBe(
      'Expected value to be of type `string` but received type `number`'
    )
  })

  describe('equals', () => {
    it('validates value is equal to expected string', () => {
      const result = report(tStr().equals('Hello, World!'), 'Hello, World!')

      expect(result).toBe(null)
    })

    it('validates value is equal to expected string(invalid)', () => {
      const result = report(tStr().equals('Hello, World!'), 'Hola, Mundo!')

      expect(result).toEqual(
        'Expected value to be equal to `Hello, World!`, got `Hola, Mundo!`'
      )
    })
  })

  describe('oneOf', () => {
    it('validates value is one of expected string(1st)', () => {
      const result = report(tStr().oneOf('a', 'b'), 'a')

      expect(result).toBe(null)
    })
    it('validates value is one of expected string(2nd)', () => {
      const result = report(tStr().oneOf('a', 'b'), 'b')

      expect(result).toBe(null)
    })
    it('validates value is one of expected string(invalid)', () => {
      const result = report(tStr().oneOf('a', 'b'), 'c')

      expect(result).toBe('Expected value to be one of `["a","b"]`, got `c`')
    })
    it('validates value is one of expected string(invalid)', () => {
      const result = report(
        tStr().oneOf(
          'a',
          'b',
          'c',
          'd',
          'e',
          'f',
          'g',
          'h',
          'i',
          'j',
          'k',
          'l'
        ),
        'z'
      )

      expect(result).toBe(
        'Expected value to be one of `["a","b","c","d","e","f","g","h","i","j",…+2 more]`, got `z`'
      )
    })
  })
})
