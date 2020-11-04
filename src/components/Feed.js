import React, { useEffect, useState } from 'react';
import './Feed.css';
import Post from './Post';
import TweetBox from './TweetBox';
import { dbService } from 'fbase';
import FlipMove from 'react-flip-move';

const Feed = ({ userObj }) => {
  const [posts, setPosts] = useState([]);

  // 생성한 트윗 firebase에서 받아오기
  useEffect(() => {
    dbService.collection('posts').onSnapshot((snapshot) => {
      const postArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postArray);
    });
  }, []);

  return (
    <div className="feed">
      <div className="feed__header">
        <h2>Home</h2>
      </div>

      <TweetBox userObj={userObj} />

      {/* Post.js에 firebase로부터 받아온 데이터 보내기.. FlipMove는 ref가 있는 Post.js에 적용됨
      - Flip Move uses refs to identify and apply styles to children
      - All children need a unique key property
       */}
      <FlipMove>
        {posts.map((post) => (
          <Post
            key={post.id}
            postObj={post}
            userObj={userObj}
            isOwner={post.creatorId === userObj.uid}
          />
        ))}
      </FlipMove>
    </div>
  );
};

export default Feed;
