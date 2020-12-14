// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js'

export default {
  chains: {
    Kusama: 'kusama',
    'Kusama CC3': 'kusama',
    Polkadot: 'polkadot',
  },
  create: (chain: string, path: string, data: BN | number | string): string =>
    `https://${chain}.polkassembly.io/${path}/${data.toString()}`,
  isActive: true,
  paths: {
    bounty: 'bounty',
    council: 'motion',
    proposal: 'proposal',
    referendum: 'referendum',
    tip: 'tip',
    treasury: 'treasury',
  },
  url: 'https://polkassembly.io/',
}
