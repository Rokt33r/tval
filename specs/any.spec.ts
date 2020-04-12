import { tAny, validate, tStr, tNum } from '../src'

describe('tAny', () => {
  it('validates with multiple conditions(1st)', () => {
    const result = validate(tAny(tStr(), tNum()), 123)

    expect(result).toBe(null)
  })

  it('validates with multiple conditions(2nd)', () => {
    const result = validate(tAny(tStr(), tNum()), 'string')

    expect(result).toBe(null)
  })

  it('reports a surmarized error message if value does not match any of conditions', () => {
    const result = validate(tAny(tStr(), tNum()), {})

    expect(result).toMatchObject({
      code: 'any',
      subResults: [
        {
          code: 'type'
        },
        { code: 'type' }
      ]
    })
  })
})
