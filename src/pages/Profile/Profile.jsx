
import React, { useState, useEffect } from "react";
import './Profile.css';
import { deletePost, getFollowers, getUserPosts, getUserProfile, updateUserPosts, updateProfile, createNewPost } from "../../services/apiCalls";
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
import { updateName } from "../../app/slices/nameSlice";
import dayjs from "dayjs";
import pot from "../../../public/pot.png"
import like from "../../../public/like.png";
import newP from "../../../public/newPost.png";

export const Profile = () => {

  const [followersData, setFollowersData] = useState();
  const [postsData, setPostsData] = useState();
  const [error, setError] = useState();
  const [modal, setModal] = useState(false);
  const rdxUser = useSelector(userData);
  const searchRdx = useSelector(searchData);
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
        console.log(error)
      }
    }


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
  }, [postUpdated]);

  useEffect(() => {
    if (rdxUser.credentials === "") {
      navigate("/login");
    }

  }, [rdxUser]);


  const updateData = async () => {
    console.log("1")
    try {
      const fetched = await updateProfile(rdxUser.credentials.token, user)
      setUser({
        email: fetched.data.email,
        firstName: fetched.data.firstName,
        image: fetched.data.image,
        lastName: fetched.data.lastName,
      })
      dispatch(updateName({ name: user.firstName }))
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
  const handleEdit = async (index, postId) => {
    try {

      setEditIndex(index);
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
    } catch (error) {
      console.log(error)
    }
  };

  const updateUserPost = async (postId) => {
    try {
      console.log(postId, "asd")
      const fetched = await updateUserPosts(rdxUser.credentials.token, postId, postUpdated)

      setPost({
        description: fetched.data.description,
        image: fetched.data.image,
        title: fetched.data.title,
      })

      setWritePost("disabled")
      setEditIndex(-1);
    } catch (error) {
      console.log(error)
    }
  }

  const handlePost = async (postId) => {
    try {

      dispatch(updateDetail({ detail: postId }))
      navigate("/detailPost")

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

  const handleModal = async () => {
    try {
      setModal(true)
      setWriteModal("")

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
    <div className={`profileDesign ${modal === true ? "profileDesign2" : ""}`} >
      <div className='profileLeft'>

        <div className='profileLeftUp1'>
          <div className="profileLeftTitle">
            PERSONAL INFORMATION
          </div>
          <div className='profileLeftBody'>
            {user && (
              <div className="profileUserCardDesign">
                <div className="cardUserUp">
                  <div className="userUserData">
                    <div className="userImage ">
                      <div className="inputImageUser">PROFILE IMAGE</div>
                      <img className="imageProfileUser" src={user.image} alt="pers1" />
                    </div>
                    <div className="inputUserFormat">
                      <div>
                        <div className="inputUser">NAME</div>
                      </div>
                      <div>
                        <CustomInput
                          className={`inputDesign2 ${userError.firstNameError !== "" ? "inputDesignError" : write === "" ? "inputDesignAvaiable" : ""
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
                        <div className="inputUser">LAST NAME</div>
                      </div>
                      <div>
                        <CustomInput
                          className={`inputDesign2 ${userError.lastNameError !== "" ? "inputDesignError" : write === "" ? "inputDesignAvaiable" : ""
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
                        <div className="inputUser">PROFILE IMAGE</div>
                      </div>
                      <div>
                        <CustomInput
                          className={`inputDesign2 ${userError.imageError !== "" ? "inputDesignError" : write === "" ? "inputDesignAvaiable" : ""
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
                        <div className="inputUser">EMAIL</div>
                      </div>
                      <div>
                        <CustomInput
                          className={`inputDesign2 ${userError.emailError !== "" ? "inputDesignError" : ""
                            }`}
                          type={"email"}
                          placeholder={""}
                          name={"email"}
                          disabled={"disabled"}
                          value={user.email}
                          onChangeFunction={(e) => inputHandler(e)}
                          onBlurFunction={(e) => checkError(e)}
                        />
                        <div className="error2">{userError.emailError}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="cardUserDown">
                  <CustomButton
                    className={write === "" ? "cButtonGreen customButtonDesign2" : "customButtonDesign2"}
                    title={write === "" ? "Confirm" : "EDIT PROFILE"}
                    functionEmit={write === "" ? updateData : () => setWrite("")}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`profileCenter ${modal === true ? "profileCenter2" : ""}`} >
        {postsData && postsData?.data?.map((post, index) => (
          <div key={index} className='profilePostCardDesign2'>
            {index === 0 ? <div className="titlePost">MY POSTS</div> : null}
            <div className="bodyPostProfile2">
              <div className="bodyDateProfile">
                <div className="bodyDate1Profile">

                </div>
                <div className="bodyDate2Profile">
                  {dayjs(post.createdAt).format('ddd DD-MM-YYYY')}
                </div>
              </div>


              <div className="bodyTitleTextProfile">
                <div className="bodyTitleText1Profile">
                  TITLE:
                </div>
                <div className="bodyTitleText2Profile">

                </div>
              </div>
              <div className="bodyTitleProfile">
                <div className="bodyTitle1Profile">
                  <CustomInput
                    className={`inputTitlePostDesign ${index === editIndex ? "inputEdit" : ""}`}
                    type={"text"}
                    placeholder={""}
                    name={"title"}
                    disabled={writePost}
                    value={index === editIndex ? postUpdated.title || "" : post.title.toUpperCase() || ""}
                    onChangeFunction={(e) => inputHandlerPost(e)}

                  />
                  <div className="error">{userError.imageError}</div>
                </div>
              </div>

              <div className="bodyImageTextProfile">
                <div className="bodyImageText1Profile">
                  IMAGE:
                </div>
                <div className="bodyImageText2Profile">

                </div>
              </div>
              <div className="bodyImageProfile">
                <div className="bodyImage1Profile">
                  <img className="imagePostProfile2" src={index === editIndex ? postUpdated.image : post.image} alt={`${post._id}`} />
                </div>
                <div className="bodyImage2Profile">
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
              </div>


              <div className="bodyDescriptionTextProfile">
                <div className="bodyDescriptionText1Profile">
                  DESCRIPTION:
                </div>
                <div className="bodyDescriptionText2Profile">

                </div>
              </div>
              <div className="bodyDescriptionProfile">
                <div className="bodyDescription1Profile">
                  <CustomTextArea
                    className={`inputDescriptionPostDesign ${index === editIndex ? "inputEdit" : ""}`}
                    type={"textarea"}
                    placeholder={""}
                    name={"description"}
                    disabled={writePost}
                    value={index === editIndex ? postUpdated.description || "" : post.description || ""}
                    onChangeFunction={(e) => inputHandlerPost(e)}
                  />
                  <div className="error">{userError.imageError}</div>
                </div>
              </div>


              <div className="bodyBotomProfile">
                <div className="bodyBotom1Profile">
                  {post.like.length}&nbsp;&nbsp;&nbsp;&nbsp;<img className="image2Post" src={like} alt={`${post._id}`} onClick={() => handleLike(post._id)} />
                </div>
                <div className="bodyBotom2Profile">
                  <img className="image2Post" src={like} alt={`${post._id}`} />&nbsp;&nbsp;&nbsp;&nbsp;{post.comments.length}
                </div>
                <div className="bodyBotom3Profile">
                  <img className="image2" src={pot} alt={`${post.firstName}`} />
                </div>
                <div className="bodyBotom4Profile">
                  <CustomButton
                    className={writePost === "" ? "cButtonGreen customButtonDesign" : "customButtonDesign"}
                    title={(writePost === "") && (index === editIndex) ? "Confirm" : "Edit"}
                    functionEmit={writePost === "" ? () => updateUserPost(post._id) : () => handleEdit(index, post._id)}
                  />
                </div>
              </div>

            </div>
          </div>
        ))}

      </div>

      <div className={`profileRight12 ${modal === true ? "profileRight22" : ""}`} >
        <div className="profileRightUp">
          MY PICTURES
        </div>
        <div className="profileRightDown">
          {postsData && postsData?.data?.reverse().map((post, index) => (
            <div className="imgUsr" key={post._id}>
              <img className="imagesUser" src={post.image} alt={`${post._id}`} onClick={() => handlePost(post._id)} />
            </div>
          ))
          }
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
    </div>
  );
};