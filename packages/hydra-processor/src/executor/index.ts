import { MappingsLookupService } from './MappingsLookupService'
import { getManifestMapping } from '../start/config'
import { IMappingExecutor } from './IMappingExecutor'
import { IMappingsLookup } from './IMappingsLookup'
import { TransactionalExecutor } from './TransactionalExecutor'

export * from './IMappingExecutor'
export * from './IMappingsLookup'
export * from './tx-aware'

export async function getMappingExecutor(substrateChain: string): Promise<IMappingExecutor> {
  
  const mappingExecutor = new TransactionalExecutor()
  await mappingExecutor.init(substrateChain)
  
  return mappingExecutor
}

export async function getMappingsLookup(substrateChain: string): Promise<IMappingsLookup> {
  const mapping = getManifestMapping(substrateChain)
  if (!mapping) {
    throw new Error(`No mapping found for chain ${substrateChain}`)
  }
  const mappingsLookup = new MappingsLookupService(mapping)
  await mappingsLookup.load()
  
  return mappingsLookup
}
