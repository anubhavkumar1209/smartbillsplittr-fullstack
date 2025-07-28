import React,{createContext,useContext,useState,useEffect} from 'react';
import { authService } from '../services/authService';

const AuthContext=createContext();
export const useAuth=()=>useContext(AuthContext);

export function AuthProvider({children}){
  const [user,setUser]=useState(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    const token=localStorage.getItem('token');
    if(token){ authService.setAuthToken(token); setUser({token}); }
    setLoading(false);
  },[]);

  const login=async creds=>{
    const res=await authService.login(creds);
    const { token }=res.data;
    localStorage.setItem('token',token);
    authService.setAuthToken(token);
    setUser({token});
  };

  const logout=()=>{
    localStorage.removeItem('token');
    authService.setAuthToken(null);
    setUser(null);
  };

  return(
    <AuthContext.Provider value={{user,loading,login,logout}}>
      {children}
    </AuthContext.Provider>
  );
}
