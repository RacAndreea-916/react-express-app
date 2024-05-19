import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios';
import { updateItemInLocalStorage, getItemFromLocalStorageById } from './localStorage';
function UpdateFarmer({items, updateCow}) {
    

   const {id} = useParams();
   useEffect(() => {
    axios.get(`http://localhost:8081/readFarmer/${id}`)
        .then(res => {
            console.log(res);
            setValues({
                name: res.data.name,
                age: res.data.age,
                
            });
        })
        .catch(err => {
            console.error(err);
            const localData = getItemFromLocalStorageById('farmers', id);
        if (localData) {
          setValues({
            name: localData.name,
            age: localData.age,
            
          });
        }
            alert("Error reading farmer data or farmer does not exist");
        });
}, [id]);

  const [values, setValues] = useState({
    name: "",
    age: ""
    
});
    
const handleSubmit = (e) => {
  e.preventDefault();
  axios.patch(`http://localhost:8081/updateFarmer/${id}`, values)
      .then(res => {
          console.log(res);
          updateItemInLocalStorage('farmers', { ...values, id });
          alert("Farmer updated successfully");
      })
      .catch(err => {
          console.error(err);
          updateItemInLocalStorage('farmers', { ...values, id });
          alert("Error updating farmer or farmer does not exist");
      });
};
    

  return (
    <div className='container-fluid bg-light min-vh-100 d-flex flex-column justify-content-center align-items-center'>
        <h1>Update</h1>
        <form onSubmit={handleSubmit}>
            <input type='text' className='form-control'  value={values.name} onChange={e=>setValues({...values, name:e.target.value})} />
            <input type='text' className='form-control'  value={values.age} onChange={e=>setValues({...values,age:e.target.value} )}/>
            <div className='btn-group'>
                <button type='submit' className='btn btn-success' >Submit</button>
                <Link to="/" className='btn btn-primary ms-3'>Back</Link>
            </div>
        </form>
    </div>
  )
}

export default UpdateFarmer
