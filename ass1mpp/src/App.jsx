import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './Home'
import Create from './Create'
import Read from './Read'
import Update from './Update'
import React from 'react'
import CreateFarmer from './CreateFarmer'
import ReadFarmer from './ReadFarmer'
import UpdateFarmer from './UpdateFarmer'
import Login from './Login'
import Register from './Register'
import HomePage from './HomePage'
function App() {

  
  return (
    <div>
      <BrowserRouter>
      <Routes>
      <Route path ='/' element={<HomePage />}></Route>
        <Route path ='/home' element={<Home />}></Route>
        <Route path ='/create' element={<Create/>}></Route>
        <Route path ={`/update/:id`}  element={<Update/>}></Route>
        <Route path={`/read/:id`} element={<Read />} />
        <Route path ='/createFarmer' element={<CreateFarmer/>}></Route>
        <Route path ={`/updateFarmer/:id`}  element={<UpdateFarmer/>}></Route>
        <Route path={`/readFarmer/:id`} element={<ReadFarmer />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App