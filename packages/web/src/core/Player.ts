import type { Opaque } from "./Opaque";
import * as Handle from "./Handle";

type $Player = {
  id: string;
  handle: Handle.t;
};

export type t = Opaque<"Player", $Player>;

export function make(value: $Player): t {
  return value as t;
}
