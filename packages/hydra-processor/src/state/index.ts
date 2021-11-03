import { IStateKeeper } from './IStateKeeper'
import { StateKeeper } from './StateKeeper'

export * from './IStateKeeper'
export * from './StateKeeper'

export async function getStateKeeper(chainName: string, indexerEndpointURL: string): Promise<IStateKeeper> {
  const stateKeeper = new StateKeeper(chainName)
  await stateKeeper.init(indexerEndpointURL)
  
  return stateKeeper
}
