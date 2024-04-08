
import React, { useState, useEffect } from "react";
import './Profile.css';
import { deletePost, getFollowers, getUserPosts, getUserProfile, updatePost, updateProfile } from "../../services/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import { userData } from "../../app/slices/userSlice";
import { searchData, updateCriteria } from "../../app/slices/searchSlice";
import { useNavigate } from "react-router-dom"
import { validame } from "../../utils/functions";
import { CustomInput } from "../../common/CustomInput/CustomInput";
import { CustomButton } from "../../common/CustomButton/CustomButton";
import { updateDetail } from "../../app/slices/postSlice";
import { CustomLike } from "../../common/CustomLike/CustomLike";

export const Profile = () => {

  const [followersData, setFollowersData] = useState();
  const [postsData, setPostsData] = useState();
  const [error, setError] = useState();
  const rdxUser = useSelector(userData);
  const searchRdx = useSelector(searchData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loadedData, setLoadedData] = useState(false);
  const [criteria, setCriteria] = useState("")
  const [usersFetched, setUsersFetched] = useState();
  const [write, setWrite] = useState("disabled");
  const [writePost, setWritePost] = useState("disabled");
  const [password, setPassword] = useState();
  const [editIndex, setEditIndex] = useState(-1);
  const [user, setUser] = useState({
    email: "",
    firstName: "",
    image: "",
    lastName: "",
  });

  const [userError, setUserError] = useState({
    firstNameError: "",
    lastNameError: "",
    imageError: "",
    emailError: "",
  });

  const [postUpdated, setPost] = useState({
    description: "",
    image: "",
    title: "",

  });

  const inputHandler = (e) => {
    setUser((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const inputHandlerPost = (e) => {
    setPost((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const checkError = (e) => {
    const error = validame(e.target.name, e.target.value);

    setUserError((prevState) => ({
      ...prevState,
      [e.target.name + "Error"]: error,

    }));
  };


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const fetched = await getUserProfile(rdxUser.credentials.token);
        setTimeout(() => {
          setLoadedData(true);
        }, 1000);
        setUser({
          email: fetched.data.email,
          firstName: fetched.data.firstName,
          image: fetched.data.image,
          lastName: fetched.data.lastName,
        });
      } catch (error) {
        console.log(error);
      }
    };

    if (!loadedData) {
      fetchUserProfile();
    }
  }, [user]);

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
  }, []);

  useEffect(() => {
    if (rdxUser.credentials === "") {
      navigate("/login");
    }

  }, [rdxUser]);


  const updateData = async () => {

    try {
      const fetched = await updateProfile(rdxUser.credentials.token, user)
      setUser({
        email: fetched.data.email,
        firstName: fetched.data.firstName,
        image: fetched.data.image,
        lastName: fetched.data.lastName,
      })

      setWrite("disabled")

    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async (postId) => {
    try {
      console.log(postId)
      await deletePost(postId, rdxUser.credentials.token);
      console.log("HOLA")

      const data = await getUserPosts(rdxUser.credentials.token);
      setPostsData(data);

    } catch (error) {
      setError(error);
    }
  };



  const handleEdit = (index, postId) => {
    setEditIndex(index);
    console.log(postsData);
    console.log(postId);
    setWritePost("")
    for (let i = 0; i < postsData.data.length; i++) {
      if (postsData.data[i]._id === postId) {
        console.log("este", postsData.data[i].image);
        setPost({
          description: postsData.data[i].description,
          image: postsData.data[i].image,
          title: postsData.data[i].title,
        });
        break;
      }
    }
  };

  const updateUserPost = (index) => {
    try {
      // const fetched = await updateProfile(rdxUser.credentials.token, post)
      // setUser({
      //   email: fetched.data.email,
      //   firstName: fetched.data.firstName,
      //   image: fetched.data.image,
      //   lastName: fetched.data.lastName,
      // })

      setWritePost("disabled")
      setEditIndex(-1);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='profileDesign'>
      <div className='profileLeft'>

        <div className='profileLeftUp'>
          <div className="profileLeftTitle">
            PERSONAL INFORMATION
          </div>
          <div className='profileLeftBody'>
            {user && (
              <div className="profileUserCardDesign">
                <div className="cardUserUp">
                  <div className="userUserData">
                    <div className="userImage">
                      <div className="inputImageUser">PROFILE IMAGE:</div>
                      <img className="imageProfileUser" src={user.image} alt="pers1" />
                    </div>
                    <div className="inputUserFormat">
                      <div>
                        <div className="inputUser">NAME:</div>
                      </div>
                      <div>
                        <CustomInput
                          className={`inputDesign ${userError.firstNameError !== "" ? "inputDesignError" : write === "" ? "inputDesignAvaiable" : ""
                            }`}
                          type={"text"}
                          placeholder={""}
                          name={"firstName"}
                          disabled={write}
                          value={user.firstName || ""}
                          onChangeFunction={(e) => inputHandler(e)}
                          onBlurFunction={(e) => checkError(e)}
                        />
                        <div className="error">{userError.firstNameError}</div>
                      </div>
                    </div>

                    <div className="inputUserFormat">
                      <div>
                        <div className="inputUser">LAST NAME:</div>
                      </div>
                      <div>
                        <CustomInput
                          className={`inputDesign ${userError.lastNameError !== "" ? "inputDesignError" : write === "" ? "inputDesignAvaiable" : ""
                            }`}
                          type={"text"}
                          placeholder={""}
                          name={"lastName"}
                          disabled={write}
                          value={user.lastName || ""}
                          onChangeFunction={(e) => inputHandler(e)}
                          onBlurFunction={(e) => checkError(e)}
                        />
                        <div className="error">{userError.lastNameError}</div>
                      </div>
                    </div>

                    <div className="inputUserFormat">
                      <div>
                        <div className="inputUser">PROFILE IMAGE:</div>
                      </div>
                      <div>
                        <CustomInput
                          className={`inputDesign ${userError.imageError !== "" ? "inputDesignError" : write === "" ? "inputDesignAvaiable" : ""
                            }`}
                          type={"text"}
                          placeholder={""}
                          name={"image"}
                          disabled={write}
                          value={user.image || ""}
                          onChangeFunction={(e) => inputHandler(e)}
                          onBlurFunction={(e) => checkError(e)}
                        />
                        <div className="error">{userError.imageError}</div>
                      </div>
                    </div>

                    <div className="inputUserFormat">
                      <div>
                        <div className="inputUser">EMAIL:</div>
                      </div>
                      <div>
                        <CustomInput
                          className={`inputDesign ${userError.emailError !== "" ? "inputDesignError" : ""
                            }`}
                          type={"email"}
                          placeholder={""}
                          name={"email"}
                          disabled={"disabled"}
                          value={user.email}
                          onChangeFunction={(e) => inputHandler(e)}
                          onBlurFunction={(e) => checkError(e)}
                        />
                        <div className="error">{userError.emailError}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="cardUserDown">
                  <CustomButton
                    className={write === "" ? "cButtonGreen customButtonDesign" : "customButtonDesign"}
                    title={write === "" ? "Confirm" : "Edit"}
                    functionEmit={write === "" ? updateData : () => setWrite("")}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='profileCenter'>
        {postsData && postsData.data.map((post, index) => (
          <div key={index} className='profilePostCardDesign'>
            {index === 0 ? <div className="titlePost">MY POST</div> : null}
            <div className="bodyPostProfile" onClick={() => handlePost(post._id)}>
              <img className="imagePostProfile" src={post.image} alt={`${post._id}`} />
              <div>
                <CustomInput
                  className={`inputTitlePostDesign ${index === editIndex ? "inputEdit" : ""}`}
                  type={"text"}
                  placeholder={""}
                  name={"image"}
                  disabled={writePost}
                  value={index === editIndex ? postUpdated.image || "" : post.image || ""}
                  onChangeFunction={(e) => inputHandlerPost(e)}

                />
                <div className="error">{userError.imageError}</div>
              </div>
              <div>
                <CustomInput
                  className={`inputTitlePostDesign ${index === editIndex ? "inputEdit" : ""}`}
                  type={"text"}
                  placeholder={""}
                  name={"title"}
                  disabled={writePost}
                  value={index === editIndex ? postUpdated.title || "" : post.title.toUpperCase()  || ""}
                  onChangeFunction={(e) => inputHandlerPost(e)}

                />
                <div className="error">{userError.imageError}</div>
              </div>
              <div>
                <CustomInput
                  className={`inputDescriptionPostDesign ${index === editIndex ? "inputEdit" : ""}`}
                  type={"text"}
                  placeholder={""}
                  name={"description"}
                  disabled={writePost}
                  value={index === editIndex ? postUpdated.description || "" : post.description || ""}
                  onChangeFunction={(e) => inputHandlerPost(e)}
                />
                <div className="error">{userError.imageError}</div>
              </div>
            </div>
            <div className="bodyPostControlProfile">
              <div className="bodyPostDeleteControlProfile">
                <CustomLike title={`LIKES: ${post.like.length}`} />
                <CustomLike title={`COMMENTS: ${post.comments.length}`} />
              </div>
              <div className="bodyPostLikeControlProfile">
                <CustomLike title={'DELETE POST'} onClick={() => handleDelete(post._id)} />
                <CustomButton
                  className={writePost === "" ? "cButtonGreen customButtonDesign" : "customButtonDesign"}
                  title={(writePost === "") && (index === editIndex) ? "Confirm" : "Edit"}
                  functionEmit={writePost === "" ? updateUserPost : () => handleEdit(index, post._id)}
                />

              </div>
            </div>
          </div>
        ))}

      </div>

      <div className='profileRight'>
        <div className="profileRightUp">
          MY FOLLOWERS
        </div>
        <div className="profileRightDown">
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