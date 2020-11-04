import React, { useEffect, useState } from 'react';
import { dbService } from 'fbase';
import Tweet from 'components/Tweet';
import TweetFactory from 'components/TweetFactory';

const Home = ({ userObj }) => {
  const [tweets, setTweets] = useState([]); // collection

  // --------- #1 READ DATA using get() method ---------
  //     // "get" method to retrieve the entire collection.
  //     // The documents can be accessed as an array via the "docs" property or enumerated using the "forEach" method
  //   const getTweets = async () => {
  //     const dbTweets = await dbService.collection('tweets').get();
  //     dbTweets.forEach((document) => {
  //       const tweetObj = {
  //         // data() : Retrieves all fields in the document as an Object.
  //         ...document.data(),
  //         id: document.id,
  //       };
  //       setTweets((prev) => [tweetObj, ...prev]); // prev: 이전 document.data, id
  //     });
  //   };

  // ---- #2 MAKE IT REAL-TIME using SNAPSHOT -----
  // onSnapshot() = listener..
  // Every snapshot contains a document changes object, which will give you a list of every document that's been added, removed, changed, or appears in a different order. 즉, 데이터베이스에 변경이 있을 때마다 'snap'해서 'snapshot'을 준다..
  // 이 방법은 처음 한번만 render되기 때문에 효율적
  useEffect(() => {
    // getTweets();
    dbService.collection('tweets').onSnapshot((snapshot) => {
      const tweetArray = snapshot.docs.map((doc) => ({
        id: doc.id, // firebase gives a unique id
        ...doc.data(), // data() : Retrieves all fields in the document as an Object.
      }));
      setTweets(tweetArray);
    });
  }, []);

  return (
    <div>
      <TweetFactory userObj={userObj} />
      <div>
        {tweets.map((tweet) => (
          <Tweet
            key={tweet.id}
            tweetObj={tweet}
            isOwner={tweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
