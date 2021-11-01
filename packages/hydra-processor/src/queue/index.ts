import { BlockQueue } from './BlockQueue'
import { IBlockQueue } from './IBlockQueue'

export * from './IBlockQueue'

export async function getBlockQueue(substrateChain: string, indexerEndpointURL: string): Promise<IBlockQueue> {
  const blockQueue = new BlockQueue()
  await blockQueue.init(substrateChain, indexerEndpointURL)
  
  return blockQueue
}
