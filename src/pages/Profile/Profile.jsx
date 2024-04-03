
import React, { useState, useEffect } from "react";
import './Profile.css';
import { getUserProfile } from "../../services/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import { userData } from "../../app/slices/userSlice";

export const Profile = () => {
  const [profileData, setProfileData] = useState();
  const [error, setError] = useState();

  const rdxUser = useSelector(userData);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        console.log(rdxUser.credentials.token);
        const data = await getUserProfile(rdxUser.credentials.token);
        setProfileData(data);

      } catch (error) {
        setError(error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <>
      <div className='profileDesign'>
        <div className='profileCardDesign'>
          {profileData && (
            <>
              <div>
                <p>Nombre: {profileData.data.firstName}</p>
                <p>Correo electrónico: {profileData.data.email}</p>
                <p>Seguidores: {profileData.data.follower}</p>
              </div>
              {/* <div className="pruebaImg"> */}
                <img className="prueba" src={profileData.data.image} alt="pers1" />
              {/* </div> */}
            </>
          )}
        </div>
      </div>
    </>
  );
};