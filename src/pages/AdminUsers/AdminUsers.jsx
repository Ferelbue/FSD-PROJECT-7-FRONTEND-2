
import { useState, useEffect } from "react";
import "./AdminUsers.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { userData } from "../../app/slices/userSlice";
import { searchData } from "../../app/slices/searchSlice";
import { deleteUserById, getUsers } from "../../services/apiCalls";
import pot from "../../../public/pot.png"
import { CustomInput } from "../../common/CustomInput/CustomInput";


export const AdminUsers = () => {
  const navigate = useNavigate();
  const rdxUser = useSelector(userData);
  const searchRdx = useSelector(searchData);
  const [error, setError] = useState();
  const [usersFetched, setUsersFetched] = useState();
  const [userDelete, setUserDelete] = useState(false);
  const [criteria, setCriteria] = useState("")

  useEffect(() => {
    const bringUsers = async () => {
      try {
        const usersData = await getUsers(rdxUser.credentials.token, "");
        setUsersFetched(usersData);
        setUserDelete(false)
      } catch (error) {
        setError(error);
      }
    };

    bringUsers();
  }, [userDelete]);

  useEffect(() => {
    const bringUsers = async () => {
      if (searchRdx.criteria !== "") {
        try {
          const usersData = await getUsers(rdxUser.credentials.token, searchRdx.criteria);
        setUsersFetched(usersData);
        setUserDelete(false)
        } catch (error) {
          setError(error);
        }
      }

    };

    bringUsers();
  }, [searchRdx.criteria,userDelete]);

  const handleDelete = async (userId) => {
    try {
      await deleteUserById(rdxUser.credentials.token, userId);
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

  return (
    <>
      <div className="adminUsersDesign">
        <div className="filtersAdmin">
          FILTROS
          <div className="inputHeader">
            <CustomInput
              className={`inputSearch`}
              type="text"
              placeholder="search a user...."
              name="user"
              value={criteria || ""}
              onChangeFunction={(e) => searchHandler(e)}
            />
          </div>
        </div>


        {usersFetched?.success && usersFetched?.data?.length > 0 ? (
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
            {usersFetched.data.map((user, index) => {
              return (
                <div className="userAdminSearched" key={user._id}>
                  <div className="usersAdminIndex">
                    {index + 1}
                  </div>
                  <div className="usersAdminImage">
                    <img className="image" src={user.image} alt={`${user.firstName}`} />
                  </div>
                  <div className="usersAdminName">
                    {user.firstName.toUpperCase()}
                  </div>
                  <div className="usersAdminLast">
                    {user.lastName.toUpperCase()}
                  </div>
                  <div className="usersAdminEmail">
                    {user.email.toUpperCase()}
                  </div>
                  <div className="usersAdminRole">
                    {user.role.toUpperCase()}
                  </div>
                  <div className="usersAdminDelete" onClick={() => handleDelete(user._id)}>
                    <img className="image" src={pot} alt={`${user.firstName}`} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="searchUsers">Users not found</div>
        )}



      </div>
    </>
  );
};
