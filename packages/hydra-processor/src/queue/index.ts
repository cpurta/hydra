import { BlockQueue } from './BlockQueue'
import { IBlockQueue } from './IBlockQueue'

export * from './IBlockQueue'

let blockQueues: Map<string, IBlockQueue> = new Map()

export async function getBlockQueue(chainName: string, indexerEndpointURL: string): Promise<IBlockQueue> {
  if (!blockQueues.has(chainName)) {
    const blockQueue = new BlockQueue()
    await blockQueue.init(chainName, indexerEndpointURL)
    blockQueues.set(chainName, blockQueue)
  }
  
  const blockQueue = blockQueues.get(chainName)
  if (!blockQueue) {
    throw new Error(`BlockQueue not found for chain ${chainName}`)
  }

  return blockQueue
}
