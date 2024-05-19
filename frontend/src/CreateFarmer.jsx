import React, { useState, useEffect } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import axios from 'axios';
import { updateItemInLocalStorage, addItemToLocalStorageWithoutDuplicates, deleteItemFromLocalStorage } from './localStorage';
function CreateFarmer() {

  
  const [isServerReachable, setIsServerReachable] = useState(false);
    const navigate = useNavigate();
    const [values, setValues] = useState({
        name:"",
        age:"",
       
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

    const handleSubmit = async(e) => {
      e.preventDefault();
      const farmerData = {
          name: values.name,
          age: parseInt(values.age) // Ensure age is parsed as integer
      };
  
      if (!isServerReachable) {
        // If the server is down, add to local storage
        addItemToLocalStorageWithoutDuplicates('farmers', farmerData); // Store in local storage for later syncing
        alert('Server is not reachable. Data stored locally for syncing later.');
        navigate('/home'); // Navigate to the home page
      } else {
        try {
          // If the server is reachable, submit the data
          await axios.post("http://localhost:8081/farmer", farmerData); // Send data to the server
          alert('Item added successfully!');
          navigate('/');
        } catch (error) {
          console.error('Error adding item:', error);
          addItemToLocalStorageWithoutDuplicates('farmers', farmerData); // Store in local storage if error occurs
          alert('Error adding item. Data stored locally for syncing later.');
        }
      }
    };

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
