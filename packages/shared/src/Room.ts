export enum PlayerStatus {
  READY = "ready",
  CONNECTED = "connected",
  DISCONNECTED = "disconected",
}

export class Player {
  private static EMOJIES = ["\u2763", "\u270B", "\u270C", "\u270A", "\u270D"];
  constructor(
    public handle: string,
    public status: PlayerStatus = PlayerStatus.CONNECTED,
    public emoji?: string
  ) {
    this.status = status;
    this.emoji =
      emoji ||
      Player.EMOJIES[Math.floor(Math.random() * Player.EMOJIES.length)];
  }
  serialize(): string {
    return JSON.stringify({
      handle: this.handle,
      status: this.status,
      emoji: this.emoji,
    });
  }
  static from(serialized: any): Player {
    const parsed = JSON.parse(serialized);
    return new Player(parsed.handle, parsed.status, parsed.emoji);
  }
}

export class PlayerMap {
  constructor(private players: Map<string, Player>) {}
  get(key: string): Player | undefined {
    return this.players.get(key);
  }
  set(key: string, value: Player) {
    this.players.set(key, value);
    return new PlayerMap(this.players);
  }
  has(key: string): boolean {
    return this.players.has(key);
  }
  remove(key: string): PlayerMap {
    this.players.delete(key);
    return new PlayerMap(this.players);
  }
  map<T>(fn: (p: Player) => T): T[] {
    const result = [];
    for (let [_, p] of this.players) {
      result.push(fn(p));
    }
    return result;
  }

  areAllReady(): boolean {
    let waiting = 0;
    this.players.forEach((p) => {
      waiting += p.status != PlayerStatus.READY ? 1 : 0;
    });
    return waiting == 0;
  }

  setStatus(handle: string, status: PlayerStatus): PlayerMap {
    const player = this.players.get(handle);
    if (!player) {
      return this;
    }
    this.players.set(handle, new Player(player.handle, status, player.emoji));
    return new PlayerMap(this.players);
  }
  serialize(): string {
    return JSON.stringify(
      Array.from(this.players.entries()).map(([e, p]) => [e, p.serialize()])
    );
  }
  static from(serialized: any): PlayerMap {
    return new PlayerMap(
      new Map(JSON.parse(serialized).map(([k, p]: any) => [k, Player.from(p)]))
    );
  }
}

export class MiniGame {
  constructor(
    private claimed: Array<{ x: number; y: number; handle: string }>
  ) {}

  getEmojiAt(players: PlayerMap, x: number, y: number): string | undefined {
    const position = this.claimed.find((p) => p.x === x && p.y === y);
    if (!position) {
      return undefined;
    }
    return players.get(position.handle)?.emoji;
  }
  claim(handle: string, x: number, y: number) {
    this.claimed = this.claimed.filter((p) => !(p.x === x && p.y === y));
    this.claimed.push({ handle, x, y });
    return new MiniGame(this.claimed);
  }
  static from(serialized: any): MiniGame {
    return new MiniGame(JSON.parse(serialized));
  }
  serialize(): string {
    return JSON.stringify(this.claimed);
  }
}

export class Room {
  constructor(
    public code: string,
    public players: PlayerMap,
    public minigame: MiniGame
  ) {}

  static forHost(code: string, host: string): Room {
    return new Room(
      code,
      new PlayerMap(new Map([[host, new Player(host)]])),
      new MiniGame([])
    );
  }
  join(handle: string): Room {
    if (this.players.has(handle)) {
      return this;
    }

    return new Room(
      this.code,
      this.players.set(handle, new Player(handle)),
      this.minigame
    );
  }

  addPlayer(player: Player): Room {
    return new Room(
      this.code,
      this.players.set(player.handle, player),
      this.minigame
    );
  }

  remove(handle: string): Room {
    if (!this.players.has(handle)) {
      return this;
    }
    return new Room(this.code, this.players.remove(handle), this.minigame);
  }
  areAllPlayersReady(): boolean {
    return this.players.areAllReady();
  }
  setStatus(handle: string, status: PlayerStatus): Room {
    return new Room(
      this.code,
      this.players.setStatus(handle, status),
      this.minigame
    );
  }
  claimForMinigame(handle: string, x: number, y: number): Room {
    return new Room(this.code, this.players, this.minigame.claim(handle, x, y));
  }
  serialize(): string {
    return JSON.stringify({
      code: this.code,
      minigame: this.minigame.serialize(),
      players: this.players.serialize(),
    });
  }
  static from(serialized: string) {
    const blob = JSON.parse(serialized);
    return new Room(
      blob.code,
      PlayerMap.from(blob.players),
      MiniGame.from(blob.minigame)
    );
  }
}
