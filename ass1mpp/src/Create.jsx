import React, { useState } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import axios from 'axios';
function Create() {

  

    const navigate = useNavigate();
    const [values, setValues] = useState({
        name:"",
        age:"",
        race:""
    });

    const handleSubmit =  (e) =>{
        e.preventDefault();
        axios.post('http://localhost:8081/cow', values)
        .then(res=>{console.log(res);
          navigate('/')})
        .catch(err=> console.log("error"))
    }

  return (
    <div className='container-fluid bg-light min-vh-100 d-flex flex-column justify-content-center align-items-center'> 
      <h1>Add a cow</h1>
      <div  className='card p-4 shadow-sm'>
      <form onSubmit={handleSubmit}>
        <div className='mb-2'>
            <label htmlFor='name'>Name:</label>
            <input type='text' name='name' className='form-control' placeholder='Enter name'
            onChange={e=>setValues({...values,name:e.target.value} )} />
        </div>

        <div className='mb-2'>
            <label htmlFor='age'>Age:</label>
            <input type='text' name='age'  className='form-control' placeholder='Enter age'
            onChange={e=>setValues({...values,age:e.target.value} )} />
        </div>

        <div className='mb-2'>
            <label htmlFor='name'>Name:</label>
            <input type='text' name='race' className='form-control' placeholder='Enter race'
            onChange={e=>setValues({...values,race:e.target.value} )} />
        </div>
        
        <div className='btn-group'>
            <button type='submit' className='btn btn-success' >Submit</button>
            <Link to="/" className='btn btn-primary ms-3'>Back</Link>
        </div>
        </form>
      </div>
    </div>
  )
}

export default Create
