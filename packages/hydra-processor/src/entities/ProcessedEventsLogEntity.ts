import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm'

@Entity({
  name: 'processed_events_log',
})
export class ProcessedEventsLogEntity {
  @PrimaryGeneratedColumn()
  id!: number

  // Processor name, e.g. 'hydra-tutorial'
  @Column()
  processor!: string

  // Substrate chain name, e.g. 'kusama', 'polkadot', etc.
  @Column()
  substrateChain!: string

  // the indexed event reference
  @Column()
  @Index()
  eventId!: string

  @Column()
  indexerHead!: number

  @Column()
  chainHead!: number

  // last block the processor has scanned
  @Column()
  lastScannedBlock!: number

  // When the event is added to the database
  @Column('timestamp without time zone', {
    default: () => 'now()',
  })
  updatedAt!: Date
}
