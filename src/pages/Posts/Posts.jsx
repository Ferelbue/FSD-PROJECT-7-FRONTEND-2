import React, { useState, useEffect } from "react";
import './Posts.css';
import { deletePost, getUserPosts, updatePost } from "../../services/apiCalls";
import { CustomLike } from "../../common/CustomLike/CustomLike";
import { useSelector } from "react-redux";
import { userData } from "../../app/slices/userSlice";
import { useNavigate } from "react-router-dom";

export const Posts = () => {

  const [postsData, setPostsData] = useState();
  const [error, setError] = useState();
  const [flag, setFlag] = useState(false);
  const navigate = useNavigate();
  const rdxUser = useSelector(userData);

  useEffect(() => {
    if (rdxUser.credentials === "") {
      navigate("/login");
    }

  }, [rdxUser]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const data = await getUserPosts(rdxUser.credentials.token);
        setPostsData(data);
      } catch (error) {
        setError(error);
      }
    };

    fetchUserPosts();
  }, [rdxUser.credentials.token]);

  const handleLike = async (index, userId) => {
    let positionRemove = 0;
    for (let i = 0; i < postsData.data[index].like.length; i++) {

      if ((postsData.data[index].like[i]) === userId) {
        setFlag(true);
        i = positionRemove;
        break;
      }
    }
    if (flag === true) {
      postsData.data[index].like.splice(positionRemove, 1);
      setFlag(false)
    } else {
      (postsData.data[index].like).push(userId)
    }

    return postsData.data[index].like;
  };

  const handleDelete = async (postId) => {
    try {

      await deletePost(postId, rdxUser.credentials.token);

      const updatedPostsData = await getUserPosts(rdxUser.credentials.token);
      setPostsData(updatedPostsData);

    } catch (error) {
      setError(error);
    }
  };

  return (
    <>
      <div className='postsDesign'>
        {postsData && postsData.data?.map((post, index) => (
          <div key={index} className='postsCardDesign'>
            <div className="body">
              <p>{post.title.toUpperCase()}</p>
              <p>{post.description}</p>
            </div>
            <div className="likes">
              <CustomLike title={`LIKES: ${post.like.length}`} onClick={() => handleLike(index, rdxUser.credentials.user.userId)} />
              <CustomLike title={`COMMENTS: ${post.comments.length}`} />
              <CustomLike title={`DELETE`} onClick={() => handleDelete(post._id)} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};