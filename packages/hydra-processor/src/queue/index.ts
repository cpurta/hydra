import { BlockQueue } from './BlockQueue'
import { IBlockQueue } from './IBlockQueue'

export * from './IBlockQueue'

let blockQueue: BlockQueue

export async function getBlockQueue(indexerEndpointURL: string): Promise<IBlockQueue> {
  if (!blockQueue) {
    blockQueue = new BlockQueue()
    await blockQueue.init(indexerEndpointURL)
  }
  return blockQueue
}
