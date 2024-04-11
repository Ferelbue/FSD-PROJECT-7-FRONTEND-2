import "./Header.css";
import { useSelector, useDispatch } from "react-redux";
import { userData, logout } from "../../app/slices/userSlice";
import { updateCriteria } from "../../app/slices/searchSlice";
import { useEffect, useState } from "react";
import { CustomLink } from "../CustomLink/CustomLink";
import { CustomInput } from "../CustomInput/CustomInput";
import { updateDetail } from "../../app/slices/postSlice";
import { updateFollow } from "../../app/slices/followSlice";


export const Header = () => {
  //Instancia de conexion a modo lectura
  const rdxUser = useSelector(userData);

  //Instancia de conexion a modo escritura
  const dispatch = useDispatch();

  window.addEventListener("beforeunload", () => {
    
      { dispatch(logout({ credentials: "" }), updateDetail({ detail: "" })) }
      navigate("/login")
    
  });


  return (
    <>
      {rdxUser?.credentials?.token ? (
        <>
          <div className="headerDesign">
            <div className="logoHeader">
              LOGO
            </div>
            <div className="menuHeader">
              <CustomLink title="HOME" destination="/timeline" />
              <CustomLink title={`${rdxUser?.credentials?.user?.userName.toUpperCase()} PROFILE`} destination="/profile" />
            </div>
            <div className="rightHeader">
              <div className="out-design" onClick={() => dispatch(logout({ credentials: "" }), updateDetail({ detail: "" }), updateFollow({ follow: "" }))}>
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