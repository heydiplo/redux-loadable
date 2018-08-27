import stableToJson from './stableToJson'

describe('utils/stableToJson', () => {
  it('works', () => {
    expect(
      stableToJson({ a: 1, b: 2 })
    ).toEqual(
      '{"a": 1,"b": 2}'
    )

    expect(
      stableToJson({ b: 2, a: 1 })
    ).toEqual(
      '{"a": 1,"b": 2}'
    )

    expect(
      stableToJson({ a: 1, b: [2, 3, 4] })
    ).toEqual(
      '{"a": 1,"b": [2,3,4]}'
    )

    expect(
      stableToJson({ a: 1, b: undefined })
    ).toEqual(
      '{"a": 1}'
    )

    expect(
      stableToJson({ a: 1, b: { c: 1, d: 2 }})
    ).toEqual(
      '{"a": 1,"b": {"c": 1,"d": 2}}'
    )

    expect(
      stableToJson({ a: 1, b: { d: 2, c: 1 }})
    ).toEqual(
      '{"a": 1,"b": {"c": 1,"d": 2}}'
    )
  })
})


