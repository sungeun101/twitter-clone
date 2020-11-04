import React, { forwardRef, useState } from 'react';
import { dbService, storageService } from 'fbase';
import './Post.css';
import { Avatar } from '@material-ui/core';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import RepeatIcon from '@material-ui/icons/Repeat';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import PublishIcon from '@material-ui/icons/Publish';

// forwardRef로 감싸는 이유? FlipMove 쓰기 위해..
const Post = forwardRef(({ isOwner, postObj, userObj }, ref) => {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(postObj.text); // to update text(edit)

  const onDeleteClick = async () => {
    const ok = window.confirm('Are you sure you want to delete this tweet?'); //true or false
    if (ok) {
      // collection의 document지우기
      await dbService.doc(`posts/${postObj.id}`).delete();
      // tweetImage 지우기
      if (postObj.tweetImageUrl !== '')
        await storageService.refFromURL(postObj.tweetImageUrl).delete();
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);

  const onSubmitEdit = (event) => {
    event.preventDefault();
    dbService.doc(`posts/${postObj.id}`).update({
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
    <div className="post" ref={ref}>
      <div className="post__avatar">
        <Avatar src={userObj.avatar} />
      </div>
      {editing ? (
        <>
          <div className="post__body">
            <div className="post__header">
              <div className="post__headerText">
                <h3>
                  {userObj.displayName}{' '}
                  <span className="post__headerSpecial">
                    {postObj.verified && (
                      <VerifiedUserIcon className="post__badge" />
                    )}
                  </span>
                </h3>
              </div>
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
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="post__body">
            <div className="post__header">
              <div className="post__headerText">
                <h3>
                  {userObj.displayName}{' '}
                  <span className="post__headerSpecial">
                    {postObj.verified && (
                      <VerifiedUserIcon className="post__badge" />
                    )}
                  </span>
                </h3>
              </div>
              <div className="post__headerDescription">
                <p>{postObj.text}</p>
              </div>

              {isOwner && (
                <>
                  <button onClick={onDeleteClick}>Delete</button>
                  <button onClick={toggleEditing}>Edit</button>
                </>
              )}
            </div>
            {postObj.tweetImageUrl && (
              <img
                src={postObj.tweetImageUrl}
                alt="tweet"
                width="50px"
                height="50px"
              />
            )}

            <div className="post__footer">
              <ChatBubbleOutlineIcon fontSize="small" />
              <RepeatIcon fontSize="small" />
              <FavoriteBorderIcon fontSize="small" />
              <PublishIcon fontSize="small" />
            </div>
          </div>
        </>
      )}
    </div>
  );
});

export default Post;
