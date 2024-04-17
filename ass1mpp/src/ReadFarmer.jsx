import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

function ReadFarmer() {
  
  const [farmer, setFarmer] = useState([]);
  const {id} = useParams();
  useEffect(() => {
    axios.get('http://localhost:8081/readFarmer/' + id)
      .then(res => {
        
          setFarmer(res.data);
      })
      .catch(err => {console.log(err)
      alert("cannot read farmer, the id does not exist")});
  }, [id]);
 


  return (
    <div className='container-fluid bg-light min-vh-100 d-flex flex-column justify-content-center align-items-center'>
      <h1 className='mb-4'>Farmer Details</h1>
      <div className='card p-4 shadow-sm'>
        <ul className='list-unstyled'>
          <li className='mb-3'>ID: {farmer.id}</li>
          <li className='mb-3'>Name: {farmer.name}</li>
          <li className='mb-3'>Age: {farmer.age}</li>
          
        </ul>
        <Link to="/" className='btn btn-primary'>Back</Link>
      </div>
    </div>
  );
  
}

export default ReadFarmer
