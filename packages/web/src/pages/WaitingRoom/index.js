import React, {useEffect} from 'react'
import {useParams} from 'react-router-dom'

import {Page, Box} from '../../components';
import {useApp} from '../../modules/app'

const WaitingRoom = () => {
  const params = useParams();
  const {room, user, fetchRoom} = useApp();

  useEffect(() => {
    if (!user) {
      fetchRoom({userId: params.userId, room: params.roomId});
    }
  }, [user, fetchRoom, params])
  if (!room) return null;

  return (
    <Page>
      <Box>WaitingRoom - {params.roomId}</Box>
      <Box>username: {user.username}</Box>
      <Box>members: </Box>
      <ul>
        {
          room && room.members.map((user, i) => (
            <li key={i}>{user.username} - {user.id === room.ownerId ? 'owner' : 'guest'}</li>
          ))
        }
      </ul>
    </Page>
  );
}

export default WaitingRoom;
