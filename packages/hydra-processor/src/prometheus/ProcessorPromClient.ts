import { Gauge, collectDefaultMetrics } from 'prom-client'
import { IndexerStatus, IProcessorState } from '../state'
import { SubstrateEvent, logError } from '@subsquid/hydra-common'
import Debug from 'debug'
import { countProcessedEvents } from '../db'
import { eventEmitter, ProcessorEvents } from '../start/processor-events'
import { getConfig as conf, getManifest } from '../start/config'

const debug = Debug('index-builder:processor-prom-client')

export class ProcessorPromClient {
  protected lastScannedBlock = new Gauge({
    name: 'hydra_processor_last_scanned_block',
    help: 'Last block the processor has scanned for events',
    labelNames: ['substrateChain'],
  })

  protected chainHeight = new Gauge({
    name: 'hydra_processor_chain_height',
    help: 'Current substrate chain height as reported by the indexer',
    labelNames: ['substrateChain'],
  })

  protected indexerHead = new Gauge({
    name: 'hydra_processor_indexer_head',
    help: 'Last read of the indexer head block',
    labelNames: ['substrateChain'],
  })

  protected processedEvents = new Gauge({
    name: 'hydra_processor_processed_events_cnt',
    help: 'Total number of processed events',
    labelNames: ['name', 'substrateChain'],
  })

  protected eventQueueSize = new Gauge({
    name: 'hydra_processor_event_queue_size',
    help: 'Number of events in the queue',
    labelNames: ['substrateChain'],
  })

  protected rangeFrom = new Gauge({
    name: 'hydra_processor_range_from',
    help: 'Range.from',
    labelNames: ['substrateChain'],
  })

  protected rangeTo = new Gauge({
    name: 'hydra_processor_range_to',
    help: 'Range.to',
    labelNames: ['substrateChain'],
  })

  init(substrateChains: string[]): void {
    collectDefaultMetrics({ prefix: 'hydra_processor_system_' })

    this.initValues(substrateChains)
      .then(() => {
        eventEmitter.on(
          ProcessorEvents.STATE_CHANGE,
          (state: IProcessorState, chain: string) => {
            this.lastScannedBlock.set(
              { substrateChain: chain },
              state.lastScannedBlock
            )
          }
        )

        eventEmitter.on(
          ProcessorEvents.PROCESSED_EVENT,
          (event: SubstrateEvent, chain: string) => {
            this.processedEvents.inc()
            this.processedEvents.inc({
              name: event.name,
              substrateChain: chain,
            })
          }
        )

        eventEmitter.on(
          ProcessorEvents.INDEXER_STATUS_CHANGE,
          (indexerStatus: IndexerStatus) => {
            this.chainHeight.set(indexerStatus.chainHeight)
            this.indexerHead.set(indexerStatus.head)
          }
        )

        eventEmitter.on(ProcessorEvents.QUEUE_SIZE_CHANGE, (size) => {
          this.eventQueueSize.set(size)
        })
      })
      .catch((e) => debug(`Error initializing the values: ${logError(e)}`))
  }

  private async initValues(substrateChains: string[]): Promise<void> {
    for (const chain of substrateChains) {
      const totalEvents = await countProcessedEvents(conf().ID, chain)
      this.processedEvents.set({ substrateChain: chain }, totalEvents)

      for (const mapping of getManifest().mappings) {
        if (mapping.substrateChain !== chain) {
          continue
        }

        this.rangeFrom.set(
          {
            substrateChain: chain,
          },
          mapping.range.from
        )

        this.rangeTo.set(
          {
            substrateChain: chain,
          },
          mapping.range.to
        )
      }
    }
  }
}
