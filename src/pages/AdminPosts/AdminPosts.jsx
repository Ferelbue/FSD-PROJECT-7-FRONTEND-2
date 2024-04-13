
import "./AdminPosts.css";
import { useNavigate } from "react-router-dom";

export const AdminPosts = () => {
  const navigate = useNavigate();

  const handleUsers = () => {

    navigate("/adminUsers")

  }
  const handlePosts = () => {

    navigate("/adminPosts")
  }

  return (
    <>
      <div className="adminPostsDesign">

      </div>
    </>
  );
};
