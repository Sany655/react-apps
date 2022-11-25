import React, { useEffect } from 'react'
import { useSelector } from "react-redux"
import { Navigate } from 'react-router-dom';

const Public = ({children}) => {
    const user = useSelector(state => state.auth).user
    if (user) {
        return <Navigate to="/" replace />;
    }
    return children;
}

export default Public