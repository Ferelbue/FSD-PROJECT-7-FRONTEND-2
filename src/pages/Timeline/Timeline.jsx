
import { useState, useEffect } from "react";
import './Timeline.css';
import { createNewPost, followUser, getFollowers, getPosts, getUserPosts, getUserProfile, getUsers, updatePost } from "../../services/apiCalls";
import { CustomLike } from "../../common/CustomLike/CustomLike";
import { useDispatch, useSelector } from "react-redux";
import { userData, logout } from "../../app/slices/userSlice";
import { updateCriteria } from "../../app/slices/searchSlice";
import { updateDetail } from "../../app/slices/postSlice";
import { updateFollow } from "../../app/slices/followSlice";
import { updateName } from "../../app/slices/nameSlice";
import { useNavigate } from "react-router-dom"
import { CustomInput } from "../../common/CustomInput/CustomInput";
import { searchData } from "../../app/slices/searchSlice";
import { NewPost } from "../../common/NewPost/NewPost";
import { CustomTextArea } from "../../common/CustomTextArea/CustomTextArea";
import { CustomButton } from "../../common/CustomButton/CustomButton";
import Spinner from 'react-bootstrap/Spinner';
import dayjs from "dayjs";
import like from "../../../public/like.png";
import comment from "../../../public/comment.png";
import newP from "../../../public/newPost.png";

export const Timeline = () => {
  const [profileData, setProfileData] = useState();
  const [postsData, setPostsData] = useState();
  const [postsUpdatedData, setPostsUpdatedData] = useState();
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
    if (rdxUser.credentials === "") {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    const bringUsers = async () => {
      if (searchRdx.criteria !== "") {
        try {
          const usersData = await getUsers(rdxUser.credentials.token, searchRdx.criteria, "", "", "");
          // if (data === "JWT NOT VALID OR MALFORMED") {
          //   { dispatch(logout({ credentials: "" }), updateDetail({ detail: "" })) }
          //   navigate("/")
          // }
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
      dispatch(logout({ credentials: "" }));
      dispatch(updateDetail({ detail: "" }));
      dispatch(updateFollow({ follow: "" }));
      dispatch(updateName({ name: "" }));
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts(rdxUser.credentials.token, "", "", "");
        if (data === "JWT NOT VALID OR MALFORMED") {
          { dispatch(logout({ credentials: "" }), updateDetail({ detail: "" })) }
          navigate("/")
        }
        setTimeout(() => {

          setPostsData(data);
        }, 1000);

      } catch (error) {
        setError(error);
      }
    };

    fetchPosts();
  }, [postUpdated, postsUpdatedData]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await getUserProfile(rdxUser.credentials.token);

        if (data === "JWT NOT VALID OR MALFORMED") {
          { dispatch(logout({ credentials: "" }), updateDetail({ detail: "" })) }
          navigate("/")
        }
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

      const fetched = await updatePost(postId, rdxUser.credentials.token);
      console.log(fetched, "asdasdasdasdsadsa")

      const res = await getPosts(rdxUser.credentials.token, "", "", "");

      setPostsUpdatedData(res);
      setPostsData(res);

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
            {postsData && postsData?.data?.slice().reverse().map((post, index) => (
              <div key={index} className='timelineCardDesign'>
                {index === 0 ? <div className="titlePostTimeline">TIME-LINE</div> : null}
                <div className="bodyCardTimeline">

                  <div className="bodyDateTimeline" onClick={() => handlePost(post._id)}>
                    <div className="bodyDate1Timeline">

                    </div>
                    <div className="bodyDate3Timeline">
                      {post.userId.firstName.toUpperCase()}&nbsp;{post.userId.lastName.toUpperCase()}
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
                        {post.like.length}&nbsp;&nbsp;&nbsp;&nbsp;<img className="image2Post" src={like} alt={`${post._id}`} onClick={() => handleLike(post._id)} />
                      </div>
                      <div className="bodyLike4Timeline">
                        <img className="image2Post" src={comment} alt={`${post._id}`} />&nbsp;&nbsp;&nbsp;&nbsp;{post.comments.length}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))}
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
                      <div className="userSearched1" key={`follower_${index}_${user._id}`}>
                        <div className="test12">
                          <img className="test22" src={user.image} alt={`${user.firstName}`} />
                        </div>
                        <div className="test321">
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
        src={newP}
        alt={"asd"}
        onClick={() => handleModal()}
      />
      {modal &&
        <div className="modalDesign">
          <div className="modalCardDesign">
            <div className="profileModalTitle5">
              <div className="profileModalTitle1">

              </div>
              <div className="profileModalTitle2">
                NEW POST
              </div>
              <div className="profileModalTitle3">
                <CustomButton
                  className={"customButtonXDesign2"}
                  title={"X"}
                  functionEmit={() => handleBack()}
                />
              </div>
            </div>

            <div className="profileModalBody">

              <div className="newPostTitleTitle">
                <div className="newPostTitle1Title">
                  TITLE:
                </div >
                <div className="newPostTitle2Title">
                  <CustomInput
                    className={`inputTitlePostDesign`}
                    type={"text"}
                    placeholder={"Introduce a TITLE"}
                    name={"title"}
                    disabled={writeModal}
                    value={postUpdated.title}
                    onChangeFunction={(e) => inputHandlerPost(e)}

                  />
                </div>
              </div>

              <div className="newPostImageTitle">
                <div className="newPostImage1Title">
                  IMAGE:
                </div >
                <div className="newPostImage2Title">
                  <div className="newPostImage4Title">
                    <img className="imagePostProfile3" src={postUpdated.image} alt={`Paste a URL -->`} />
                  </div>

                  <div className="newPostImage3Title">
                    URL:&nbsp;
                    <CustomInput
                      className={`inputTitlePostDesign`}
                      type={"text"}
                      placeholder={"Introduce a URL from a image"}
                      name={"image"}
                      disabled={writeModal}
                      value={postUpdated.image}
                      onChangeFunction={(e) => inputHandlerPost(e)}

                    />
                  </div>

                </div>
              </div>

              <div className="newPostTextTitle">
                <div className="newPostText1Title">
                  TEXT:
                </div >
                <div className="newPostText2Title">
                  <CustomTextArea
                    className={`inputDescriptionPostDesign`}
                    type={"textarea"}
                    placeholder={"Introduce a TEXT"}
                    name={"description"}
                    disabled={writeModal}
                    value={postUpdated.description}
                    onChangeFunction={(e) => inputHandlerPost(e)}
                  />
                </div>
              </div>

              <div className="newPostButonTitle">
                <CustomButton
                  className={"customButtonDesign3"}
                  title={"SEND"}
                  functionEmit={() => createPost()}
                />
              </div>
            </div>
          </div>
        </div>
      }
    </div >
  );
};