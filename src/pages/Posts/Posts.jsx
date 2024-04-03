import React, { useState, useEffect } from "react";
import './Posts.css';
import { deletePost, getUserPosts, updatePost } from "../../services/apiCalls";
import { CustomLike } from "../../common/CustomLike/CustomLike";
import { useSelector } from "react-redux";
import { userData } from "../../app/slices/userSlice";

export const Posts = () => {

  const [postsData, setPostsData] = useState();
  const [error, setError] = useState();

  const rdxUser = useSelector(userData);

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

  const handleLike = async (postId) => {
    try {
      // Realizar una solicitud PUT a la base de datos para actualizar el post con el like
      await updatePost(postId, rdxUser.credentials.token);

      // Actualizar los datos de los posts después de la actualización exitosa
      const updatedPostsData = await getUserPosts(rdxUser.credentials.token);
      setPostsData(updatedPostsData);
    } catch (error) {
      setError(error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      // Realizar una solicitud PUT a la base de datos para actualizar el post con el like
      await deletePost(postId, rdxUser.credentials.token);

      // Actualizar los datos de los posts después de la actualización exitosa
      const updatedPostsData = await getUserPosts(rdxUser.credentials.token);
      setPostsData(updatedPostsData);
      
    } catch (error) {
      setError(error);
    }
  };

  return (
    <>
      <div className='postsDesign'>
        {postsData && postsData.data.map((post, index) => (
          <div key={index} className='postsCardDesign'>
            <div className="body">
              <p>{post.title.toUpperCase()}</p>
              <p>{post.description}</p>
            </div>
            <div className="likes">
              <CustomLike title={`LIKES: ${post.like.length}`} onClick={() => handleLike(post._id)} />
              <CustomLike title={`COMMENTS: ${post.comments.length}`} />
              <CustomLike title={`DELETE`} onClick={() => handleDelete(post._id)} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};