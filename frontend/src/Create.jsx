import React, { useState, useEffect } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import axios from 'axios';
import { addItemToSyncQueue, addItem } from './offlineStorage';
import { v4 as uuidv4 } from 'uuid'; 
import {  getAllItemsFromLocalStorage, syncWithServerLocal, addItemToLocalStorageWithoutDuplicates } from './localStorage';

const SERVER_URL = "http://localhost:8081/cows"; 
function Create() {

  const [isServerReachable, setIsServerReachable] = useState(false);
    const navigate = useNavigate();
    const [values, setValues] = useState({
      
        name:"",
        age:"",
        race:"",
        farmerId:""
    });

    useEffect(() => {
      const checkServerConnectivity = async () => {
        try {
          await axios.get(SERVER_URL);
          setIsServerReachable(true); // Server is reachable
        } catch (error) {
          setIsServerReachable(false); // Server is not reachable
        }
      };
  
      checkServerConnectivity(); // Check server connectivity on component mount
    }, []);
    
    // const handleSubmit = async (e) => {
    //   e.preventDefault();
    //   const cowData = {
    //     id: uuidv4(),
    //     name: values.name,
    //     age: parseInt(values.age), // Convert age to integer
    //     race: values.race,
    //     farmer_id: values.farmerId,
    //   };
  
    //   if (!isServerReachable) {
    //     // If server is not reachable, add to sync queue
    //     await addItemToSyncQueue(cowData);
    //     await addItem(cowData);
    //     alert('Server is not reachable. Data stored locally for syncing later.');
    //     navigate('/'); // Navigate to the home page
    //   } else {
    //     // Try to add to server
    //     try {
    //       await axios.post("http://localhost:8081/cow", cowData);
    //       alert('Item added successfully!');
    //       navigate('/');
    //     } catch (error) {
    //       console.error('Error adding item:', error);
    //       await addItemToSyncQueue(cowData);
    //       await addItem(cowData); // If error occurs, add to sync queue
    //       alert('Error adding item. Data stored locally for syncing later.');
    //     }
    //   }
    // };
    const handleSubmit = async (e) => {
      e.preventDefault();
      const cowData = {
        id: uuidv4(),
        name: values.name,
        age: parseInt(values.age), // Convert age to an integer
        race: values.race,
        farmerId: values.farmerId,
      };
  
      if (!isServerReachable) {
        // If the server is down, add to local storage
        addItemToLocalStorageWithoutDuplicates('cows', cowData); // Store in local storage for later syncing
        alert('Server is not reachable. Data stored locally for syncing later.');
        navigate('/home'); // Navigate to the home page
      } else {
        try {
          // If the server is reachable, submit the data
          await axios.post("http://localhost:8081/cow", cowData); // Send data to the server
          alert('Item added successfully!');
          navigate('/');
        } catch (error) {
          console.error('Error adding item:', error);
          addItemToLocalStorageWithoutDuplicates('cows', cowData); // Store in local storage if error occurs
          alert('Error adding item. Data stored locally for syncing later.');
        }
      }
    };
  
  
  

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
        
        <div className='mb-2'>
            <label htmlFor='farmerId'>Name:</label>
            <input type='text' name='farmerId' className='form-control' placeholder='Enter farmer id'
            onChange={e=>setValues({...values,farmerId:e.target.value} )} />
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
