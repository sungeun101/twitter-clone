// jsconfig.json 설정하면 절대경로 사용
import React, { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fbase';
import './App.css';

function App() {
  // const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
  //firebase가 아직 시작되지도 않아서 currentUser는 null이므로 무조건 로그아웃 상태 .. firebase가 초기화될 시간을 줘야한다.
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        // 로그인
        // setUserObj(user);
        // user전체를 가져오지 말고 필요한 부분만 가져와서 object사이즈를 줄여 react가 변화를 감지할 수 있도록
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          // uid?
          // The primary way to identify a user is by their uid, a unique identifier for that user
          updateProfile: (args) => user.updateProfile(args),
        });
      } else {
        // 로그아웃
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  // useEffect 를 사용 할 때에는 첫번째 파라미터에는 함수, 두번째 파라미터에는 의존값이 들어있는 배열 (deps)을 넣습니다. 만약에 deps 배열을 비우게 된다면, 컴포넌트가 처음 나타날 때에만 useEffect 에 등록한 함수가 호출됩니다.
  // onAuthStateChanged = 이벤트 리스너..

  const refreshUserRealtime = () => {
    // userObj를 바꿔줘야 react가 변화를 감지해서 re-render되기 때문에 실시간으로 업데이트 가능
    // 1) 먼저 firebase에 있는 user를 가져온다
    const user = authService.currentUser; // get the currently signed-in user
    // 2) firebase의 user 정보를 가지고 userObj를 바꿔줘서 react.js를 업데이트
    setUserObj({
      avatar: '',
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  };

  return (
    <div className="app">
      {/* firebase 초기화 되고 난 후 로그인상태 알수있도록  */}
      {init ? (
        <>
          <AppRouter
            refreshUserRealtime={refreshUserRealtime}
            isLoggedIn={Boolean(userObj)}
            userObj={userObj}
          />
        </>
      ) : (
        'Initializing...'
      )}
    </div>
  );
}

export default App;
