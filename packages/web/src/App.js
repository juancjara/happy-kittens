import React from 'react';
import {Switch, Route} from 'react-router-dom'

import {Box} from './components';
import Home from './pages/Home'
import WaitingRoom from './pages/WaitingRoom'
import Game from './pages/Game';

function App() {
  return (
    <Box height='100vh'>
      <Switch>
        <Route exact path='/'>
          <Home />
        </Route>
        <Route path='/room'>
          <WaitingRoom />
        </Route>
        <Route path='/game'>
          <Game />
        </Route>
      </Switch>
    </Box>
  );
}

export default App;
