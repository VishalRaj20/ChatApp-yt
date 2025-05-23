import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/auth/Auth.jsx'
import Chat from './pages/chat/Chat.jsx'
import Profile from './pages/profile/Profile.jsx'
import { Toaster } from 'react-hot-toast';
import { useAppStore } from './store/index.js'
import { GET_USER_INFO } from './utils/constants.js'
import { apiClient } from './lib/api-client.js'

const PrivateRoute = ({children}) =>{
  const {userInfo} = useAppStore();
  const isAuthenicated = !! userInfo;
  return isAuthenicated ? children : <Navigate to='/auth' />
};
const AuthRoute = ({children}) =>{
  const {userInfo} = useAppStore();
  const isAuthenicated = !!userInfo;
  return isAuthenicated ?  <Navigate to='/chat' /> : children;
};

const App = () => {

  const {userInfo, setUserInfo} = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect (() =>{
    const getUserData = async() =>{
      try {
        const response = await apiClient.get(GET_USER_INFO, {
          withCredentials: true
        });
        if(response.status === 200 && response.data.user){
          setUserInfo(response.data.user);
        }
        else{
          setUserInfo(undefined);
        }
        console.log(response);
      } catch (error) {
        console.error(error);
        setUserInfo(undefined);
      } finally {
        setLoading(false);
      }
    };
    if(!userInfo){
      getUserData();
    }
    else{
      setLoading(false);
    }
  },[userInfo,setUserInfo]);

  if(loading){
    return <div>loading...</div>
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/auth' element={<AuthRoute><Auth /></AuthRoute>} />
        <Route path='/chat' element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path='/profile' element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path='*' element={<Auth />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
