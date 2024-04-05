import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './Home'
import Create from './Create'
import Read from './Read'
import Update from './Update'
import React from 'react'

function App() {

  
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path ='/' element={<Home /*items={items} setItems={setItems}*/ />}></Route>
        <Route path ='/create' element={<Create/>}></Route>
        <Route path ={`/update/:id`}  element={<Update/>}></Route>
        <Route path={`/read/:id`} element={<Read />} />
        
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App