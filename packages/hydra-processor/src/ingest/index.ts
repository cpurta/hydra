import { GraphQLSource } from './GraphQLSource'
import { IProcessorSource } from './IProcessorSource'
import pImmediate from 'p-immediate'

export * from './IProcessorSource'

export async function getProcessorSource(indexerEndpointURL: string): Promise<IProcessorSource> {
  // just to make it async, do some async init here if needed
  await pImmediate()
  const eventSource = new GraphQLSource(indexerEndpointURL)
  
  return eventSource
}
