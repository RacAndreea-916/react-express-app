import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
    const [values, setValues] = useState({
        username:"",
        password:""
    })
    const navigate=useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = {
            username: values.username,
            password: values.password
        };
    
        try {
            const res = await axios.post("http://localhost:8081/addUser", userData);
    
            // Check if the status is 201 (User added successfully)
            if (res.status === 201) {
                alert("You registered successfully!! Now log in");
                navigate('/login');
            } else {
                // Handle other status codes, such as 400 (Bad Request)
                //console.error('Error adding user:', res.data.Message);
                alert(res.data.Message);
            }
        } catch (err) {
            // Handle network errors or other exceptions
            //console.error('Error adding user:', err);
            alert('The username already exists');
        }
    };
    
    
  return (
    <div>
      <div className='card p-4 shadow-sm'>
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
            <div className='mb-2'>
                <label htmlFor='username'>Username:</label>
                <input className = 'form-control' type = 'text' name='username' placeholder='Enter username'
                onChange={e=>setValues({...values,username:e.target.value} )} />
            </div>
            <div className='mb-2'>
                <label htmlFor='password'>Password:</label>
                <input className='form-control' type = 'password' name='username' placeholder='Enter password'
                onChange={e=>setValues({...values,password:e.target.value} )} />
            </div>
            <div>
                <button type='submit' className='btn btn-success'>Create account</button>
                <Link to={'/login'} className='btn btn-danger'>Back to login</Link>
            </div>
        </form>
      </div>
    </div>
  )
}

export default Register
