import * as migration_20260703_110021_initial from './20260703_110021_initial';

export const migrations = [
  {
    up: migration_20260703_110021_initial.up,
    down: migration_20260703_110021_initial.down,
    name: '20260703_110021_initial'
  },
];
