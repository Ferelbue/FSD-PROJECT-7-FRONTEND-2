
import { useState, useEffect } from "react";
import './Timeline.css';
import { createNewPost, followUser, getFollowers, getPosts, getUserPosts, getUserProfile, getUsers, updatePost } from "../../services/apiCalls";
import { CustomLike } from "../../common/CustomLike/CustomLike";
import { useDispatch, useSelector } from "react-redux";
import { userData, logout } from "../../app/slices/userSlice";
import { updateCriteria } from "../../app/slices/searchSlice";
import { updateDetail } from "../../app/slices/postSlice";
import { updateFollow } from "../../app/slices/followSlice";
import { useNavigate } from "react-router-dom"
import { CustomInput } from "../../common/CustomInput/CustomInput";
import { searchData } from "../../app/slices/searchSlice";
import { NewPost } from "../../common/NewPost/NewPost";
import { CustomTextArea } from "../../common/CustomTextArea/CustomTextArea";
import { CustomButton } from "../../common/CustomButton/CustomButton";



export const Timeline = () => {
  const [profileData, setProfileData] = useState();
  const [postsData, setPostsData] = useState();
  const [followUserData, setFollowUser] = useState();
  const [error, setError] = useState();
  const [modal, setModal] = useState(false);
  const rdxUser = useSelector(userData);
  const searchRdx = useSelector(searchData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [criteria, setCriteria] = useState("")
  const [nameCriteria, setNameCriteria] = useState("")
  const [usersFetched, setUsersFetched] = useState();
  const [writeModal, setWriteModal] = useState("disabled");
  const [postUpdated, setPost] = useState({
    description: "",
    image: "",
    title: "",
  });

  const inputHandlerPost = (e) => {
    setPost((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

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
    const fetchPosts = async () => {
      try {
        const data = await getPosts(rdxUser.credentials.token);
        if (data === "JWT NOT VALID OR MALFORMED") {
          { dispatch(logout({ credentials: "" }), updateDetail({ detail: "" })) }
          navigate("/login")
        }
        setPostsData(data);
      } catch (error) {
        setError(error);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await getUserProfile(rdxUser.credentials.token);

        setProfileData(data);


      } catch (error) {
        setError(error);
      }
    };

    fetchUserProfile();
  }, [profileData, followUserData]);

  useEffect(() => {
    const searching = setTimeout(() => {
      dispatch(updateCriteria(nameCriteria));
    }, 375);

    return () => clearTimeout(searching);
  }, [criteria]);

  const searchHandler = (e) => {
    setCriteria(e.target.value)
    setNameCriteria(e.target.value.toLowerCase())
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

  const handlePost = async (postId) => {
    try {

      dispatch(updateDetail({ detail: postId }))
      navigate("/detailPost")

    } catch (error) {
      setError(error);
    }
  };

  const handleModal = async () => {
    try {
      setModal(true)
      setWriteModal("")
    } catch (error) {
      setError(error);
    }
  };

  const handleBack = async () => {
    try {
      setModal(false)
      setWriteModal("disable")

    } catch (error) {
      setError(error);
    }
  };
  const manageDetail = async (userRdx) => {
    try {
      console.log(userRdx)
      dispatch(updateFollow({ follow: userRdx }))

      navigate("/followprofile")
    } catch (error) {
      setError(error);
    }
  };

  const handleFollow = async (userId) => {
    try {

      const fetched = await followUser(userId, rdxUser.credentials.token);
       setFollowUser(fetched)
    } catch (error) {
      setError(error);
    }
  };

  const createPost = async () => {
    try {
      const fetched = await createNewPost(rdxUser.credentials.token, postUpdated)
      setPost({
        description: "",
        image: "",
        title: "",
      });
      setModal(false)
      setWriteModal("disable")

    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className='timelineDesign'>
      <div className='timelineLeft'>
        <div className='timelineLeftUp'>
          <div className="titleMyInformation">
            MY INFORMATION
          </div>
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
          <div className="titleMyInformation">
            SEARCH A USER
          </div>
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
                    <div className="userSearched" key={user._id}>
                      <div className="test1">
                        <img className="test2" src={user.image} alt={`${user.firstName}`} />
                      </div>
                      <div className="test3">
                        <p>{user.firstName.toUpperCase()}&nbsp;{user.lastName.toUpperCase()}</p>
                      </div>
                      <div className="test4" onClick={() => handleFollow(user._id)}>
                        <p>FOLLOW USER</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="searchUsers">Users not found</div>
            )}
          </div>
        </div>
      </div>

      <div className={`timelineCenter ${modal === true ? "timelineCenter2" : ""}`} >
        {postsData && postsData?.data?.slice().reverse().map((post, index) => (
          <div key={index} className='timelineCardDesign'>
            {index === 0 ? <div className="titlePostTimeline">TIME-LINE</div> : null}
            <div className="bodyCardTimeline">
              <div className="bodyTimeline" onClick={() => handlePost(post._id)}>
                <img className="imagePost" src={post.image} alt={`${post._id}`} />
                <p>{post.title.toUpperCase()}</p>
                <p>{post.description}</p>
              </div>
              <div className="likesTimeline">
                <CustomLike title={`LIKES: ${post.like.length}`} onClick={() => handleLike(post._id)} />
                <CustomLike title={`COMMENTS: ${post.comments.length}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`timelineRight ${modal === true ? "timelineRight2" : ""}`} >
        <div className="timelineRightBodyUp">
          <div className="timelineRightTitleUp">
            FOLLOWERS
          </div>
          {profileData?.success && profileData?.data?.follower?.length >= 0 ? (
            <div className="searchUsers2">
              {profileData.data.follower.map((user, index) => {
                return (
                  <div className="userSearched1" key={`follower_${index}_${user._id}`}>
                    <div className="test12">
                      <img className="test22" src={user.image} alt={`${user.firstName}`}/>
                    </div>
                    <div className="test32"  onClick={() => manageDetail(user._id)} >
                      <p>{user.firstName.toUpperCase()}&nbsp;{user.lastName.toUpperCase()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="searchUsers">No hay usuarios</div>
          )}
        </div>

        <div className="timelineRightBodyDown">
          <div className="timelineRightTitleUp">
            FOLLOWING
          </div>
          {profileData?.success && profileData?.data?.following?.length >= 0 ? (
            <div className="searchUsers3">
              {profileData.data.following.map((user, index) => {
                return (
                  <div className="userSearched3" key={`follow_${index}_${user._id}`} onClick={() => manageDetail(user._id)}>
                    <div className="test12">
                      <img className="test22" src={user.image} alt={`${user.firstName}`} />
                    </div>
                    <div className="test32">
                      <p>{user.firstName.toUpperCase()}&nbsp;{user.lastName.toUpperCase()}</p>
                    </div>
                    <div className="test4" onClick={() => handleFollow(user._id)}>
                        <p>UNFOLLOW USER</p>
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
      <NewPost
        className={`test1234`}
        src={"../../public/newPost.png"}
        alt={"asd"}
        onClick={() => handleModal()}
      />
      {modal &&
        <div className="modalDesign">
          <div className="modalCardDesign">
            <div className="profileModalTitle">
              NEW POST
            </div>
            <div className="profileModalBody">
              <div className="imageModal">
                <img className="imagePostProfile" src={postUpdated.image} alt={`${1}`} />
              </div>
              <div>

                <CustomInput
                  className={`inputTitlePostDesign`}
                  type={"text"}
                  placeholder={""}
                  name={"image"}
                  disabled={writeModal}
                  value={postUpdated.image}
                  onChangeFunction={(e) => inputHandlerPost(e)}

                />

              </div>
              <div>
                <CustomInput
                  className={`inputTitlePostDesign`}
                  type={"text"}
                  placeholder={""}
                  name={"title"}
                  disabled={writeModal}
                  value={postUpdated.title}
                  onChangeFunction={(e) => inputHandlerPost(e)}

                />

              </div>
              <div>
                <CustomTextArea
                  className={`inputDescriptionPostDesign`}
                  type={"textarea"}
                  placeholder={""}
                  name={"description"}
                  disabled={writeModal}
                  value={postUpdated.description}
                  onChangeFunction={(e) => inputHandlerPost(e)}
                />

                <div className="modalButtons">
                  <CustomButton
                    className={"customButtonDesign"}
                    title={"SEND"}
                    functionEmit={() => createPost()}
                  />
                  <CustomButton
                    className={"customButtonDesign"}
                    title={"BACK"}
                    functionEmit={() => handleBack()}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
};