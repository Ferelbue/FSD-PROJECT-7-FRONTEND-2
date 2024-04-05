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
    <>
      {rdxUser?.credentials?.token ? (
        <>
        <div className="headerDesign">
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
            <div className="out-design" onClick={() => dispatch(logout({ credentials: "" }))}>
              log out
            </div>
          </div>
          </div>
        </>
      ) : (
        <>
        <div>
          
        </div>

        
        </>
      )}
    </>
  );
};