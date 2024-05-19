import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

function Read() {
  
  const [cow, setCow] = useState([]);
  const {id} = useParams();
  useEffect(() => {
    axios.get('http://localhost:8081/read/' + id)
      .then(res => {
        
          setCow(res.data);
      })
      .catch(err => {console.log(err)
      alert("cannot read cow, the id does not exist")});
  }, [id]);
 


  return (
    <div className='container-fluid bg-light min-vh-100 d-flex flex-column justify-content-center align-items-center'>
      <h1 className='mb-4'>Cow Details</h1>
      <div className='card p-4 shadow-sm'>
        <ul className='list-unstyled'>
          <li className='mb-3'>ID: {cow.id}</li>
          <li className='mb-3'>Name: {cow.name}</li>
          <li className='mb-3'>Age: {cow.age}</li>
          <li className='mb-3'>Race: {cow.race}</li>
          <li className='mb-3'>Farmer Id: {cow.farmerid}</li>
        </ul>
        <Link to="/" className='btn btn-primary'>Back</Link>
      </div>
    </div>
  );
  
}

export default Read
