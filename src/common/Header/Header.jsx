import "./Header.css";
import { useSelector, useDispatch } from "react-redux";
import { userData, logout } from "../../app/slices/userSlice";
import { updateCriteria } from "../../app/slices/searchSlice";
import { useEffect, useState } from "react";
import { CustomLink } from "../CustomLink/CustomLink";
import { CustomInput } from "../CustomInput/CustomInput";
import { updateDetail } from "../../app/slices/postSlice";


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
            <div className="logoHeader">
              LOGO
            </div>
            <div className="menuHeader">
              <CustomLink title="Timeline" destination="/timeline" />
              <CustomLink title={`${rdxUser?.credentials?.user?.userName}`} destination="/profile" />
              <CustomLink title="Posts" destination="/posts" />
            </div>
            <div className="rightHeader">
              <div className="out-design" onClick={() => dispatch(logout({ credentials: "" }), updateDetail({ detail: "" }))}>
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