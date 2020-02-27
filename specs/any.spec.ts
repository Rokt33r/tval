import { tAny, report, tStr, tNum } from '../src'

describe('tAny', () => {
  it('validates with multiple conditions(1st)', () => {
    const result = report(tAny(tStr(), tNum()), 123)

    expect(result).toBe(null)
  })

  it('validates with multiple conditions(2nd)', () => {
    const result = report(tAny(tStr(), tNum()), 'string')

    expect(result).toBe(null)
  })

  it('reports a surmarized error message if value does not match any of conditions', () => {
    const result = report(tAny(tStr(), tNum()), {})

    expect(result).toBe(
      [
        'Expected value to match any of following conditions',
        '- Expected value to be of type `string` but received type `Object`',
        '- Expected value to be of type `number` but received type `Object`'
      ].join('\n')
    )
  })
})
