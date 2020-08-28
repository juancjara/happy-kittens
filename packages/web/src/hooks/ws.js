import socketIOClient from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:3000";

let socket
let subscribers = {};

const useSocket = () => {

  const handleEvent = eventName => (data) => {
    if (subscribers[eventName]) {
      subscribers[eventName](data);
    }
  }

  const subscribeToEvents = () => {
    socket.on('player-joined', handleEvent('player-joined'))
  }

  const join = ({room, userId}, cb) => {
    if (!socket) {
      socket = socketIOClient(ENDPOINT);
      subscribeToEvents();
    }
    socket.emit('join-room', {room, userId}, cb);
  }

  const subscribe = (eventName, fn) => {
    subscribers[eventName] = fn;
  }

  return {join, subscribe}
}

export default useSocket;
