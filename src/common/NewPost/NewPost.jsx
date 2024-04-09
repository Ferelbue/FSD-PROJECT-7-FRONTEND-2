import "./NewPost.css";
import { useSelector, useDispatch } from "react-redux";
import { userData, logout } from "../../app/slices/userSlice";
import { updateCriteria } from "../../app/slices/searchSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"

export const NewPost = () => {
  //Instancia de conexion a modo lectura
  const rdxUser = useSelector(userData);
  const navigate = useNavigate();
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
          <div className="newPostDesign">
            <div className="logoPositionerPost"></div>
            <div className="logoPost">
            <img className="pictureOdd" src={"../../public/newPost.png"} alt={"logo"} onClick={() => navigate("/postNew")}/>
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