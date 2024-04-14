
import "./Admin.css";
import { useNavigate } from "react-router-dom";
import imgUsers from "../../../public/adminUsers.png"
import imgPosts from "../../../public/adminPost.png"


export const Admin = () => {
  const navigate = useNavigate();

  const handleUsers = () => {

    navigate("/adminUsers")

  }
  const handlePosts = () => {

    navigate("/adminPosts")
  }

  return (
    <>
      <div className="adminDesign">
        <div className="adminUsersCard" onClick={() => handleUsers()}>
          <img className="image3Post" src={imgUsers} alt={`adminUsers`} />

        </div>
        <div className="adminPostsCard" onClick={() => handlePosts()}>
        <img className="image3Post" src={imgPosts} alt={`adminUsers`} />
        </div>
      </div>
    </>
  );
};
