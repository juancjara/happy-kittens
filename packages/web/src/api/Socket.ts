import { Room } from "shared";
import * as RoomCode from "../core/RoomCode";
import * as Handle from "../core/Handle";
import { io, Socket as IOClient } from "socket.io-client";

export default class Socket {
  constructor(
    private client: IOClient,
    public room: Room,
    private callbacks: Array<Function> = []
  ) {
    console.log(this.room);
    this.client.onAny((event, ...args) => console.log(event, args));
    this.client.onAny((event, message) => {
      this.callbacks.forEach((cb) => cb(event, message));
    });
  }
  broadcast(message: any): void {
    this.client.emit(message.action, message.payload);
  }

  onMessage(fn: Function): () => void {
    this.callbacks.push(fn);
    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== fn);
    };
  }

  static async connect(
    code: RoomCode.t,
    handle: Handle.t
  ): Promise<{ room: Room; socket: Socket }> {
    return new Promise((resolve, reject) => {
      const client = io({ auth: { handle, code } });
      client.on("connect_error", (err: { message: string }) => {
        console.log(err);
        reject(err);
      });
      const firstSync = (serialized: string) => {
        const room = Room.from(serialized);
        resolve({ room, socket: new Socket(client, room) });
        client.off("room_sync", firstSync);
      };
      client.once("room_sync", firstSync);
    });
  }
}
