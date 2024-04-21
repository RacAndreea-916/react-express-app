import { Button } from 'bootstrap';
import { useEffect, useState } from 'react';
import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getAllItems, syncWithServer, addItem, deleteItem, clearIndexedDB } from './offlineStorage';



const exportDataToJson = (data) => {
  
  const jsonData = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');

  link.href = url;

  link.download = 'data.json';

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
};
function Home() {
    

    const [items, setItems] = useState([]);
    const [farmers, setFarmers] = useState([]);

    const handleSort = () =>{
      axios.get("http://localhost:8081/cowsSorted")
      .then(res=>setItems(res.data))
      .catch(err => {
        if(err.message.includes("NetworkError"))
          alert("internet down")
        else alert("server is down")
        setTimeout(loadData(), 5000) 
      })
      
      axios.get("http://localhost:8081/farmers")
      .then(res=>setFarmers(res.data))
      .catch(err => {
        if(err.message.includes("NetworkError"))
          alert("internet down")
        else alert("server is down")
        setTimeout(loadData(), 5000) 
      })
    }

    // const loadData = () => {
    //   axios.get("http://localhost:8081/cows")
    //   .then(res=>setItems(res.data))
    //   .catch(err => {
    //     if(err.message.includes("NetworkError"))
    //       alert("internet down")
    //     else alert("server is down")
    //     setTimeout(loadData(), 5000) 
    //   })

    //   axios.get("http://localhost:8081/farmers")
    //   .then(res=>setFarmers(res.data))
    //   .catch(err => {
    //     if(err.message.includes("NetworkError"))
    //       alert("internet down")
    //     else alert("server is down")
    //     setTimeout(loadData(), 5000) 
    //   })
    // }

  const [isOffline, setIsOffline] = useState(false);

  const loadData = async () => {
    
    try {
      const response = await axios.get('http://localhost:8081/cows');
      setItems(response.data);
      setIsOffline(false);
  
      for (const item of response.data) {
        await addItem(item); // Ensure these items are correctly added to IndexedDB
      }
    } catch (err) {
      console.error('Error fetching cows from server:', err);
      setIsOffline(true);
  
      const offlineItems = await getAllItems();
      console.log('Offline items:', offlineItems); // Inspect offline items
      setItems(offlineItems);
    }
  };
  
  const loadFarmersFromServer = async () => {
    try {
      const response = await axios.get('http://localhost:8081/farmers');
      setFarmers(response.data);
    } catch (err) {
      console.error('Error fetching farmers from server:', err);
      setIsOffline(true);
      // Add any offline handling for farmers here
    }
  };

  useEffect(() => {
    loadData();
    loadFarmersFromServer();

    const handleOnline = async () => {
      console.log('Back online, syncing with the server...');
      await syncWithServer() // Sync offline data with the server
      loadCowsFromServer(); // Reload data from the server
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

    // useEffect(()=>{
    //   loadData();
    // },[]);

    // const handleDelete=(id)=>{
    //    axios.delete("http://localhost:8081/delete/"+id)
    //    .then(res => {location.reload();
    //                   alert("cow deleted!!")})
    //    .catch(err =>alert("error deleting cow"))
    // }

    // const handleFarmerDelete=(id)=>{
    //   axios.delete("http://localhost:8081/deleteFarmer/"+id)
    //    .then(res => {location.reload();
    //                   alert("farmer deleted!!")})
    //    .catch(err =>alert("error deleting farmer"))
    // }
    const handleDelete = async (id) => {
      if (isOffline) {
        // Delete item from IndexedDB when offline
        await deleteItem(id);
        const updatedItems = items.filter(item => item.id !== id);
        setItems(updatedItems);
      } else {
        // Delete item from server and IndexedDB when online
        await axios.delete(`http://localhost:8081/delete/${id}`);
        await deleteItem(id);
        location.reload();
      }
    };
  
    

  const handleExport = ()=>{
    exportDataToJson(items);
  }


    
//   const [filterRace, setFilterRace] = useState('');
//   const handleFilterChange = (event) => {
//     setFilterRace(event.target.value);
// }


//const filteredItems = filterRace ? items.filter(item => item.race === filterRace) : items;
//const filteredItems = sortedValues ? items.sort((a,b)=>a.localeCompare(b.name)) : items;
  return (
    <div className='d-flex justify-content-center align-items-center bg-light vh-100'>
      <div style={{flexGrow: 1}}>
        <h1>Cows</h1>
        <div className='w-100 rounded bg-white border shadow p-4'>
          <div className='d-flex justify-content-end'>
            
            <button className='btn btn-primary' onClick={handleExport}>Export</button>
            <Link to="/create" className='btn btn-success'>Add +</Link>
            <button className="btn btn-sm btn-danger" onClick={handleSort}>Sort</button>
          </div>
          <table className='table table-striped'>
            <thead>
              <tr>
                
                <th style={{ width: '25%' }}>Name</th>
                <th style={{ width: '25%' }}>Age</th>
                <th style={{ width: '25%' }}>Race</th>
                
                <th style={{ width: '45%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  
                  <td>{item.name}</td>
                  <td>{item.age}</td>
                  <td>{item.race}</td>
                  <td>
                    <div className="btn-group btn-group-justified">
                      <Link to={`/read/${item.id}`} className="btn btn-sm btn-primary">Read</Link>
                      <Link to ={`/update/${item.id}`} className="btn btn-sm btn-warning">Update</Link>
                      <button className="btn btn-sm btn-danger" onClick={()=>handleDelete(item.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{flexGrow: 1}}>
        <h1>Farmers</h1>
        <div className='w-100 rounded bg-white border shadow p-4'>
          <div className='d-flex justify-content-end'>
            <Link to="/createFarmer" className='btn btn-success'>Add +</Link>
          </div>
          <table className='table table-striped'>
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Name</th>
                <th style={{ width: '25%' }}>Age</th>
              </tr>
            </thead>
            <tbody>
              {farmers.map(farmer => (
                <tr key={farmer.id}>
                  <td>{farmer.name}</td>
                  <td>{farmer.age}</td>
                  <td>
                    <div className="btn-group btn-group-justified">
                      <Link to={`/readFarmer/${farmer.id}`} className="btn btn-sm btn-primary">Read</Link>
                      <Link to ={`/updateFarmer/${farmer.id}`} className="btn btn-sm btn-warning">Update</Link>
                      <button className="btn btn-sm btn-danger" onClick={()=>handleFarmerDelete(farmer.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>


        
  
    
  )

}
export default Home
