import React, { useState } from 'react';
import { dbService, storageService } from 'fbase';
import { v4 as uuidv4 } from 'uuid';

// 트윗 생성
const TweetFactory = ({ userObj }) => {
  const [tweet, setTweet] = useState('');
  const [attachment, setAttachment] = useState(''); // image file

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setTweet(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const fileImg = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(fileImg);
    // readAsDataURL 메서드는 컨텐츠를 특정 Blob 이나 File에서 읽어 오는 역할을 합니다. 다 읽고나서는 loadend 이벤트가 트리거 + 인코딩 된 스트링 데이터가 result 속성에 담아지게 됩니다.
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
  };

  const onClearAttachment = () => setAttachment(null);

  //  --------- CREATE DATA ---------
  const onSubmit = async (e) => {
    e.preventDefault();
    let attachmentUrl = '';
    if (attachment !== '') {
      // 1단계 = ref 생성
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      // - UUID?
      //  네트워크 상에서 서로 모르는 객체들을 식별하고 구별하기 위해 각각의 고유한 이름을 부여하기 위해 고안된 기술 => 이미지 파일 이름 random, unique하게
      // 2단계 = ref에 data(이미지 주소 string)보내기
      const response = await attachmentRef.putString(attachment, 'data_url'); // Uploads string data to this reference's location.
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const tweetObj = {
      text: tweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await dbService.collection('tweets').add(tweetObj);
    setTweet('');
    setAttachment('');
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={tweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Tweet" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" alt="flower" />
            <button onClick={onClearAttachment}>Clear Image</button>
          </div>
        )}
      </form>
    </div>
  );
};

export default TweetFactory;
