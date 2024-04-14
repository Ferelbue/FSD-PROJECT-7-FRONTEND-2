
import { useState, useEffect } from "react";
import './DetailPost.css';
import { createNewPost, followUser, getFollowers, getPosts, getUserPosts, getUserProfile, getUsers, updatePost } from "../../services/apiCalls";
import { CustomLike } from "../../common/CustomLike/CustomLike";
import { useDispatch, useSelector } from "react-redux";
import { userData } from "../../app/slices/userSlice";
import { updateCriteria } from "../../app/slices/searchSlice";
import { useNavigate } from "react-router-dom"
import { CustomInput } from "../../common/CustomInput/CustomInput";
import { searchData } from "../../app/slices/searchSlice";
import { detailData } from "../../app/slices/postSlice";
import { NewPost } from "../../common/NewPost/NewPost";
import { CustomTextArea } from "../../common/CustomTextArea/CustomTextArea";
import { CustomButton } from "../../common/CustomButton/CustomButton";
import { updateFollow } from "../../app/slices/followSlice";
import Spinner from 'react-bootstrap/Spinner';
import dayjs from "dayjs";

export const DetailPost = () => {
  const [profileData, setProfileData] = useState();
  const [followersData, setFollowersData] = useState();
  const [postsData, setPostsData] = useState();
  const [error, setError] = useState();
  const [modal, setModal] = useState(false);
  const rdxUser = useSelector(userData);
  const rdxDetail = useSelector(detailData);
  const searchRdx = useSelector(searchData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [criteria, setCriteria] = useState("")
  const [followUserData, setFollowUser] = useState();
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
          const usersData = await getUsers(rdxUser.credentials.token, searchRdx.criteria,"","","");
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
        const data = await getPosts(rdxUser.credentials.token, "", "", "");
        setPostsData(data);
        console.log(data, "asdasdsadsadsadasd")
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
  }, [followUserData]);

  useEffect(() => {
    const searching = setTimeout(() => {
      dispatch(updateCriteria(criteria));
    }, 375);

    return () => clearTimeout(searching);
  }, [criteria]);

  const searchHandler = (e) => {
    setCriteria(e.target.value)
  }

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
  const handleLike = async (postId) => {
    try {

      await updatePost(postId, rdxUser.credentials.token);

      const updatedPostsData = await getPosts(rdxUser.credentials.token);
      setPostsData(updatedPostsData);
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
      navigate("/profile")

    } catch (error) {
      setError(error);
    }
  };

  const manageDetail = async (userRdx) => {
    try {
      console.log(userRdx, "esto")
      dispatch(updateFollow({ follow: userRdx }))

      navigate("/followprofile")
    } catch (error) {
      setError(error);
    }
  };

  const handleFollow = async (userId) => {
    try {
      console.log(userId)
      const fetched = await followUser(userId, rdxUser.credentials.token);
      setFollowUser(fetched)
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className='detailPostDesign'>
      <div className='timelineLeft'>
        <div className='timelineLeftUp1'>
          <div className="titleMyInformation">
            MY INFORMATION
          </div>

          {!postsData ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            <>
              {profileData && (
                <>
                  <div className="timelineProfileUp">
                    <div>
                      <img className="prueba" src={profileData?.data?.image} alt="pers1" />
                    </div>
                  </div>
                  <div className="timelineProfileCenter">
                    <div>
                      <div>
                        {profileData?.data?.firstName.toUpperCase()} {profileData?.data?.lastName.toUpperCase()}
                      </div>
                      {profileData?.data?.email}
                    </div>
                  </div>
                  <div className="timelineProfileDown2">
                    <div className="timelineProfileDown3">
                      <div className="followersDiv">
                        FOLLOWERS: {profileData?.data?.follower.length}
                      </div>
                      <div className="followingsDiv">
                        FOLLLOWING: {profileData?.data?.following.length}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <div className='timelineLeftDown2'>
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
                    <div className="userSearched4" key={user._id}>
                      <div className="test1">
                        <img className="test2" src={user.image} alt={`${user.firstName}`} />
                      </div>
                      <div className="test3">
                        {user.firstName.toUpperCase()}&nbsp;{user.lastName.toUpperCase()}
                      </div>
                      <div className="test4" onClick={() => handleFollow(user._id)}>
                        FOLLOW USER
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
        {!postsData ? (
          <div className='timelineTest'>

            <p>TIME-LINE</p>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <div>
            <div className="timelineCardDesign3">
              <div className="titlePostTimeline4">POST-DETAIL</div>
              {
                postsData?.data?.map((post) => {
                  if (post._id === rdxDetail.detail) {
                    return (
                      <div key={post._id}>
                        <div className="bodyCardTimeline4">

                          <div className="bodyDateTimeline" onClick={() => handlePost(post._id)}>
                            <div className="bodyDate1Timeline">

                            </div>
                            <div className="bodyDate2Timeline">

                              {dayjs(post.createdAt).format('ddd DD-MM-YYYY')}
                            </div>
                          </div>

                          <div className="bodyTitleTimeline" onClick={() => handlePost(post._id)}>
                            {post.title.toUpperCase()}
                          </div>

                          <div className="bodyImageTimeline" onClick={() => handlePost(post._id)}>
                            <img className="image1Post" src={post.image} alt={`${post._id}`} />
                          </div>

                          <div className="bodyDescriptionTimeline" onClick={() => handlePost(post._id)}>
                            {post.description}
                          </div>

                          <div className="bodyLikeTimeline">
                            <div className="bodyLike1Timeline">

                            </div>
                            <div className="bodyLike2Timeline">
                              <div className="bodyLike3Timeline">
                                {post.like.length}&nbsp;&nbsp;&nbsp;&nbsp;<img className="image2Post" src={"../../public/like.png"} alt={`${post._id}`} onClick={() => handleLike(post._id)} />
                              </div>
                              <div className="bodyLike4Timeline">
                                <img className="image2Post" src={"../../public/comment.png"} alt={`${post._id}`} />&nbsp;&nbsp;&nbsp;&nbsp;{post.comments.length}
                              </div>
                            </div>
                          </div>
                          <div className="likesDetail">
                            {post.comments.map((comment, index) => {
                              return (
                                <>
                                <div className="titleCommentarys"> COMMENTARYS:</div>
                                  <div className="commentPost" key={`${comment._id}_${index}`}>
                                    <div>
                                      {comment?.commentatorId?.firstName.toUpperCase()}
                                      </div>
                                      <div className="textComment">
                                      {comment?.commentary}
                                    </div>
                                  </div>
                                  </>
                              )
                            })
                            }
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })
              }
            </div>
          </div>
        )}
      </div>

      <div className={`timelineRight ${modal === true ? "timelineRight2" : ""}`} >
        <div className="timelineRightBodyUp">
          <div className="timelineRightTitleUp">
            FOLLOWERS
          </div>
          {!postsData ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            <>
              {profileData?.success && profileData?.data?.follower?.length >= 0 ? (
                <div className="searchUsers2">
                  {profileData.data.follower.map((user, index) => {
                    return (
                      <div className="userSearched1" key={`${index}_${user._id}`}>
                        <div className="test12">
                          <img className="test22" src={user.image} alt={`${user.firstName}`} />
                        </div>
                        <div className="test321" >
                          {user.firstName.toUpperCase()}&nbsp;{user.lastName.toUpperCase()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="searchUsers">No hay usuarios</div>
              )}
            </>
          )}
        </div>

        <div className="timelineRightBodyDown">
          <div className="timelineRightTitleUp">
            FOLLOWING
          </div>
          {!postsData ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            <>
              {profileData?.success && profileData?.data?.following?.length >= 0 ? (
                <div className="searchUsers3">
                  {profileData.data.following.map((user, index) => {
                    return (
                      <div className="userSearched3" key={`follow_${index}_${user._id}`}>
                        <div className="test12">
                          <img className="test22" src={user.image} alt={`${user.firstName}`} />
                        </div>
                        <div className="test32" onClick={() => manageDetail(user._id)}>
                          {user.firstName.toUpperCase()}&nbsp;{user.lastName.toUpperCase()}
                        </div>
                        <div className="test4" onClick={() => handleFollow(user._id)}>
                          UNFOLLOW USER
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="searchUsers">No hay usuarios</div>
              )}
            </>
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