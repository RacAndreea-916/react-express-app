import React, { useEffect, useState } from 'react'
import Login from './Login'
import Home from './Home';
import { Link } from 'react-router-dom';
import axios from 'axios';
function HomePage() {

    const [auth, setAuth] = useState(false);
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    axios.defaults.withCredentials=true;
    useEffect(()=>{
        axios.get("http://localhost:8081")
        .then(res=>{
            if(res.data.Status === 'Success'){
                setAuth(true);
                setUsername(res.data.username);
            }
            else{
                setMessage(res.data.Message);
                setAuth(false);
            }
        })
    },[])

    const handleLogout = () =>{
        axios.get("http://localhost:8081/logout")
        .then(res => {
            if(res.data.Status === 'Success'){
            location.reload(true);}
            else{
                alert('error');
            }
        }).catch(err=>console.log(err));
    }

  return (
    auth ?
    <div className='mb-2'>
        <h3>Hello {username}!</h3>
        <button className='btn btn-primary'  onClick={handleLogout}>Logout</button>
        <Home />
    </div>
    :
    <div className='mb-2'>
       <h3>PLease login or create an account</h3>
        <Link to='/login' className='btn btn-primary'>Login</Link>
        <Link to = '/register'className='btn btn-secondary' >Create Account</Link>
    </div>
  )
}

export default HomePage
