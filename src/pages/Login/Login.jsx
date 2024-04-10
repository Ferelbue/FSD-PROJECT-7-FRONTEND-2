import { useState, useEffect } from "react";
import { decodeToken } from "react-jwt";
import { CustomInput } from "../../common/CustomInput/CustomInput";
import { CustomLink } from "../../common/CustomLink/CustomLink";
import { validame } from "../../utils/functions";
import "./Login.css";
import { loginMe } from "../../services/apiCalls";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, userData } from "../../app/slices/userSlice";
import { CustomRegister } from "../../common/CustomRegister/CustomRegister";


export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [msgError, setMsgError] = useState("");

  const rdxUser = useSelector(userData);

  const [credenciales, setCredenciales] = useState({
    email: "",
    password: "",
  });

  const [userError, setUserError] = useState({
    emailError: "",
    passwordError: "",
  });

  const inputHandler = (e) => {
    setCredenciales((prevState) => ({
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

  const logMe = async () => {

    const fetched = await loginMe(credenciales);

    if (fetched.token) {
      const decodificado = decodeToken(fetched.token);

      const passport = {
        token: fetched.token,
        user: decodificado,
      };

      dispatch(login({ credentials: passport }));

      navigate("/timeline")

    }
  };

  return (
    <>
      <div className="loginDesign">

        <div className="headerloginDesign">
          <div className="logoHeader">
            <CustomLink title="LOGO" destination="/" />
          </div>
          <div className="menu2">
            <div className="menuInputHeader">
              <div className="inputError">
                <CustomInput
                  className={`inputDesign ${userError.emailError !== "" ? "inputDesignError" : ""
                    }`}
                  type="email"
                  placeholder="write your email...."
                  name="email"
                  value={credenciales.email || ""}
                  onChangeFunction={(e) => inputHandler(e)}
                  onBlurFunction={(e) => checkError(e)}
                />
                <div className="errorHeader">{userError.emailError}</div>
              </div>
              <div className="inputError">
                <CustomInput
                  className={`inputDesign ${userError.passwordError !== "" ? "inputDesignError" : ""
                    }`}
                  type="password"
                  name="password"
                  value={credenciales.password || ""}
                  placeholder="write your password...."
                  onChangeFunction={(e) => inputHandler(e)}
                  onBlurFunction={(e) => checkError(e)}
                />
                <div className="errorHeader">{userError.passwordError}</div>
              </div>
              <div className="customButtonHeaderDesign" onClick={logMe}>
                Log me!
              </div>
            </div>
            <div className="registerHeader">
              <div className="error">{msgError}</div>
              <CustomRegister className="linkRegister" title="Not registered yet? Register here" destination="/register" />
            </div>
          </div>
        </div>
        <div className="loginBody" >
          INSTAGEEKS!
        </div>
        <div className="loginFooter" >

        </div>
      </div>
    </>
  );
};