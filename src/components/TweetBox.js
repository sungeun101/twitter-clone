import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Button } from '@material-ui/core';
import './TweetBox.css';
import { dbService, storageService } from 'fbase';
import { v4 as uuidv4 } from 'uuid';

function TweetBox({ userObj }) {
  const [tweetMessage, setTweetMessage] = useState('');
  const [tweetImage, setTweetImage] = useState('');

  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const fileImg = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(fileImg);
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setTweetImage(result);
    };
  };

  const sendTweet = async (e) => {
    e.preventDefault();
    // 이미지 첨부
    let tweetImageUrl = '';
    if (tweetImage !== '') {
      const tweetImageRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const response = await tweetImageRef.putString(tweetImage, 'data_url');
      tweetImageUrl = await response.ref.getDownloadURL();
    }
    // 트윗 생성
    const postObj = {
      verified: true,
      text: tweetMessage,
      creatorId: userObj.uid,
      createdAt: Date.now(),
      tweetImageUrl,
    };
    await dbService.collection('posts').add(postObj);
    setTweetMessage('');
    setTweetImage('');
    inputRef.current.focus();
  };

  return (
    <div className="tweetBox">
      <form>
        <div className="tweetBox__input">
          <Avatar src="https://kajabi-storefronts-production.global.ssl.fastly.net/kajabi-storefronts-production/themes/284832/settings_images/rLlCifhXRJiT0RoN2FjK_Logo_roundbackground_black.png" />
          <input
            onChange={(e) => setTweetMessage(e.target.value)}
            value={tweetMessage}
            placeholder="What's happening?"
            type="text"
            ref={inputRef}
          />
          <input
            className="tweetBox__imageInput"
            type="file"
            accept="image/*"
            onChange={onFileChange}
          />
        </div>
        <Button
          disabled={!tweetMessage}
          type="submit"
          onClick={sendTweet}
          className="tweetBox__tweetButton"
        >
          Tweet
        </Button>
      </form>
    </div>
  );
}

export default TweetBox;
