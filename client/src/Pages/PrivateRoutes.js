import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { DataContext } from "../Context/AuthContext";

function PrivateRoutes(){
    let {user ,loading} = useContext(DataContext)
    if(loading) return <div className="text-center mt-5 text-white">Loading....</div>

    return user ? <Outlet/> : <Navigate to="/"/>
}

export default PrivateRoutes