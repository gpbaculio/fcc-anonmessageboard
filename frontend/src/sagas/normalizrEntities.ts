import { schema } from 'normalizr';

export const reply = new schema.Entity('replies', {}, { idAttribute: '_id' });

export const thread = new schema.Entity(
  'threads',
  { replies: [reply] },
  { idAttribute: '_id' }
);

export const board = new schema.Entity(
  'boards',
  { threads: [thread] },
  { idAttribute: '_id' }
);
