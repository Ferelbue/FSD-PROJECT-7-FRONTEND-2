import "./Header.css";
import { useSelector, useDispatch } from "react-redux";
import { userData, logout } from "../../app/slices/userSlice";
import { updateCriteria } from "../../app/slices/searchSlice";
import { useEffect, useState } from "react";
import { CustomLink } from "../CustomLink/CustomLink";


export const Header = () => {
  //Instancia de conexion a modo lectura
  const rdxUser = useSelector(userData);

  //Instancia de conexion a modo escritura
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(rdxUser, " credenciales pasaporte");
  }, [rdxUser]);

  // const [criteria, setCriteria] = useState("")

  // useEffect(()=>{
  //   if(criteria !== ""){
  //     //guardo en redux.....
  //     dispatch(updateCriteria(criteria))
  //   }
  // }, [criteria])

  return (
    <div className="headerDesign">
      {rdxUser?.credentials?.token ? (
        <div className="menu">
         <CustomLink title="Timeline" destination="/timeline" />
         <CustomLink title={`${rdxUser?.credentials?.user?.userName}`} destination="/profile" />
         <CustomLink title="Posts" destination="/posts" />
         <div
            className="out-design"
            onClick={() => dispatch(logout({ credentials: "" }))}
          >
            log out
          </div>
        </div>
      ) : (
        <div className="menu">
          <CustomLink title="Home" destination="/" />
          <CustomLink title="Login" destination="/login" />
          <CustomLink title="Register" destination="/register" />
        </div>
      )}
    </div>
  );
};