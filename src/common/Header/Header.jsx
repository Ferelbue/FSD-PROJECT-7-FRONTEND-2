import "./Header.css";
import { useSelector, useDispatch } from "react-redux";
import { userData, logout, login } from "../../app/slices/userSlice";
import { updateCriteria } from "../../app/slices/searchSlice";
import { useEffect, useState } from "react";
import { decodeToken } from "react-jwt";
import { CustomLink } from "../CustomLink/CustomLink";
import { CustomInput } from "../CustomInput/CustomInput";
import { loginMe } from "../../services/apiCalls";
import { validame } from "../../utils/functions";
import { CustomRegister } from "../CustomRegister/CustomRegister";
import { useLocation } from "react-router-dom"

export const Header = () => {
  //Instancia de conexion a modo lectura
  const rdxUser = useSelector(userData);

  //Instancia de conexion a modo escritura
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(rdxUser, " credenciales pasaporte");
  }, [rdxUser]);

  const [criteria, setCriteria] = useState("")
  // const [view, setView] = useState("")

  const searchHandler = (e) => {
    setCriteria(e.target.value)
  }

  useEffect(() => {
    if (criteria !== "") {
      //guardo en redux.....
      dispatch(updateCriteria(criteria))
    }
  }, [criteria])



  const [msgError, setMsgError] = useState("");

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

      setTimeout(() => {
        navigate("/")
      }, 500)
    }
  };

  const realView = useLocation()
  // console.log(realView);

  return (
    <>
      {rdxUser?.credentials?.token ? (
        <div className="headerDesign">
          <div className="logoHeader">
            <CustomLink title="LOGO" destination="/" />
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
          <div className="menu">
            <CustomLink title="Timeline" destination="/timeline" />
            <CustomLink title={`${rdxUser?.credentials?.user?.userName}`} destination="/profile" />
            <CustomLink title="Posts" destination="/posts" />
            <div className="out-design" onClick={() => dispatch(logout({ credentials: "" }))} destination="/logout">
              log out
            </div>
          </div>
        </div>
      ) : (
        (realView.pathname === "/")
          ? (
            <div className="headerHomeDesign">
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
          )
          : (
            <div className="headerRegisterDesign">
              <div className="logoRegisterHeader">
                <CustomLink title="LOGO" destination="/" />
              </div>
            </div>
          )
      )}
    </>
  );
};