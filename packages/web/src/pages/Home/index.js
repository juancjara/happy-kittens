import React from 'react'
import {useHistory} from 'react-router-dom'

import {Page, Box} from '../../components';
import {useApp} from '../../modules/app';

const Home = () => {
  const history = useHistory();
  const {createRoom} = useApp();

  return (
    <Page>
      <Box>Home</Box>
      <div />
      <button onClick={async () => {
        const {user, room} = await createRoom();
        history.push(`/room/${room.name}/${user.id}`);
      }}>create room</button>
    </Page>
  );
}

export default Home;
