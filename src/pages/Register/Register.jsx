import { useState, useEffect } from "react";
import { CustomInput } from "../../common/CustomInput/CustomInput";
import "./Register.css";
import { CustomButton } from "../../common/CustomButton/CustomButton";
import { validame } from "../../utils/functions";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerMe } from "../../services/apiCalls";
import { userData } from "../../app/slices/userSlice";
import logo3 from "../../../public/logo3.png";

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
        <img className="imgLogin" src={logo3} alt={`logoLogin`} />
      </div>
      <div className="registerDesign">
        <div className="registerCardDesign">
          <div className="registerCardUp2">
            Registro
          </div>

          <div className="registerCardDown2">
            <CustomInput
              className={`inputDesign3 ${userError.firstNameError !== "" ? "inputDesignError" : ""
                }`}
              type={"text"}
              placeholder={"name"}
              name={"firstName"}
              value={user.firstName || ""}
              onChangeFunction={(e) => inputHandler(e)}
              onBlurFunction={(e) => checkError(e)}
            />
            <div className="error7">{userError.firstNameError}</div>
            <CustomInput
              className={`inputDesign3 ${userError.emailError !== "" ? "inputDesignError" : ""
                }`}
              type={"email"}
              placeholder={"email"}
              name={"email"}
              value={user.email || ""}
              onChangeFunction={(e) => inputHandler(e)}
              onBlurFunction={(e) => checkError(e)}
            />
            <div className="error7">{userError.emailError}</div>
            <CustomInput
              className={`inputDesign3 ${userError.passwordError !== "" ? "inputDesignError" : ""
                }`}
              type={"password"}
              placeholder={"password"}
              name={"password"}
              value={user.password || ""}
              onChangeFunction={(e) => inputHandler(e)}
              onBlurFunction={(e) => checkError(e)}
            />
            <div className="error7">{userError.passwordError}</div>
            <CustomInput
              className={`inputDesign3 ${userError.imageError !== "" ? "inputDesignError" : ""
                }`}
              type={"text"}
              placeholder={"image"}
              name={"image"}
              value={user.image || ""}
              onChangeFunction={(e) => inputHandler(e)}
              onBlurFunction={(e) => checkError(e)}
            />
            <div className="error7">{userError.imageError}</div>
            <CustomButton
              className={"customButtonDesign7"}
              title={"Send"}
              functionEmit={registerUser}
            />
            <div className="error8">{msgError}</div>
          </div>
        </div>
      </div>
    </>
  );
};
