import "./Header.css";
import { useSelector, useDispatch } from "react-redux";
import { userData, logout } from "../../app/slices/userSlice";
import { updateName } from "../../app/slices/nameSlice";
import { updateCriteria } from "../../app/slices/searchSlice";
import { useEffect, useState } from "react";
import { CustomLink } from "../CustomLink/CustomLink";
import { CustomInput } from "../CustomInput/CustomInput";
import { updateDetail } from "../../app/slices/postSlice";
import { updateFollow } from "../../app/slices/followSlice";


export const Header = () => {
  //Instancia de conexion a modo lectura
  const rdxUser = useSelector(userData);
  const rdxName = useSelector(updateName);

  console.log(rdxName, "asdasdasdsad")
  //Instancia de conexion a modo escritura
  const dispatch = useDispatch();

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
              <CustomLink title={`${rdxName.payload.name.name.toUpperCase()} PROFILE`} destination="/profile" />
            </div>
            <div className="rightHeader">
              <div className="out-design" onClick={() => {
                dispatch(logout({ credentials: "" }));
                dispatch(updateDetail({ detail: "" }));
                dispatch(updateFollow({ follow: "" }));
                dispatch(updateName({ name: "" }));
              }}>
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