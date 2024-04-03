import { useState } from "react";
import { CustomInput } from "../../common/CustomInput/CustomInput";
import "./Register.css";
import { CustomButton } from "../../common/CustomButton/CustomButton";
import { validame } from "../../utils/functions";
import { useNavigate } from "react-router-dom";
import { registerMe } from "../../services/apiCalls";

export const Register = () => {

  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: "",
    email: "",
    password: "",
  });

  const [userError, setUserError] = useState({
    firstNameError: "",
    emailError: "",
    passwordError: "",
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

      setTimeout(()=>{
        navigate("/login")
      },1500)

    } catch (error) {
      setMsgError(error.message);
    }
  };

  return (
    <>
    <div className="registerDesign">
      {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
      <CustomInput
        className={`inputDesign ${
          userError.firstNameError !== "" ? "inputDesignError" : ""
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
        className={`inputDesign ${
          userError.emailError !== "" ? "inputDesignError" : ""
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
        className={`inputDesign ${
          userError.passwordError !== "" ? "inputDesignError" : ""
        }`}
        type={"password"}
        placeholder={"password"}
        name={"password"}
        value={user.password || ""}
        onChangeFunction={(e) => inputHandler(e)}
        onBlurFunction={(e) => checkError(e)}
      />
      <div className="error">{userError.passwordError}</div>
      <CustomButton
        className={"customButtonDesign"}
        title={"Register"}
        functionEmit={registerUser}
      />
      <div className="error">{msgError}</div>
    </div>
    </>
  );
};
