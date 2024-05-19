import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function Login() {

    const [values, setValues] = useState({
        username:"",
        password:""
    });
    axios.defaults.withCredentials=true;
    const navigate = useNavigate();
    const handleSubmit = (e)=>{
        e.preventDefault();
        axios.post("http://localhost:8081/login", values).
        then(
            (res)=>{
                if(res.data.Status === "Success")
                    navigate('/');
                else
                    alert(res.data.Message);
            
    })
    }

  return (
    <div>
      <div className='card p-4 shadow-sm'>
        <h2>SIgn in</h2>
        <form onSubmit={handleSubmit}>
            <div className='mb-2'>
                <label htmlFor='username'>Name:</label>
                <input type='text' name='username' className='form-control' placeholder='Enter name'
                onChange={e=>setValues({...values,username:e.target.value} )}
                autoComplete="off" />
            </div>
            <div className='mb-2'>
                <label htmlFor='passsword'>Password:</label>
                <input type='password' name='password' className='form-control' placeholder='Enter name'
                onChange={e=>setValues({...values,password:e.target.value} )}
                autoComplete="off" />
            </div>
            <button type='submit' className='btn btn-success' >Sign in</button>
            <Link to={'/register'} className='btn btn-info'>Register</Link>
        </form>
      </div>
    </div>
  )
}
