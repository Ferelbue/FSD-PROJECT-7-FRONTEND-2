
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
    const fetchUserPosts = async () => {
      try {
        console.log(followRdx.follow)
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
    const searching = setTimeout(() => {
      dispatch(updateCriteria(nameCriteria));
    }, 375);

    return () => clearTimeout(searching);
  }, [criteria]);

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
        <div className='timelineLeftUp'>
          <div className="titleMyInformation">
            {`${postsData?.data[0].userId.firstName.toUpperCase()}`} INFORMATION
          </div>
          {postsData && (
            <>
              <div className="timelineProfileUp">
                <div>
                  <img className="prueba" src={postsData?.data[0].userId.image} alt="pers1" />
                </div>
                <div>
                  <p>{postsData?.data[0].userId.firstName} {postsData?.data[0].userId.lastName}</p>
                </div>
              </div>
              <div>
                <p>Seguidores: {postsData.data[0].userId.follower.length}</p>
                <p>Siguiendo: {postsData.data[0].userId.following.length}</p>
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

      <div className={`timelineCenter`} ref={centerRef}>
        {postsData && postsData?.data?.map((post, index) => (
          <div key={post.image} className='timelineCardDesign'>
            {index === 0 ? <div className="titlePostTimeline">{`${postsData?.data[0].userId.firstName.toUpperCase()}`} POSTS</div> : null}
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

      <div className={'profileRight'} >
        <div className="profileRightUp">
          {`${postsData?.data[0].userId.firstName.toUpperCase()}`} PICTURES
        </div>
        <div className="profileRightDown">
          {postsData && postsData?.data?.map((post, index) => (
            <div className="placePictureEven" key={post._id}>
              <img className="pictureEven" src={post.image} alt={`${post._id}`} onClick={() => handlePostClick(index)} />
            </div>
          ))
          }
        </div>
      </div>

      <NewPost
        className={`test1234`}
        src={"../../public/newPost.png"}
        alt={"asd"}
        onClick={() => handleModal()}
      />
    </div>
  );
};