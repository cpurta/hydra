import { MappingsProcessor } from '../process/MappingsProcessor'
import { Connection } from 'typeorm'
import Debug from 'debug'
import { logError } from '@subsquid/hydra-common'
import { log } from 'console'
import { createDBConnection } from '../db/dal'
import { ProcessorPromClient, startPromEndpoint } from '../prometheus'
import { error, info } from '../util/log'
import pWaitFor from 'p-wait-for'
import { Server } from 'http'
import { getHydraVersion } from '../state/version'
import { getManifest } from './config'

const debug = Debug('hydra-processor:runner')

// Respondible for creating, starting up and shutting down the query node.
// Currently this class is a bit thin, but it will almost certainly grow
// as the integration logic between the library types and the application
// evolves, and that will pay abstraction overhead off in terms of testability of otherwise
// anonymous code in root file scope.
export class ProcessorRunner {
  private connection: Connection | undefined
  private processors: MappingsProcessor[] | undefined
  private promServer: Server | undefined

  constructor() {
    info(`Hydra processor lib version: ${getHydraVersion()}`)
    // Hook into application
    // eslint-disable-next-line
    process.on('exit', () =>
      this.shutDown().catch((e) => log(`${logError(e)}`))
    )
    process.on('SIGINT', () =>
      this.shutDown().catch((e) => log(`${logError(e)}`))
    )
  }

  /**
   * Starts the mappings processor
   *
   * @param options options passed to create the mappings
   */
  async process(): Promise<void> {
    info('Establishing a database connection')
    this.connection = await createDBConnection()

    this.processors = []
    for (const chain of getManifest().processor.chains) {
      this.processors?.push(
        new MappingsProcessor(chain.name, chain.indexerEndpointURL)
      )
    }

    info(`Created ${this.processors.length} processors`)
    info(JSON.stringify(this.processors))

    try {
      const promClient = new ProcessorPromClient()
      promClient.init(getManifest().processor.chains.map((c) => c.name))
      this.promServer = startPromEndpoint()
    } catch (e) {
      error(`Can't start Prometheus endpoint: ${logError(e)}`)
    }

    await Promise.all(
      this.processors?.map(async (processor) => processor.start()) ?? []
    )
  }

  async shutDown(): Promise<void> {
    info('Shutting down processors')
    if (this.processors) {
      for (const processor of this.processors) {
        processor.stop()
        await pWaitFor(() => (processor as MappingsProcessor).stopped)
      }
    }

    if (this.connection && this.connection.isConnected) {
      info('Closing the database connection...')
      await this.connection.close()
      debug('Done closing the connection')
    }

    if (this.promServer) {
      this.promServer.close()
    }
    debug(`Exiting`)
    // force all pending promises and open ports to exit
    process.exit()
  }
}
