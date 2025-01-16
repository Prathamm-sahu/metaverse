export enum RoomType {
  LOBBY = "public_lobby",
  CUSTOM = 'custom'
}

export interface IRoomData {
  id: string
  name: string;
  type: RoomType
  description: string;
  password: string | null;
  autoDispose?: boolean
}