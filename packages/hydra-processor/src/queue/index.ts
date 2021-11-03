import { BlockQueue } from './BlockQueue'
import { IBlockQueue } from './IBlockQueue'

export * from './IBlockQueue'

export async function getBlockQueue(chainName: string, indexerEndpointURL: string): Promise<IBlockQueue> {
  const blockQueue = new BlockQueue()
  await blockQueue.init(chainName, indexerEndpointURL)
  
  return blockQueue
}
