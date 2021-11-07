import { GraphQLSource } from './GraphQLSource'
import { IProcessorSource } from './IProcessorSource'
import pImmediate from 'p-immediate'

let eventSources: Map<string, IProcessorSource> = new Map()

export * from './IProcessorSource'

export async function getProcessorSource(substrateChain: string, indexerEndpointURL: string): Promise<IProcessorSource> {
  if (!eventSources.has(substrateChain)) {
  // just to make it async, do some async init here if needed
    await pImmediate()
    const eventSource = new GraphQLSource(substrateChain, indexerEndpointURL)
    eventSources.set(substrateChain, eventSource)
  }

  const eventSource = eventSources.get(substrateChain)
  if (!eventSource) {
    throw new Error(`No event source found for chain ${substrateChain}`)
  }
  
  return eventSource
}
