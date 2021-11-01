import { IStateKeeper } from './IStateKeeper'
import { StateKeeper } from './StateKeeper'

export * from './IStateKeeper'
export * from './StateKeeper'

export async function getStateKeeper(substrateChain: string, indexerEndpointURL: string): Promise<IStateKeeper> {
  const stateKeeper = new StateKeeper(substrateChain)
  await stateKeeper.init(indexerEndpointURL)
  
  return stateKeeper
}
