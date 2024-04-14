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
import { useNavigate } from "react-router-dom"
import logo from "../../../public/logo.png"


export const Header = () => {

  const rdxUser = useSelector(userData);
  const rdxName = useSelector(updateName);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    dispatch(logout({ credentials: "" }));
    navigate("/")
  };

  return (
    <>
      {(rdxUser?.credentials !== "" && rdxUser?.credentials?.user?.roleName === "user") ? (
        <>
          <div className="headerDesign">
            <div className="logoHeader">
              <img className="imagePost3" src={logo} alt={`${post._id}`} onClick={()=>navigate("/timeline")}/>
            </div>
            <div className="menuHeader">
              <CustomLink title="HOME" destination="/timeline" />
              <CustomLink title={`PROFILE`} destination="/profile" />
            </div>
            <div className="rightHeader">

              <div className="out-design" onClick={() => handleLogout()} >
                LOG OUT
              </div>
            </div>
          </div>
        </>
      ) : (
        (rdxUser?.credentials !== "" && (rdxUser?.credentials?.user?.roleName === "admin" || rdxUser?.credentials?.user?.roleName === "super-admin")) ? (
          <>
            <div className="headerDesign">
              <div className="logoHeader">
                <img className="imagePost3" src={logo} alt={"logo"} onClick={()=>navigate("/timeline")} />
              </div>
              <div className="menuHeader">
                <CustomLink title="HOME" destination="/timeline" />
                <CustomLink title={`PROFILE`} destination="/profile" />
              </div>
              <div className="rightHeader">
                <CustomLink title="ADMIN" destination="/admin" />
                <div className="out-design" onClick={() => handleLogout()} >
                  LOG OUT
                </div>
              </div>
            </div>
          </>
        )
          : (
            <>
              { }
            </>
          )
      )}
    </>
  );
};