import { useNavigate } from "react-router-dom"
import { useEffect } from "react";
export const FirstPage=()=>{
    const navigate=useNavigate()
    useEffect(() => {
        if (localStorage.getItem("token")) {
          navigate("/blogs");
        } else {
          navigate("/signup");
        }
      }, [navigate]);
    return null;
}