export interface MessageData {
  time: string;
  username: string;
  text: string;
}

export interface ChatInfo {
  room: string;
  members: string[];
  messages: MessageData[];
  key: string;
}
