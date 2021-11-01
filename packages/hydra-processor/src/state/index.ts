import { IStateKeeper } from './IStateKeeper'
import { StateKeeper } from './StateKeeper'

export * from './IStateKeeper'
export * from './StateKeeper'

export async function getStateKeeper(indexerEndpointURL: string): Promise<IStateKeeper> {
  const stateKeeper = new StateKeeper()
  await stateKeeper.init(indexerEndpointURL)
  
  return stateKeeper
}
