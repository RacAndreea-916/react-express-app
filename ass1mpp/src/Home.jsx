import { Button } from 'bootstrap';
import { useEffect, useState } from 'react';
import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import axios from 'axios';


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


    const loadData = () => {
      axios.get("http://localhost:8081/cows")
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

    useEffect(()=>{
      loadData();
    },[]);

    const handleDelete=(id)=>{
       axios.delete("http://localhost:8081/delete/"+id)
       .then(res => {location.reload();
                      alert("cow deleted!!")})
       .catch(err =>alert("error deleting cow"))
    }

    const handleFarmerDelete=(id)=>{
      axios.delete("http://localhost:8081/deleteFarmer/"+id)
       .then(res => {location.reload();
                      alert("farmer deleted!!")})
       .catch(err =>alert("error deleting farmer"))
    }
    

    const [selectedItems, setSelectedItems] = useState([]);

    const handleCheckboxChange = (id)=>{
      if(selectedItems.includes(id)){
        setSelectedItems(selectedItems.filter(itemId => itemId !== id));
      }
      else{
        setSelectedItems([...selectedItems, id]);
      }
    }

    const handleBulkDelete = () => {
      const confirm = window.confirm("Are you sure you want to delete?");
      if (confirm) {
          const newItems = items.filter(item => !selectedItems.includes(item.id));
          setItems(newItems);
          setSelectedItems([]);
          localStorage.setItem('items', JSON.stringify(newItems));
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
            <button className='btn btn-danger mr-2' onClick={handleBulkDelete} disabled={selectedItems.length === 0}>Bulk Delete</button>
            <button className='btn btn-primary' onClick={handleExport}>Export</button>
            <Link to="/create" className='btn btn-success'>Add +</Link>
          </div>
          <table className='table table-striped'>
            <thead>
              <tr>
                <th style={{width: '15%'}}>
                  <input type='checkbox' onChange={() => setSelectedItems(selectedItems.length === items.length ? [] : items.map(item => item.id))} />
                </th>
                <th style={{ width: '25%' }}>Name</th>
                <th style={{ width: '25%' }}>Age</th>
                <th style={{ width: '25%' }}>Race</th>
                
                <th style={{ width: '45%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>
                    <input type='checkbox' checked={selectedItems.includes(item.id)} onChange={() => handleCheckboxChange(item.id)}/>
                  </td>
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
