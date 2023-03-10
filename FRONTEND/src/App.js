import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate, } from "react-router-dom";


//import Users  from './user/pages/Users';
//import NewPlace from './places/pages/NewPlace';
//import UserPlaces from './places/pages/UserPlaces';
import MainNavigation from './shared/components/Navigations/MainNavigation';
//import UpdatePlace from './places/pages/UpdatePlace';
//import Auth from './user/pages/Auth'
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';


const Users = React.lazy(() => import('./user/pages/Users'))
const NewPlace = React.lazy(() => import('./places/pages/NewPlace'))
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'))
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace'))
const Auth = React.lazy(() => import('./user/pages/Auth'))


const App = () => {
    const { token, login, logout, userId} =  useAuth()

    let routes

    if (token) {
        routes = (
            <React.Fragment>
         
                 <Route path="/"  exact element={<Users/>}>           
                  </Route>
    
                  <Route path="/:userId/places" exact element={<UserPlaces />}>         
                  </Route>
    
                  <Route path="/places/new" element={<NewPlace />}>         
                  </Route>
    
                  <Route path="/places/:placeId" element={<UpdatePlace />}>         
                  </Route>
    
                  <Route path="*" element={<Navigate to="/" />} />
      
            </React.Fragment>
            )
    } else {
        routes = (
            <React.Fragment>
           
                <Route path="/"  exact element={<Users/>}>           
                  </Route>
    
                <Route path="/:userId/places" exact element={<UserPlaces />}>         
                  </Route>
    
                <Route path="/auth" element={<Auth />}>         
                  </Route> 
                
                <Route path="*" element={<Navigate to="/auth" />} />
         
                  
            </React.Fragment>
            )
    }

  return (
      <AuthContext.Provider value={{isLoggedIn: !!token, token: token, userId: userId,  login: login, logout: logout }}>
        
          <Router>
          <MainNavigation />
          <main>
          <React.Suspense fallback={<div className='center'><LoadingSpinner /></div>}>
            <Routes>{routes}</Routes>
            </React.Suspense>  
          </main>
      </Router>
      
      </AuthContext.Provider>
      
  );
}

export default App;

