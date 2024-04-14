
import { useState, useEffect } from "react";
import "./AdminPosts.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userData } from "../../app/slices/userSlice";
import { validame } from "../../utils/functions";
import { searchData } from "../../app/slices/searchSlice";
import { userByData, updateUserBy } from "../../app/slices/userBySlice";
import { deletePost, getPosts } from "../../services/apiCalls";
import pot from "../../../public/pot.png"
import { CustomInput } from "../../common/CustomInput/CustomInput";
import { updateCriteria } from "../../app/slices/searchSlice";
import { CustomNumber } from "../../common/CustomNumber copy/CustomNumber";
import { CustomButton } from "../../common/CustomButton/CustomButton";
import Spinner from 'react-bootstrap/Spinner';

export const AdminPosts = () => {
  const navigate = useNavigate();
  const rdxUser = useSelector(userData);
  const rdxBy = useSelector(userByData);
  const searchRdx = useSelector(searchData);
  const dispatch = useDispatch();
  const [error, setError] = useState();
  const [postsFetched, setPostsFetched] = useState();
  const [userDelete, setUserDelete] = useState(false);
  const [nameCriteria, setNameCriteria] = useState("")
  const [criteria, setCriteria] = useState("")
  const [pag, setPag] = useState(1)
  const [limit, setLimit] = useState(10)
  const [numberPosts, setNumberPosts] = useState()
  const [loadedData, setLoadedData] = useState(false);
  const [write, setWrite] = useState("disabled");
  const [updateUser, setUpdateUser] = useState("");

  const [userError, setUserError] = useState({
    roleError: "",
  });

  useEffect(() => {
    if (rdxUser.credentials === "") {
      navigate("/login");
    }

  }, [rdxUser]);


  useEffect(() => {
    const bringUsers = async () => {
      try {
        const postsData = await getPosts(rdxUser.credentials.token, "", "");
        setNumberPosts(postsData.data.length)
      } catch (error) {
        setError(error);
      }
    };

    bringUsers();
  }, []);

  useEffect(() => {
    const bringPosts = async () => {

      try {
        const postsData = await getPosts(rdxUser.credentials.token, searchRdx.criteria, limit, pag);
        setPostsFetched(postsData);
        setUserDelete(false)

      } catch (error) {
        setError(error);
      }
    };

    bringPosts();
  }, [pag, limit, userDelete, criteria]);


  const handleDelete = async (postId) => {
    try {

      await deletePost(postId, rdxUser.credentials.token);
      setUserDelete(true);
    } catch (error) {
      setError(error);
    }
  };


  useEffect(() => {
    const searching = setTimeout(() => {
      dispatch(updateCriteria(nameCriteria));
    }, 375);

    return () => clearTimeout(searching);
  }, [criteria]);

  const searchHandler = (e) => {
    setCriteria(e.target.value)
    setNameCriteria(e.target.value.toLowerCase())
  }
  const searchHandler2 = (e) => {
    setPag(e.target.value)
  }
  const searchHandler3 = (e) => {
    setLimit(e.target.value)
  }

  return (
    <>
      <div className="adminUsersDesign">
        <div className="leftUsersAdmin">
          <div className="filtersAdmin">
            <div className="inputHeader">

              <div className="pagText">
                FILTER BY TITLE
              </div>
              <CustomInput
                className={`inputSearch`}
                type="text"
                placeholder="search a user...."
                value={criteria || ""}
                onChangeFunction={(e) => searchHandler(e)}
              />
              <div className="pagText">
                Nº POSTS DISPLAYED
              </div>
              <CustomNumber
                className={`limitSearch inputAdmin`}
                type="number"
                placeholder=""
                name="user"
                value={limit || ""}
                min="1"
                max={(Math.ceil((numberPosts / pag)))}
                defaultValue="10"
                onChangeFunction={(e) => searchHandler3(e)}
              />
            </div>
          </div>

        </div>



        {!postsFetched ? (
          <div className="searchAdminUsers">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <>
            {postsFetched?.success && postsFetched?.data?.length > 0 ? (
              <div className="searchAdminUsers">
                <div className="firstAdminRow">
                  <div className="usersAdminIndex2">
                    INDEX
                  </div>
                  <div className="usersAdminImage2">
                    IMAGE
                  </div>
                  <div className="usersAdminName2">
                    USER
                  </div>
                  <div className="usersAdminTitle">
                    TITLE
                  </div>
                  <div className="usersAdminDescription2">
                    DESCRIPTION
                  </div>
                  <div className="usersAdminDelete2">
                    DELETE
                  </div>
                </div>
                {postsFetched.data.map((post, index) => {
                  return (
                    <div className="userAdminSearched" key={post._id}>
                      <div className="usersAdminIndex2">
                        {index + 1}
                      </div>
                      <div className="usersAdminImage2">
                        <img className="image" src={post.image} alt={`${post._id}`} onClick={() => handleModify(user._id)} />
                      </div>
                      <div className="usersAdminName2">
                        {post?.userId?.firstName}
                      </div>
                      <div className="usersAdminTitle">
                        {post.title}
                      </div>
                      <div className="usersAdminDescription">
                        {post.description}
                      </div>
                      <div className="usersAdminDelete2" onClick={() => handleDelete(post._id)}>
                        <img className="image2" src={pot} alt={`${post.firstName}`} />
                      </div>
                    </div>
                  );
                })}
                <CustomNumber
                  className={`pagSearch`}
                  type="number"
                  placeholder="Number of user showed..."
                  value={pag || ""}
                  min="1"
                  max={Math.ceil((numberPosts / limit))}
                  defaultValue="1"
                  onChangeFunction={(e) => searchHandler2(e)}
                />
                <div className="pagText">
                  PAG
                </div>
              </div>
            ) : (
              <div className="searchAdminUsers">
                <div className="firstAdminRow">
                  <div className="usersAdminIndex">
                    INDEX
                  </div>
                  <div className="usersAdminImage">
                    IMAGE
                  </div>
                  <div className="usersAdminName">
                    FIRST NAME
                  </div>
                  <div className="usersAdminLast">
                    LAST NAME
                  </div>
                  <div className="usersAdminEmail">
                    EMAIL
                  </div>
                  <div className="usersAdminRole">
                    ROLE
                  </div>
                  <div className="usersAdminDelete">
                    DELETE
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div >
    </>
  );
};
