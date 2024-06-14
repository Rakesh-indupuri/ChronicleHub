import { Avatar } from "./Avatar";
import { Link } from "react-router-dom"
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface CustomJwtPayload {
    id: string;
    name: string;
}
 
export const Appbar = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("A"); 

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode<CustomJwtPayload>(token);
                setUserName(decodedToken.name); 
            } catch (error) {
                console.error('Invalid token:', error);
            }
        }
    }, []); 

    const handleMyBlogsClick = () => {
        console.log("My Blogs clicked");
        navigate("/myBlogs")
    };

    const handleUpdateProfileClick = () => {
        console.log("Update Profile clicked");
        navigate("/update")
    };

    const handleLogoutClick = () => {
        console.log("Logout clicked");
        localStorage.removeItem("token");
        navigate("/");
    };

    const dropdownOptions = {
        onMyBlogsClick: handleMyBlogsClick,
        onUpdateProfileClick: handleUpdateProfileClick,
        onLogoutClick: handleLogoutClick,
    };

    return (
        <div className="border-b flex justify-between px-10 py-4">
            <Link to={'/blogs'} className=" font-libre text-2xl flex flex-col justify-center cursor-pointer">
                Chronicle Hub
            </Link>
            <div>
                <Link to={`/publish`}>
                    <button type="button" className="mr-4 font-libre text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 ">New</button>
                </Link>
                <Avatar size={"big"} name={userName} dropdownOptions={dropdownOptions} />
            </div>
        </div>
    );
};