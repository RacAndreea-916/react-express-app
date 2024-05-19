import { Button } from 'bootstrap';
import { useEffect, useState } from 'react';
import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getAllItems, syncWithServer, addItem,  clearIndexedDB,  openDatabase } from './offlineStorage';
import { syncWithServerLocalFarmers,deleteItemFromLocalStorage,addItemToLocalStorageWithoutDuplicates, syncWithServerLocal, getAllItemsFromLocalStorage, clearLocalStorage, removeDuplicatesFromLocalStorage } from './localStorage';



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
    const [isOffline, setIsOffline] = useState(false);
    const storedItems = JSON.parse(localStorage.getItem('items')) || [];

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
    //   .then(data=>{
    //     const d = data;
    //     if(storedItems.length !==0){
    //       for(let i in storedItems){
    //         axios.post("http://localhost:8081/cow", {...i})
    //         .then(res=>alert(res.status))
    //         .catch(err=>{console.log(err);})
    //         d.push(i);
    //       }
    //       localStorage.removeItem('items')
    //     }
    //   })
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

    const loadData = async () => {
      try {
        const response = await axios.get('http://localhost:8081/userCows', {
      withCredentials: true, // Include cookies in the request
    });
        setItems(response.data);
    
        
        response.data.forEach((item) => {
          addItemToLocalStorageWithoutDuplicates('cows', item);
        });
    
        
        removeDuplicatesFromLocalStorage('cows');
    
        setIsOffline(false);
      } catch (error) {
        alert("server is down, data savel locally");
        console.error('Error fetching cows from server:', error);
        setIsOffline(true);
    
        // Load from local storage if server is down
        const offlineItems = getAllItemsFromLocalStorage('cows');
        setItems(offlineItems);
      }
    };
  
    const loadFarmers = async () => {
      try {
        const response = await axios.get('http://localhost:8081/farmers');
        setFarmers(response.data);
        setIsOffline(false);
        response.data.forEach((item) => {
          addItemToLocalStorageWithoutDuplicates('farmers', item);
        });
    
        
        removeDuplicatesFromLocalStorage('farmers');
    
        
      } catch (error) {
        setIsOffline(true);
        const offlineItems = getAllItemsFromLocalStorage('farmers');
        setFarmers(offlineItems);
      }
    };
  
    const syncData = async () => {
      if (!isOffline) {
        await syncWithServerLocal('cows', 'http://localhost:8081/cow'); 
        await syncWithServerLocalFarmers('farmers', 'http://localhost:8081/farmer'); 
      }
    };
  
    const handleOnline = async () => {
      console.log('App is back online. Syncing data...');
      setIsOffline(false);
      await syncData();
      await loadData();
      await loadFarmers(); // Reload data after syncing
    };
  
    useEffect(() => {
      window.addEventListener('online', handleOnline); // Handle when the app goes back online
  
      loadData();
      loadFarmers();
  
      return () => {
        window.removeEventListener('online', handleOnline); // Cleanup event listener
      };
    }, []);
  
  // const loadData = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:8081/cows");
  //     setItems(response.data);
  //     setIsOffline(false);
      
      
  //     localStorage.setItem('cows', JSON.stringify(response.data));
  //     for (const item of response.data) {
  //             addItemToLocalStorage(item); // Ensure these items are correctly added to IndexedDB
  //     }


  //     // Log the parsed array/object to the console

  //   } catch (error) {
  //     setIsOffline(true);
  //     const offlineItems = getAllItemsFromLocalStorage('cows');
  //     console.log(offlineItems); // Load from local storage
  //     setItems(offlineItems);
  //   }
  // };

  // const checkServerStatus = async () => {
  //   try {
  //     await axios.get("http://localhost:8081/cows"); // Ping server
  //     if (!isOffline) {
  //       await syncWithServerLocal('cows', "http://localhost:8081/cow"); // Sync with server when back online
  //       await loadData(); // Refresh data
  //       setIsOffline(false);
  //       console.log("server ok");
  //     }
  //   } catch (error) {
  //     setIsOffline(true);
  //   }
  // };

  // useEffect(() => {
  //   loadFarmersFromServer();
  //   loadData(); // Load initial data
  //   //const serverCheckInterval = setInterval(checkServerStatus, 10000); // Check server status every 10 seconds
  //   checkServerStatus();
  //   // return () => {
  //   //   clearInterval(serverCheckInterval); // Cleanup
  //   // };
  // }, []);
  // const loadData = async () => {
    
  //   try {
  //     const response = await axios.get('http://localhost:8081/cows');
  //     setItems(response.data);
  //     setIsOffline(false);
  //     //await syncWithServer();
  //     await clearIndexedDB();
  
  //     for (const item of response.data) {
  //       await addItem(item); // Ensure these items are correctly added to IndexedDB
  //     }
  //   } catch (err) {
     
  //     //console.error('Error fetching cows from server:', err);
  //     console.log("server is down");
  //     setIsOffline(true);
  
  //     const offlineItems = await getAllItems();
  //     console.log('Offline items:', offlineItems); // Inspect offline items
  //     setItems(offlineItems);
  //   }
  // };
  
  const loadFarmersFromServer = async () => {
    try {
      const response = await axios.get('http://localhost:8081/farmers');
      setFarmers(response.data);
    } catch (err) {
      //console.error('Error fetching farmers from server:', err);
      setIsOffline(true);
      // Add any offline handling for farmers here
    }
  };

  // const handleOnline = async () => {
  //   try {
      
  //     console.log('Back online, syncing with the server...');
  //     await syncWithServer(); // Sync offline data with the server    
  //     await loadData(); 
  //     //await clearIndexedDB();// Reload data from server
  //   } catch (error) {
  //     console.error("Error during online handling:", error);
  //     // Implement retry logic or offline handling here
  //   }
  // };
  
  

  // useEffect(() => {
  //   loadData();
  //   loadFarmersFromServer();
  //   //clearIndexedDB();
  //   // if(!isOffline)
  //   //   {handleOnline();
  //   //   }
   
   
  // }, []);

    // useEffect(()=>{
    //   loadData();
    // },[]);

    const handleDelete=(id)=>{
       axios.delete("http://localhost:8081/delete/"+id)
       .then(res => {location.reload();
                      alert("cow deleted!!");
                    deleteItemFromLocalStorage('cows',id)})
       .catch(err =>alert("error deleting cow"))
    }

    const handleFarmerDelete=(id)=>{
      axios.delete("http://localhost:8081/deleteFarmer/"+id)
       .then(res => {location.reload();
                      alert("farmer deleted!!");
                      deleteItemFromLocalStorage('farmers',id)})
       .catch(err =>alert("error deleting farmer"))
    }
    
    
  
    

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
