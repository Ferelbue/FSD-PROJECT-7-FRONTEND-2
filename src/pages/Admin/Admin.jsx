
import "./Admin.css";
import { useNavigate } from "react-router-dom";

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
        <div className="adminUsersCard" onClick={()=> handleUsers()}>
        ADMIN USERS
        </div>
        <div className="adminPostsCard" onClick={()=> handlePosts()}>
        ADMIN POSTS
        </div>
      </div>
    </>
  );
};
