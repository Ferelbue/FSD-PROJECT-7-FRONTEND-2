
import React, { useState, useEffect } from "react";
import './FollowProfile.css';
import { deletePost, getFollowers, getUserPosts, getUserProfile, updateUserPosts, updateProfile, createNewPost, getUserProfileById, getUserPostById, getUsers } from "../../services/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import { userData, logout } from "../../app/slices/userSlice";
import { searchData, updateCriteria } from "../../app/slices/searchSlice";
import { useNavigate } from "react-router-dom"
import { validame } from "../../utils/functions";
import { CustomInput } from "../../common/CustomInput/CustomInput";
import { CustomButton } from "../../common/CustomButton/CustomButton";
import { updateDetail } from "../../app/slices/postSlice";
import { CustomLike } from "../../common/CustomLike/CustomLike";
import { CustomTextArea } from "../../common/CustomTextArea/CustomTextArea";
import { NewPost } from "../../common/NewPost/NewPost";
import { followData } from "../../app/slices/followSlice";
import { useRef } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import dayjs from "dayjs";
import like from "../../../public/like.png";
import comment from "../../../public/comment.png";

export const FollowProfile = () => {

  const [followersData, setFollowersData] = useState();
  const [postsData, setPostsData] = useState();
  const [error, setError] = useState();
  const [modal, setModal] = useState(false);
  const rdxUser = useSelector(userData);
  const searchRdx = useSelector(searchData);
  const followRdx = useSelector(followData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loadedData, setLoadedData] = useState(false);
  const [criteria, setCriteria] = useState("")
  const [usersFetched, setUsersFetched] = useState();
  const [write, setWrite] = useState("disabled");
  const [writePost, setWritePost] = useState("disabled");
  const [writeModal, setWriteModal] = useState("disabled");
  const [password, setPassword] = useState();
  const [editIndex, setEditIndex] = useState(-1);
  const [nameCriteria, setNameCriteria] = useState("")
  const centerRef = useRef(null);
  
  useEffect(() => {
    if (rdxUser.credentials === "") {
      navigate("/login");
    }

  }, [rdxUser]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {

        const data = await getUserPostById(rdxUser.credentials.token, followRdx.follow);
        setPostsData(data);
      } catch (error) {
        setError(error);
      }
    };

    if (!postsData) {

      fetchUserPosts();
    }

  }, [postsData]);

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
    const searching = setTimeout(() => {
      dispatch(updateCriteria(nameCriteria));
    }, 375);

    return () => clearTimeout(searching);
  }, [criteria]);

  const handlePost = async (postId) => {
    try {
      dispatch(updateDetail({ detail: postId }))
      navigate("/detailPost")

    } catch (error) {
      setError(error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const fetched = await updatePost(postId, rdxUser.credentials.token);
      const usersData = await getUsers(rdxUser.credentials.token, searchRdx.criteria,"","","");
      setUsersFetched(usersData);

    } catch (error) {
      setError(error);
    }
  };

  const searchHandler = (e) => {
    setCriteria(e.target.value)
    setNameCriteria(e.target.value.toLowerCase())
  }

  const handlePostClick = (index, ) => {
    centerRef.current.children[index].scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className={`profileDesign`} >
      <div className='timelineLeft'>
        <div className='timelineLeftUp1'>
          <div className="titleMyInformation">
            {`${postsData?.data[0]?.userId?.firstName.toUpperCase()}`} INFORMATION
          </div>

          {!postsData?.data[0] ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            <>
              {postsData?.data[0] && (
                <>
                  <div className="timelineProfileUp">
                    <div>
                      <img className="prueba" src={postsData?.data[0].userId.image} alt="pers1" />
                    </div>
                  </div>
                  <div className="timelineProfileCenter">
                    <div>
                      <div>
                        {postsData?.data[0].userId.firstName.toUpperCase()} {postsData?.data[0].userId.lastName.toUpperCase()}
                      </div>
                      {postsData?.data[0].email}
                    </div>
                  </div>
                  <div className="timelineProfileDown2">
                    <div className="timelineProfileDown3">
                      <div className="followersDiv">
                        FOLLOWERS: {postsData.data[0].userId.follower.length}
                      </div>
                      <div className="followingsDiv">
                        FOLLLOWING: {postsData.data[0].userId.following.length}
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
                {usersFetched.data.slice(0, 4).map((user,index) => {
                  return (
                    <div className="userSearched4" key={`${user._id}_${index}`}>
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
          <div ref={centerRef}>
            {postsData && postsData?.data?.slice().reverse().map((post, index) => (
              <div key={`${index}_${post._id}`} className='timelineCardDesign'>
                {index === 0 ? <div className="titlePostTimeline">{`${postsData?.data[0].userId.firstName.toUpperCase()}`}&nbsp;TIME-LINE</div> : null}
                <div className="bodyCardTimeline">

                  <div className="bodyDateTimeline">
                    <div className="bodyDate1Timeline">

                    </div>
                    <div className="bodyDate7Timeline">

                      {dayjs(post.createdAt).format('ddd DD-MM-YYYY')}
                    </div>
                  </div>

                  <div className="bodyTitleTimeline">
                    {post.title.toUpperCase()}
                  </div>

                  <div className="bodyImageTimeline">
                    <img className="image1Post" src={post.image} alt={`${post._id}`} onClick={() => handlePost(post._id)} />
                  </div>

                  <div className="bodyDescriptionTimeline">
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
                        <img className="image2Post" src={comment} alt={`${post._id}_${index}`} />&nbsp;&nbsp;&nbsp;&nbsp;{post.comments.length}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={`profileRight12 ${modal === true ? "profileRight22" : ""}`} >
        <div className="profileRightUp">
          {`${postsData?.data[0].userId.firstName.toUpperCase()}`}&nbsp;PICTURES
        </div>
        <div className="profileRightDown">
          {postsData && postsData?.data?.slice().reverse().map((post, index) => (
            <div className="imgUsr" key={`${post._id}_${index}`}>
              <img className="imagesUser" src={post.image} alt={`${post._id}`} onClick={() => handlePostClick(index)} />
            </div>
          ))
          }
        </div>
      </div>
    </div>
  );
};