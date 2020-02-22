import { isValid, assert, tStr, tShape, tAny, tAnyx, tArr } from '../src'

function expectType<T>(value: T) {}

// @ts-ignore
function testValidate(input: unknown) {
  assert(tStr().equals('a'), input)

  expectType<'a'>(input)
}

let unknownValue: unknown

// tStr#equals
if (isValid(tStr().equals('a'), unknownValue)) {
  expectType<'a'>(unknownValue)
}

// tStr#oneOf
if (isValid(tStr().oneOf('a', 'b'), unknownValue)) {
  expectType<'a' | 'b'>(unknownValue)
}

// tShape
if (
  isValid(
    tShape({
      message: tStr()
    }),
    unknownValue
  )
) {
  expectType<{ message: string; [key: string]: unknown }>(unknownValue)
}

// tShape(exact)
if (
  isValid(
    tShape(
      {
        message: tStr()
      },
      true
    ),
    unknownValue
  )
) {
  expectType<{ message: string }>(unknownValue)
}

// tAny
if (isValid(tAny(tStr().equals('a'), tStr().equals('b')), unknownValue)) {
  expectType<'a' | 'b'>(unknownValue)
}

// tAnyx
if (
  isValid(
    tAnyx<'a' | 'b'>(tStr().equals('a'), tStr().equals('b')),
    unknownValue
  )
) {
  expectType<'a' | 'b'>(unknownValue)
}

// owarr#ofType
if (isValid(tArr().ofType(tStr().oneOf('a', 'b')), unknownValue)) {
  expectType<Array<'a' | 'b'>>(unknownValue)
}
