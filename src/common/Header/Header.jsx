import "./Header.css";
import { useSelector, useDispatch } from "react-redux";
import { userData, logout } from "../../app/slices/userSlice";
import { updateCriteria } from "../../app/slices/searchSlice";
import { useEffect, useState } from "react";
import { CustomLink } from "../CustomLink/CustomLink";
import { CustomInput } from "../CustomInput/CustomInput";


export const Header = () => {
  //Instancia de conexion a modo lectura
  const rdxUser = useSelector(userData);

  //Instancia de conexion a modo escritura
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(rdxUser, " credenciales pasaporte");
  }, [rdxUser]);

  const [criteria, setCriteria] = useState("")

  const searchHandler = (e) => {
    setCriteria(e.target.value)
  }

  useEffect(() => {
    if (criteria !== "") {
      //guardo en redux.....
      dispatch(updateCriteria(criteria))
    }
  }, [criteria])

  return (
    <div className="headerDesign">
      <div className="logoHeader">

      </div>

      {rdxUser?.credentials?.token ? (
        <>
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
        </>
      ) : (
        <>
        <div className="inputHeader">

        </div>
        <div className="menu">
          <CustomLink title="Home" destination="/" />
          <CustomLink title="Login" destination="/login" />
          <CustomLink title="Register" destination="/register" />
        </div>
        </>
      )}
    </div>
  );
};