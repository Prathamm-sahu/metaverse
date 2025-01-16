import { RoomType } from "../types/room"

interface User {
  id: string,
  username: string,
  socket: any
  x: number,
  y: number,
  anim: string,
  // readyToConnect: boolean,
  // videoConnected: boolean,
}

interface Room {
  id: string,
  name: string,
  type: RoomType
  users: User[]
  description: string,
  password: string | null,
  numberofUsers: number
}

interface AddUserProps {
  roomId: string;
  roomType: RoomType;
  name: string;
  description: string;
  password: string | null;
  userId: string;
  username: string;
  socket: any;
}


interface UpdateUserProps {
  roomId: string;
  userId: string;
  username?: string;
  socket?: any;
}

interface RemoveUserProps {
  roomId: string;
  userId: string;
}

interface GetUserProps {
  roomId: string;
  userId: string;
}

interface BroadcastProps {
  roomId: string;
  userId: string;
}

const publicRoomLimit = 20
const privateRoomLimit = 20

export class UserManager {
  private rooms: Map<string, Room>;

  constructor() {
    this.rooms = new Map<string, Room>()
  }

  // Client will send roomId and roomType from frontend
  addUser({ roomId, roomType, name, description, password, userId, username, socket }: AddUserProps) {
    const room = this.rooms.get(roomId);

    // If room not found
    if (!room) {
      this.rooms.set(roomId, {
        id: roomId,
        name,
        type: roomType,
        users: [
          {
            id: userId,
            username,
            socket,
            x: 705,
            y: 500,
            anim: "adam_idle_down",
            // readyToConnect: false,
            // videoConnected: false,
          },
        ],
        description,
        password,
        numberofUsers: 1
      }
    );

      return;
    }

    if(room.numberofUsers >= 20) {
      return {
        msg: "Room Limit reached"
      }
    }

    room.users.push({
      id: userId,
      username,
      socket,
      x: 705,
      y: 500,
      anim: "adam_idle_down",
    });

    room.numberofUsers += 1;
  }


  updateUser({ roomId, userId, socket }: UpdateUserProps) {
    const user: User | undefined = this.rooms
      .get(roomId)
      ?.users.find(({ id }) => id === userId);

    if (!user) {
      return {
        msg: "User not found"
      };
    }

    // Update the socket variable
    this.rooms.get(roomId)?.users.forEach((user) => {
      if (user.id === userId) {
        user.socket = socket;
      }
    });
  }

  removeUser({ roomId, userId }: RemoveUserProps) {
    const users = this.rooms.get(roomId)?.users;

    if (!users) {
      return {
        msg: "User not found"
      };
    }

    users.filter(({ id }) => id !== userId);

    // reduced the count of the user
    const room = this.rooms.get(roomId)
    if(room) {
      room.numberofUsers -= 1;
    }
  }

  getUser({ roomId, userId }: GetUserProps) {
    const user = this.rooms.get(roomId)?.users.find(({ id }) => id === userId);

    if (!user) {
      return null;
    }

    return user;
  }

  updateUserPostion({ roomId, userId, x, y, anim}: { roomId: any, userId: any, x: any, y: any, anim: any }) {
    const room = this.rooms.get(roomId)

    if(!room) {
      return {
        msg: "Room does not exist"
      }
    }

    room.users.forEach((user) => {
      if(user.id === userId) {
        user.x = x
        user.y = y
        user.anim = anim
      }
    })

    return;
  }

  // Broadcast User 

  broadcast({ roomId, userId, x, y, anim }: { roomId: any, userId: any, x: any, y: any, anim: any }) {
    this.updateUserPostion({ roomId, userId, x, y, anim })

    const message = {
      type: "User_Position",
      payload: {
        roomId,
        userId,
        x,
        y,
        anim
      }
    }

    const room = this.rooms.get(roomId);

    if (!room) {
      return null;
    }

    // Broadcasting this message to everyone
    room.users.forEach(({ socket, id }) => {
      if (id !== userId) {
        socket.send(JSON.stringify(message));
      }
    });
  }
}