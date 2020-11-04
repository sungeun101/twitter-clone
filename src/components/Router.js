import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Home from 'routes/Home';
import Auth from 'routes/Auth'; // jsconfig.json 설정하면 절대경로 사용
import Profile from 'routes/Profile';
import Navigation from './Navigation';
import Feed from './Feed';
import Sidebar from './Sidebar';
import Widgets from './Widgets';

const AppRouter = ({ isLoggedIn, userObj, refreshUserRealtime }) => {
  return (
    <Router>
      {isLoggedIn && <Navigation userObj={userObj} />}
      <Switch>
        {isLoggedIn ? (
          <>
            <Route exact path="/">
              <Home userObj={userObj} />
              <Sidebar userObj={userObj} />
              <Feed userObj={userObj} />
              <Widgets />
            </Route>
            <Route exact path="/profile">
              <Profile
                userObj={userObj}
                refreshUserRealtime={refreshUserRealtime}
              />
            </Route>
          </>
        ) : (
          <Route exact path="/">
            <Auth />
          </Route>
        )}
      </Switch>
    </Router>
  );
};

export default AppRouter;
