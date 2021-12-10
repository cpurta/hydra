import { expect } from 'chai'
import { distinctItems } from './utils'

describe('utils', () => {
  it('should filter only distinct items', () => {
    const arr = [
      'staking.Bonded',
      'staking.Reward',
      'staking.Slash',
      'staking.Reward',
      'staking.Slash',
    ]

    const distinct = distinctItems(arr)
    expect(distinct).has.lengthOf(3)
    expect(distinct).to.deep.equal([
      'staking.Bonded',
      'staking.Reward',
      'staking.Slash',
    ])
  })
})
