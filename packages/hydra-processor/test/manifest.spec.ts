import { expect } from 'chai'
import { parseManifest } from '../src/start/manifest'

export const manifest = parseManifest('./test/fixtures/manifest.yml')

describe('manifest', () => {
  it('parses manifest', () => {
    expect(manifest.mappings.length).to.be.equal(1, 'Has 1 mapping')
    const mapping = manifest.mappings[0]
    expect(Object.keys(mapping.eventHandlers).length).to.be.equal(
      1,
      'Has 1 event handler'
    )
    expect(Object.keys(mapping.extrinsicHandlers).length).to.be.equal(
      1,
      'Has 1 extrinsic handlers'
    )
    expect(mapping.preBlockHooks.length).to.be.equal(2, 'Has 2 pre block hooks')
    expect(mapping.postBlockHooks.length).to.be.equal(
      2,
      'Has 2 post block hooks'
    )
  })
})
