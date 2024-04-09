
import { useState, useEffect } from "react";
import './DetailPost.css';
import { getFollowers, getPosts, getUserPosts, getUserProfile, getUsers, updatePost } from "../../services/apiCalls";
import { CustomLike } from "../../common/CustomLike/CustomLike";
import { useDispatch, useSelector } from "react-redux";
import { userData } from "../../app/slices/userSlice";
import { updateCriteria } from "../../app/slices/searchSlice";
import { updateDetail } from "../../app/slices/postSlice";
import { useNavigate } from "react-router-dom"
import { CustomInput } from "../../common/CustomInput/CustomInput";
import { searchData } from "../../app/slices/searchSlice";
import { detailData } from "../../app/slices/postSlice";


export const DetailPost = () => {
  const [profileData, setProfileData] = useState();
  const [followersData, setFollowersData] = useState();
  const [postsData, setPostsData] = useState();
  const [error, setError] = useState();

  const rdxUser = useSelector(userData);
  const rdxDetail = useSelector(detailData);
  const searchRdx = useSelector(searchData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [criteria, setCriteria] = useState("")
  const [usersFetched, setUsersFetched] = useState();


  useEffect(() => {
    const bringUsers = async () => {
      if (searchRdx.criteria !== "") {
        try {
          const usersData = await getUsers(rdxUser.credentials.token, searchRdx.criteria);
          setUsersFetched(usersData);
        } catch (error) {
          setError(error);
        }
      } else (
        setUsersFetched("")
      )
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

  useEffect(() => {
    const fetchFollowers = async () => {
      try {

        const data = await getFollowers(rdxUser.credentials.token);
        setFollowersData(data);
        console.log("este", data)
      } catch (error) {
        setError(error);
      }
    };

    fetchFollowers();
  }, []);

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

  useEffect(() => {
    const searching = setTimeout(() => {
      dispatch(updateCriteria(criteria));
    }, 375);

    return () => clearTimeout(searching);
  }, [criteria]);

  const searchHandler = (e) => {
    setCriteria(e.target.value)
  }

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
          <div>
            {usersFetched?.success && usersFetched?.data?.length > 0 ? (
              <div className="searchUsers">
                {usersFetched.data.slice(0, 4).map((user) => {
                  return (
                    <div className="userSearched" key={user._id} onClick={() => manageDetail(user)}>
                      <div className="test1">
                        <img className="test2" src={user.image} alt={`${user.firstName}`} />
                      </div>
                      <div className="test3">
                        <p>{user.firstName.toUpperCase()}&nbsp;{user.lastName.toUpperCase()}</p>
                      </div>
                      <div className="test4">
                        <p>FRIEND REQUEST</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="searchUsers">No hay usuarios</div>
            )}
          </div>
        </div>
      </div>

      <div className='timelineCenter'>
        <div className='timelineCardDesign2'>
          <div className="bodyTimeline">
            {
              postsData?.data?.map((post) => {
                if (post._id === rdxDetail.detail) {
                  return (
                    <div key={post._id}>
                      <div className="bodyTimeline">
                        <img className="imagePost" src={post.image} alt={"fgh"} />
                        <p>{post.title}</p>
                        <p>{post.description}</p>
                      </div>
                      <div className="likesDetail">
                        <CustomLike title={`LIKES: ${post.like.length}`} onClick={() => handleLike(post._id)} />
                        <CustomLike title={`COMMENTARYS: ${post.comments.length}`} />
                        {post.comments.map((commentary) => (
                          <div key={commentary._id}>
                            <p>{commentary.commentatorName}</p>
                            <p>{commentary.commentary}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })
            }

          </div>
        </div>
      </div>

      <div className='timelineRight2'>
        <div className="timelineRightUp">
          MY FOLLOWERS
        </div>
        <div className="timelineRightDown">
          {followersData?.success && followersData?.data?.length > 0 ? (
            <div className="searchUsers2">
              {followersData.data.map((user) => {
                return (
                  <div className="userSearched2" key={user._id} onClick={() => manageDetail(user)}>
                    <div className="test12">
                      <img className="test22" src={user.image} alt={`${user.firstName}`} />
                    </div>
                    <div className="test32">
                      <p>{user.firstName.toUpperCase()}&nbsp;{user.lastName.toUpperCase()}</p>
                    </div>
                    <div className="test4">
                      <p>FRIEND REQUEST</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="searchUsers">No hay usuarios</div>
          )}
        </div>
      </div>
    </div>
  );
};