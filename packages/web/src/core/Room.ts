import type {Opaque} from './Opaque';

export type t = Opaque<'Room', string>;

export function make(value: string): t {
  return value as t;
}