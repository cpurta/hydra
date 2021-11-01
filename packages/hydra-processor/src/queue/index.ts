import { BlockQueue } from './BlockQueue'
import { IBlockQueue } from './IBlockQueue'

export * from './IBlockQueue'

export async function getBlockQueue(indexerEndpointURL: string): Promise<IBlockQueue> {
  const blockQueue = new BlockQueue()
  await blockQueue.init(indexerEndpointURL)
  
  return blockQueue
}
