import { getRepository, Connection, createConnection } from 'typeorm'

import { ProcessedEventsLogEntity } from '../entities/ProcessedEventsLogEntity'
import Debug from 'debug'
import config from './ormconfig'

const debug = Debug('hydra-processor:dal')

export async function createDBConnection(): Promise<Connection> {
  const _config = config()
  debug(`DB config: ${JSON.stringify(_config, null, 2)}`)
  return createConnection(_config)
}

/**
 * Get last event processed by the given mappings processor
 *
 * @param processorID Name of the processor
 * @param substrateChain Name of the substrate chain
 */
export async function loadState(
  processorID: string,
  substrateChain: string
): Promise<ProcessedEventsLogEntity | undefined> {
  return await getRepository(ProcessedEventsLogEntity).findOne({
    where: {
      processor: processorID,
      substrateChain: substrateChain,
    },
    order: {
      eventId: 'DESC',
      lastScannedBlock: 'DESC',
    },
  })
}

/**
 * Get last event processed by the given mappings processor
 *
 * @param processorID Name of the processor
 */
export async function countProcessedEvents(
  processorID: string,
  substrateChain: string
): Promise<number> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { cnt } = await getRepository(ProcessedEventsLogEntity)
    .createQueryBuilder('events')
    .select('COUNT(DISTINCT(events.event_id))', 'cnt')
    .where({ processor: processorID, substrateChain: substrateChain })
    .getRawOne()!

  debug(`Total events count ${String(cnt)}`)

  return Number.parseInt(cnt) || 0
}
