import React, {useState, createContext, useContext, useCallback} from 'react'
import useSocket from '../hooks/ws'
import roomAPI from '../api/room';

const AppContext = createContext();

const AppProvider = ({children}) => {
  const [user, setUser] = useState();
  const [room, setRoom] = useState();
  const socket = useSocket();

  const addMember = newMember => {
    setRoom(room => ({
      ...room,
      members: room.members.filter(u => u.id !== newMember.id).concat([newMember])
    }))
  }

  const createRoom = async () => {
    const {room, user} = await roomAPI.create({});
    setUser(user);
    setRoom(room);
    joinRoom({room: room.name, userId: user.id});
    return {user, room}
  }

  const joinRoom = (data) => {
    socket.join(data, () => console.log('hi'));
    socket.subscribe('player-joined', addMember);
  }

  const fetchRoom = async ({userId, room}) => {
    const res = await roomAPI.get({userId, room});
    setUser(res.user);
    setRoom(res.room);
    joinRoom({room: res.room.name, userId: res.user.id});
  }

  return (
    <AppContext.Provider
      value={{
        user,
        room,
        setUser,
        setRoom,
        joinRoom,
        fetchRoom,
        createRoom,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

const useApp = () => useContext(AppContext)

export {useApp, AppProvider}
