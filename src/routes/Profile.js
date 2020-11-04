import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { authService } from 'fbase';

export default ({ userObj, refreshUserRealtime }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const history = useHistory();

  const onLogoutClick = () => {
    authService.signOut();
    history.push('/');
  };

  // 데이터 filter하기
  // where
  // => return — The created Query
  // const getMyTweets = async () => {
  //   const tweets = await dbService
  //     .collection('tweets')
  //     .where('creatorId', '==', userObj.uid)
  //     .orderBy('creatorAt')
  //     .get();
  //   console.log(tweets.docs.map((doc) => doc.data()));
  // };
  // useEffect(() => {
  //   getMyTweets();
  // }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({ displayName: newDisplayName }); //The profile's displayName and photoURL to update.
    }
    refreshUserRealtime();
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewDisplayName(value);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          placeholder="your new display name"
          value={newDisplayName}
        />
        <input type="submit" value="Update Profile Name" />
      </form>

      <button onClick={onLogoutClick}>Logout</button>
    </>
  );
};
