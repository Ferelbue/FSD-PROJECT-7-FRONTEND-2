
import { useState, useEffect } from "react";
import './Timeline.css';
import { getPosts, getUserPosts, getUserProfile, getUsers, updatePost } from "../../services/apiCalls";
import { CustomLike } from "../../common/CustomLike/CustomLike";
import { useDispatch, useSelector } from "react-redux";
import { userData } from "../../app/slices/userSlice";
import { updateCriteria } from "../../app/slices/searchSlice";
import { useNavigate } from "react-router-dom"
import { CustomInput } from "../../common/CustomInput/CustomInput";
import { searchData } from "../../app/slices/searchSlice";


export const Timeline = () => {
  const [profileData, setProfileData] = useState();
  const [postsData, setPostsData] = useState();
  const [error, setError] = useState();

  const rdxUser = useSelector(userData);
  const searchRdx = useSelector(searchData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [criteria, setCriteria] = useState("")

  useEffect(() => {

    const bringUsers = async () => {
      let fetched;
      if (searchRdx.criteria !== "") {
        fetched = await getUsers(rdxUser.credentials.token,searchRdx.criteria);
      }
      console.log(fetched)
    };

    bringUsers();
  }, [searchRdx.criteria]);



  useEffect(() => {
    if (rdxUser.credentials === "") {
      navigate("/login");
    }

  }, [rdxUser]);

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

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        console.log(rdxUser.credentials.token);
        const data = await getUserProfile(rdxUser.credentials.token);
        setProfileData(data);

      } catch (error) {
        setError(error);
      }
    };

    fetchUserProfile();
  }, []);

  const searchHandler = (e) => {
    setCriteria(e.target.value)
  }

  useEffect(() => {
    const searching = setTimeout(() => {
      dispatch(updateCriteria(criteria));
    }, 375);

    return () => clearTimeout(searching);
  }, [criteria]);

  return (
    <div className='timelineDesign'>

      <div className='timelineLeft'>

        <div className='timelineLeftUp'>
          {profileData && (
            <>
              <div className="timelineProfileUp">
                <div>
                  <img className="prueba" src={profileData.data.image} alt="pers1" />
                </div>
                <div>
                  <p>{profileData.data.firstName.toUpperCase()} {profileData.data.lastName.toUpperCase()}</p>
                  <p>{profileData.data.email}</p>
                </div>
              </div>

              <div>

                <p>Seguidores: {profileData.data.follower.length}</p>
                <p>Siguiendo: {profileData.data.following.length}</p>
              </div>


            </>
          )}
        </div>
        <div className='timelineLeftDown'>
          <div className="inputHeader">
            <CustomInput
              className={`inputSearch`}
              type="text"
              placeholder="search a user...."
              name="user"
              value={criteria || ""}
              onChangeFunction={(e) => searchHandler(e)}
            />
          </div>
        </div>

      </div>


      <div className='timelineCenter'>
        {postsData && postsData.data.map((post, index) => (
          <div key={index} className='timelineCardDesign'>
            <div className="bodyTimeline">
              IMAGEN
              <p>{post.title.toUpperCase()}</p>
              <p>{post.description}</p>
            </div>
            <div className="likesTimeline">
              <CustomLike title={`LIKES: ${post.like.length}`} onClick={() => handleLike(post._id)} />
              <CustomLike title={`COMMENTS: ${post.comments.length}`} />
            </div>
          </div>
        ))}
      </div>

      <div className='timelineRight'>

      </div>
    </div>
  );
};