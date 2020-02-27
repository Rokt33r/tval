import { isValid, assert, tStr, tShape, tAny, tAnyx, tArr } from '../src'

function expectType<T>(value: T) {}

// @ts-ignore
function testValidate(input: unknown) {
  assert(tStr().equal('a'), input)

  expectType<'a'>(input)
}

let unknownValue: unknown

// tStr#equals
if (isValid(tStr().equal('a'), unknownValue)) {
  expectType<'a'>(unknownValue)
}

// tStr#notEquals(Excluding)
if (
  isValid(
    tStr()
      .oneOf('a', 'b')
      .nonEqual('a'),
    unknownValue
  )
) {
  expectType<'b'>(unknownValue)
}

// tStr#noneOf(Excluding)
if (
  isValid(
    tStr()
      .oneOf('a', 'b', 'c')
      .noneOf('a'),
    unknownValue
  )
) {
  expectType<'b' | 'c'>(unknownValue)
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
if (isValid(tAny(tStr().equal('a'), tStr().equal('b')), unknownValue)) {
  expectType<'a' | 'b'>(unknownValue)
}

// tAnyx
if (
  isValid(tAnyx<'a' | 'b'>(tStr().equal('a'), tStr().equal('b')), unknownValue)
) {
  expectType<'a' | 'b'>(unknownValue)
}

// owarr#ofType
if (isValid(tArr().ofType(tStr().oneOf('a', 'b')), unknownValue)) {
  expectType<Array<'a' | 'b'>>(unknownValue)
}
