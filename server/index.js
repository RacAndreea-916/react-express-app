// import express from 'express';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import { v4 as uuidv4 } from 'uuid';
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const pool = require('./pool');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
// const cows = [
//     { id: 1, name: 'Marinela', age: 5, race: 'Angus', farmerID:1 },
//     { id: 2, name: 'Carmen', age: 3, race: 'Jersey', farmerID:1 },
//     { id: 3, name: 'Betsy', age: 4, race: 'Limousin', farmerID:2 },
//     { id: 4, name: 'Mama', age: 6, race: 'Holstein' , farmerID:2},
//     { id: 5, name: 'Vioric', age: 2, race: 'Hereford' , farmerID:2},
//   ];

// const farmers = [
//     { id: 1, name: 'John Doe', age: 40 },
//     { id: 2, name: 'Marius', age: 20 },
// ];



const app = express();
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your React app's origin
    credentials: true // Allow credentials (cookies) to be sent
  }));
app.use(bodyParser.json());
const PORT = 8081; 


// app.get('/cows',(req, res)=>{
//        res.send(cows);
// });

app.get('/cows', async (req, res) => {
    try {
      const client = await pool.connect();
     
      const result = await client.query(`SELECT * FROM Cows`);
      const cows = result.rows;
      client.release(); 
      res.json(cows);
    } catch (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  const verifyUser = (req, res, next)=>{
    const token =  req.cookies.token;
    if(!token){
        return res.json({Message: 'please provide a token'})
    }
    else{
        jwt.verify(token, 'secret-discret', (err, decoded)=>{
            if(err){
                 return res.json({Message: 'authentification error'})
            }
            else{
                req.username = decoded.username;
                next();
            }
        })
    }
}
  app.get('/userCows', verifyUser, async (req, res)=>{
    try {
        const username = req.username; // Get the username from the request
        const client = await pool.connect();
        const query = `SELECT * FROM Cows WHERE username =  $1`;
        const result = await client.query(query, [username]);
        const cows = result.rows;
        client.release(); 
        res.json(cows);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: 'Internal server error' });
    }
  })

  app.get('/cowsSorted', async (req, res) => {
    try {
      const client = await pool.connect();
     
      const result = await client.query(`SELECT * FROM Cows ORDER BY age `);
      const cows = result.rows;
      client.release(); 
      res.json(cows);
    } catch (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// app.get('/farmers',(req, res)=>{
//     res.send(farmers);
// });

app.get('/farmers', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query(`SELECT * FROM Farmers`);
      const farmers = result.rows;
      client.release(); 
      res.json(farmers);
    } catch (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// app.post('/cow',(req, res)=>{
//     const cow = req.body;
    
//     cows.push({...cow, id : uuidv4()});
    
//     res.status(201).send("cow added successfully");
    
// })
// app.post('/farmer',(req, res)=>{
//     const farmer = req.body;
    
//     farmers.push({...farmer, id : uuidv4()});
    
//     res.status(201).send("cow added successfully");
    
// })


app.post('/addUser', async (req, res) => {
    try {
        const user = req.body;
        const client = await pool.connect(); // Define client here

        const checkQuery = 'SELECT * FROM users WHERE username = $1';
        const values1 = [user.username];
        const checkResult = await client.query(checkQuery, values1);
        
        if (checkResult.rows.length > 0) {
            // Username already exists, send a message indicating that
            res.status(400).json({ Message: 'Username already exists' });
            //console.error("already exists");
        } else {
            const hashedPassword = await bcrypt.hash(user.password, saltRounds);
            const query = `INSERT INTO users(username, password) VALUES($1, $2)`;
            const values = [user.username, hashedPassword];
            await client.query(query, values);
            client.release();
            res.status(201).send("User added successfully");
        }
    } catch (err) {
        console.error('Error adding user:', err);
        res.status(500).json({ Message: 'Internal server error' });
    }
});


app.post('/cow',verifyUser,  async (req, res) => {
    try {
        const username = req.username
        const cow = req.body;
        const client = await pool.connect();
        const query = `INSERT INTO Cows(id, name, age, race, farmerId, username) VALUES($1, $2, $3, $4, $5, $6)`;
        const values = [cow.id, cow.name, cow.age, cow.race, cow.farmerId, username];
        await client.query(query, values);
        client.release();
        res.status(201).send("Cow added successfully");
    } catch (err) {
        console.error('Error inserting cow', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});





app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const client = await pool.connect();
        const query = 'SELECT * FROM users WHERE Username = $1 ';
        const values = [username];
        const result = await client.query(query, values);
        
        if (result.rows.length > 0) {
            const hashedPassword = result.rows[0].password;
            const match = await bcrypt.compare(password, hashedPassword);
            if(match){
            const token = jwt.sign({ username: username }, 'secret-discret', { expiresIn: '1h' });
            res.cookie('token', token);
            res.status(200).json({Status: 'Success'});
            }else {
                res.json({ Message: 'Invalid username or password' });
            }
        } else {
            res.json({ Message: 'Invalid username or password' });
        }
        
        client.release();
        
    } catch (err) {
        console.error('Error at login:', err); // Log the error
        res.status(500).json({ Message: 'Internal server error' });
    }
});

app.get('/', verifyUser, (req, res)=>{
    return res.json({Status: 'Success', username: req.username});
})

app.get('/logout', (req, res)=>{
    res.clearCookie('token');
    return res.json({Status: 'Success'});

})



app.post('/farmer', async (req, res) => {
    try {
        const farmer = req.body;
        const client = await pool.connect();
        const query = `INSERT INTO Farmers(id, name, age) VALUES($1, $2, $3)`;
        const values = [uuidv4(), farmer.name, farmer.age];
        await client.query(query, values);
        client.release();
        res.status(201).send("Farmer added successfully");
    } catch (err) {
        console.error('Error inserting farmer', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/read/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const client = await pool.connect();
        const query = `SELECT * FROM Cows WHERE id = $1`;
        const result = await client.query(query, [id]);
        const foundCow = result.rows[0];
        client.release();

        if (!foundCow) {
            res.status(404).send("Cow not found");
        } else {
            res.status(200).json(foundCow);
        }
    } catch (error) {
        console.error('Error reading cow:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/readFarmer/:id', async(req, res)=>
{
    const {id} = req.params;
    const client  = await pool.connect();
    const query = `SELECT * FROM Farmers WHERE id = $1`;
    const result = await client.query(query, [id]);
    const foundFarmer = result.rows[0];
    if(!foundFarmer){
        res.status(404).send("farmer not found");
        
    }
    else{
        res.status(200).send(foundFarmer);

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

app.patch('/update/:id', async(req, res) => {
    const {id} = req.params;
    const {name, age, race} = req.body;
    const client = await pool.connect();
        const query = `
            UPDATE Cows 
            SET name = $1, age = $2, race = $3 
            WHERE id = $4
        `;
        const values = [name, age, race, id]; // Values to be updated
        const result = await client.query(query, values);
        client.release();

    if (result.rowCount === 0) {
        res.status(404).send("cow not found");
    } else {
    
        res.status(200).send("cow updated successfully");
    }
});



app.patch('/updateFarmer/:id', async(req, res) => {
    const {id} = req.params;
    const {name, age} = req.body;
    const client = await pool.connect();
        const query = `
            UPDATE Farmers 
            SET name = $1, age = $2 
            WHERE id = $3
        `;
        const values = [name, age, id]; // Values to be updated
        const result = await client.query(query, values);
        client.release();

    if (result.rowCount === 0) {
        res.status(404).send("farmer not found");
    } else {
    
        res.status(200).send("farmer updated successfully");
    }
});


app.delete('/delete/:id', async(req, res)=>{
    const {id} = req.params;
    const client  = await pool.connect();
    const query = `DELETE FROM Cows WHERE id = $1`;
    const result = await client.query(query, [id]);
    client.release();
    if(result.rowCount === 0){
        res.status(404).send("cow not found");
        
    }else{
        res.status(204).send();
    }
})

app.delete('/deleteFarmer/:id', async(req, res)=>{
    const {id} = req.params;
    const client  = await pool.connect();
    const query = `DELETE FROM Farmers WHERE id = $1`;
    const result = await client.query(query, [id]);
    client.release();
    if(result.rowCount === 0){
        res.status(404).send("farmer not found");
        
    }else{
        res.status(204).send();
    }
})

app.listen(PORT, ()=>{
    console.log(`server running on port: http://localhost:${PORT}`);
})

module.exports = app;