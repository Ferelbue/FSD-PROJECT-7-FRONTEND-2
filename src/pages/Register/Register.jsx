import { useState } from "react";
import { CustomInput } from "../../common/CustomInput/CustomInput";
import "./Register.css";
import { CustomButton } from "../../common/CustomButton/CustomButton";
import { validame } from "../../utils/functions";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerMe } from "../../services/apiCalls";
import { userData } from "../../app/slices/userSlice";

export const Register = () => {

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

  return (
    <>
      <div className="headerRegisterDesing">
        LOGO INSTAGEEKS
      </div>
      <div className="registerDesign">
        {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
        <div className="registerCardDesign">
          <div className="registerCardUp">
            Registro
          </div>

          <div className="registerCardDown">
            <CustomInput
              className={`inputDesign ${userError.firstNameError !== "" ? "inputDesignError" : ""
                }`}
              type={"text"}
              placeholder={"name"}
              name={"firstName"}
              value={user.firstName || ""}
              onChangeFunction={(e) => inputHandler(e)}
              onBlurFunction={(e) => checkError(e)}
            />
            <div className="error">{userError.firstNameError}</div>
            <CustomInput
              className={`inputDesign ${userError.emailError !== "" ? "inputDesignError" : ""
                }`}
              type={"email"}
              placeholder={"email"}
              name={"email"}
              value={user.email || ""}
              onChangeFunction={(e) => inputHandler(e)}
              onBlurFunction={(e) => checkError(e)}
            />
            <div className="error">{userError.emailError}</div>
            <CustomInput
              className={`inputDesign ${userError.passwordError !== "" ? "inputDesignError" : ""
                }`}
              type={"password"}
              placeholder={"password"}
              name={"password"}
              value={user.password || ""}
              onChangeFunction={(e) => inputHandler(e)}
              onBlurFunction={(e) => checkError(e)}
            />
            <div className="error">{userError.passwordError}</div>
            <CustomInput
              className={`inputDesign ${userError.imageError !== "" ? "inputDesignError" : ""
                }`}
              type={"text"}
              placeholder={"image"}
              name={"image"}
              value={user.image || ""}
              onChangeFunction={(e) => inputHandler(e)}
              onBlurFunction={(e) => checkError(e)}
            />
            <div className="error">{userError.imageError}</div>
            <CustomButton
              className={"customButtonDesign"}
              title={"Send"}
              functionEmit={registerUser}
            />
            <div className="error">{msgError}</div>
          </div>
        </div>
      </div>
    </>
  );
};
