import type {Opaque} from './Opaque';
import * as User from './User';

enum PlayerState {
  READY = "READY",
  WAITING = "WAITING",
  DISCONNECTED = "DISCONNECTED",
};

type $Player = {
  id: string,
  name: User.t,
};

export type t = Opaque<'Player', $Player>;

export function make(value: $Player): t {
  return value as t;
}