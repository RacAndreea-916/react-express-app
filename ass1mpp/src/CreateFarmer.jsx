import React, { useState } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import axios from 'axios';
function CreateFarmer() {

  

    const navigate = useNavigate();
    const [values, setValues] = useState({
        name:"",
        age:"",
       
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const farmerData = {
          name: values.name,
          age: parseInt(values.age) // Ensure age is parsed as integer
      };
  
      axios.post('http://localhost:8081/farmer', farmerData)
          .then(res => {
              console.log(res);
              navigate('/');
          })
          .catch(err => console.error("Error adding farmer:", err));
  }

  return (
    <div className='container-fluid bg-light min-vh-100 d-flex flex-column justify-content-center align-items-center'> 
      <h1>Add a farmer</h1>
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

        
        
        <div className='btn-group'>
            <button type='submit' className='btn btn-success' >Submit</button>
            <Link to="/" className='btn btn-primary ms-3'>Back</Link>
        </div>
        </form>
      </div>
    </div>
  )
}

export default CreateFarmer
