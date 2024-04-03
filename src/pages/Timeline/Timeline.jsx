
import { useState, useEffect } from "react";
import './Timeline.css';
import { getPosts, getUserPosts, updatePost } from "../../services/apiCalls";
import { CustomLike } from "../../common/CustomLike/CustomLike";
import { useSelector } from "react-redux";
import { userData } from "../../app/slices/userSlice";

export const Timeline = () => {

  const [postsData, setPostsData] = useState();
  const [error, setError] = useState();

  const rdxUser = useSelector(userData);
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const data = await getPosts(rdxUser.credentials.token);
        setPostsData(data);
      } catch (error) {
        setError(error);
      }
    };
    
    fetchUserPosts();
  }, []);
  
  const handleLike = async (postId) => {
    try {

      await updatePost(postId, rdxUser.credentials.token);

      const updatedPostsData = await getPosts(rdxUser.credentials.token);
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
              </div>
          </div>
        ))}
      </div>
    </>
  );
};