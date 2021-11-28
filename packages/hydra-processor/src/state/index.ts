import { IStateKeeper } from './IStateKeeper'
import { StateKeeper } from './StateKeeper'

export * from './IStateKeeper'
export * from './StateKeeper'

const stateKeepers: Map<string, IStateKeeper> = new Map()

export async function getStateKeeper(
  chainName: string,
  indexerEndpointURL: string
): Promise<IStateKeeper> {
  if (!stateKeepers.has(chainName)) {
    const stateKeeper = new StateKeeper(chainName)
    await stateKeeper.init(indexerEndpointURL)

    stateKeepers.set(chainName, stateKeeper)
  }

  const stateKeeper = stateKeepers.get(chainName)
  if (!stateKeeper) {
    throw new Error(`StateKeeper for chain ${chainName} not found`)
  }

  return stateKeeper
}
