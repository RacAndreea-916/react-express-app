// import express from 'express';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import { v4 as uuidv4 } from 'uuid';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const cows = [
    { id: 1, name: 'Marinela', age: 5, race: 'Angus' },
    { id: 2, name: 'Carmen', age: 3, race: 'Jersey' },
    { id: 3, name: 'Betsy', age: 4, race: 'Limousin' },
    { id: 4, name: 'Mama', age: 6, race: 'Holstein' },
    { id: 5, name: 'Vioric', age: 2, race: 'Hereford' },
  ];



const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = 8081; 


app.get('/',(req, res)=>{
       res.send(cows);
});


app.post('/cow',(req, res)=>{
    const cow = req.body;
    
    cows.push({...cow, id : uuidv4()});
    
    res.status(201).send("cow added successfully");
    
})

app.get('/read/:id', (req, res)=>
{
    const {id} = req.params;
    const foundCow = cows.find(cow => cow.id == id);
    if(!foundCow){
        res.status(404).send("cow not found");
        
    }
    else{
        res.status(200).send(foundCow);

    }     
    // console.log(foundCow);

})

// app.put('/update/:id', (req, res)=>{
//     const {id} = req.params;
//     const {name, age, race} = req.body;

//     const cowToUpdate = cows.find(cow => cow.id == id);
//     if(!cowToUpdate){
//         res.status(404).send("cow not found");
//     }
//     cowToUpdate.name = name;
//     cowToUpdate.age = age;
//     cowToUpdate.race = race;

//     res.status(200).send("cow updated successfully");

// })

app.patch('/update/:id', (req, res) => {
    const { id } = req.params;
    const { name, age, race } = req.body;

    const cowToUpdateIndex = cows.findIndex(cow => cow.id == id);
    if (cowToUpdateIndex === -1) {
        res.status(404).send("cow not found");
    } else {
        const cowToUpdate = cows[cowToUpdateIndex];

        if (name !== undefined) {
            cowToUpdate.name = name;
        }
        if (age !== undefined) {
            cowToUpdate.age = age;
        }
        if (race !== undefined) {
            cowToUpdate.race = race;
        }

        res.status(200).send("cow updated successfully");
    }
});


app.delete('/delete/:id', (req, res)=>{
    const {id} = req.params;
    const cowToDelete = cows.findIndex(cow => cow.id == id);
    if(cowToDelete == -1){
        res.status(404).send("cow not found");
        
    }

    cows.splice(cowToDelete, 1);
    res.status(204).send();
})

app.listen(PORT, ()=>{
    console.log(`server running on port: http://localhost:${PORT}`);
})

module.exports = app;