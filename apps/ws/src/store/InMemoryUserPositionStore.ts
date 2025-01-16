export interface User {
  id: string,
  x: number,
  y: number
}


export interface Room {
  roomId: string;
  users: User[]
}


export class InMemoryUserPositionStore {
  private store: Map<string, Room>;

  constructor() {
    this.store = new Map<string, Room>()
  }

  // storing the data of new Room created
  initRoom(roomId: string) {
    this.store.set(roomId, {
      roomId,
      users: []
    })
  }
}