
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '../Home/Home';
import { Login } from '../Login/Login';
import { Register } from '../Register/Register';
import { Profile } from '../Profile/Profile';
import { LogOut } from '../LogOut/LogOut';
import { Posts } from '../Posts/Posts';
import { Timeline } from '../Timeline/Timeline';
import { DetailPost } from '../DetailPost/DetailPost';
import { PostNew } from '../PostNew/PostNew';
import { FollowProfile } from '../FollowProfile/FollowProfile';
import { Admin } from '../Admin/Admin';
import { AdminUsers } from '../AdminUsers/AdminUsers';
import { AdminPosts } from '../AdminPosts/AdminPosts';

export const Body = () => {

    return(
        <Routes>
            <Route path="*" element={<Navigate to={"/login"} replace />} />
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/followprofile" element={<FollowProfile />} />
            <Route path="/logout" element={<LogOut />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/detailPost" element={<DetailPost />} />
            <Route path="/postNew" element={<PostNew />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/adminUsers" element={<AdminUsers />} />
            <Route path="/adminPosts" element={<AdminPosts />} />
        </Routes>
    )
}
