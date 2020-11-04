import React, { useState } from 'react';
import { dbService, storageService } from 'fbase';

// 수정, 삭제
const Tweet = ({ tweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false); // edit하고 있는 중인지 아닌지 boolean
  const [newTweet, setNewTweet] = useState(tweetObj.text); // to update text(edit)

  const onDeleteClick = async () => {
    const ok = window.confirm('Are you sure you want to delete this tweet?'); //true or false
    if (ok) {
      // collection의 document지우기
      await dbService.doc(`tweets/${tweetObj.id}`).delete();
      // 사진(attachment) 지우기
      if (tweetObj.attachmentUrl !== '')
        await storageService.refFromURL(tweetObj.attachmentUrl).delete();
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);

  const onSubmitEdit = (event) => {
    event.preventDefault();
    // doc(documentPath: string)
    // A slash-separated path to a document.
    // Return a DocumentReference instance that refers to the document at the specified path.
    dbService.doc(`tweets/${tweetObj.id}`).update({
      text: newTweet,
    });
    setEditing(false);
  };

  const onChangeEdit = (event) => {
    const {
      target: { value },
    } = event;
    setNewTweet(value);
  };

  return (
    // editing=true이면 edit, false면 delete
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmitEdit}>
            <input
              onChange={onChangeEdit}
              type="text"
              value={newTweet}
              required
            />
            <input type="submit" value="Update" />
            <button onClick={toggleEditing}>Cancel</button>
          </form>
        </>
      ) : (
        <>
          <h4>{tweetObj.text}</h4>
          {tweetObj.attachmentUrl && (
            <img
              src={tweetObj.attachmentUrl}
              width="50px"
              height="50px"
              alt="tweet"
            />
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete</button>
              <button onClick={toggleEditing}>Edit</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Tweet;
