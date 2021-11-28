import { MappingsLookupService } from './MappingsLookupService'
import { getManifestMapping } from '../start/config'
import { IMappingExecutor } from './IMappingExecutor'
import { IMappingsLookup } from './IMappingsLookup'
import { TransactionalExecutor } from './TransactionalExecutor'

export * from './IMappingExecutor'
export * from './IMappingsLookup'
export * from './tx-aware'

const mappingExecutors: Map<string, IMappingExecutor> = new Map()
const mappingsLookups: Map<string, IMappingsLookup> = new Map()

export async function getMappingExecutor(
  substrateChain: string
): Promise<IMappingExecutor> {
  if (!mappingExecutors.has(substrateChain)) {
    const mappingExecutor = new TransactionalExecutor()
    await mappingExecutor.init(substrateChain)
    mappingExecutors.set(substrateChain, mappingExecutor)
  }

  const mappingExecutor = mappingExecutors.get(substrateChain)
  if (!mappingExecutor) {
    throw new Error(`MappingExecutor not found for chain ${substrateChain}`)
  }

  return mappingExecutor
}

export async function getMappingsLookup(
  substrateChain: string
): Promise<IMappingsLookup> {
  if (!mappingsLookups.has(substrateChain)) {
    const mapping = getManifestMapping(substrateChain)
    if (!mapping) {
      throw new Error(`No mapping found for chain ${substrateChain}`)
    }
    const mappingsLookup = new MappingsLookupService(mapping)
    await mappingsLookup.load()
    mappingsLookups.set(substrateChain, mappingsLookup)
  }

  const mappingsLookup = mappingsLookups.get(substrateChain)
  if (!mappingsLookup) {
    throw new Error(`MappingsLookup not found for chain ${substrateChain}`)
  }

  return mappingsLookup
}
