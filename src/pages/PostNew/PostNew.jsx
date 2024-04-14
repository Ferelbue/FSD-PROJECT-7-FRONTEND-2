import { useEffect } from "react";
import { useState } from "react";
import { CustomInput } from "../../common/CustomInput/CustomInput";
import "./PostNew.css";
import { CustomButton } from "../../common/CustomButton/CustomButton";
import { validame } from "../../utils/functions";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerMe } from "../../services/apiCalls";
import { userData } from "../../app/slices/userSlice";

export const PostNew = () => {
  const [writeModal, setWriteModal] = useState("disabled");
  const [error, setError] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const rdxUser = useSelector(userData);

  const [user, setUser] = useState({
    firstName: "",
    email: "",
    password: "",
    image: "",
  });

  const [userError, setUserError] = useState({
    firstNameError: "",
    emailError: "",
    passwordError: "",
    imageError: "",
  });

  const [msgError, setMsgError] = useState("");

  //funcion emit que está aqui en el padre... que se la pasamos al custom input
  const inputHandler = (e) => {
    //voy a proceder a bindear....
    setUser((prevState) => ({
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

  const registerUser = async () => {
    try {
      for (let elemento in user) {
        if (user[elemento] === "") {
          throw new Error("Todos los campos tienen que estar rellenos");
        }
      }

      console.log(user)
      const fetched = await registerMe(user);

      setMsgError(fetched.message)

      setTimeout(() => {
        navigate("/login")
      }, 1500)

    } catch (error) {
      setMsgError(error.message);
    }
  };

  useEffect(() => {
    if (rdxUser.credentials === "") {
      navigate("/login");
    }

  }, [rdxUser]);

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

  return (
    <>
      <div className="postNewDesign">
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
        
      </div>
    </>
  );
};
