import { ServerWebSocket } from "bun";

export interface ClientData {
  username?: string;
  room?: string;
  message?: string;
}

export enum ClientCMD {
  CHANGE_USERNAME,
  JOIN_ROOM,
  LEAVE_ROOM,
  MESSAGE,
}

export interface ClientPayload {
  cmd?: ClientCMD;
  data?: ClientData;
}

export interface ServerData {
  username?: string;
  message?: string;
}

export enum ServerCMD {
  INFO,
  ERROR,
  MESSAGE,
}

export interface ServerPayload {
  cmd: ServerCMD;
  data: ServerData;
}

export interface WebSocketWithRoom extends ServerWebSocket<unknown> {
  room: string | null;
  username: string | null;
}
