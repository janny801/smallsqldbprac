//using mysql2 

import mysql from 'mysql2/promise'
import express from 'express'; //used for showing on the browser 


const app = express(); //create express app
//instance of express framework to build and manage a web application 
const port = 3000; 

const pool = mysql.createPool({
    host: '127.0.0.1', 
    user: 'root', 
    password: 'janred0801', 
    database: 'notes_app'

}); 
//use promises instead of default callback function 


//show columns of notes_app 
async function showColumns(){
    try {
        const connection = await pool.getConnection(); // get connection from the pool 


        //check if notes_app database exists 
        const [databases] = await connection.query('SHOW DATABASES'); 
        const databaseExists = databases.some((db)=> db.Database === 'notes_app'); 

        //if doesnt exist 
        if(!databaseExists){
            console.log("database 'notes_app' doesnt exist"); 
            connection.release(); 
            return; 
        }

        //cont if it does exist 
        console.log("database : notes_app"); 


        //get all tables in the 'notes_app' database 
        const [tables] = await connection.query('SHOW TABLES'); 
        if(tables.length ===0){
            console.log("no tables found in 'notes_app'"); 
            connection.release(); 
            return; 
        }

        // query to fetch all rows from the notes table 

        const[rows] = await connection.query('select * from notes;'); 

        if(rows.length ===0 ){
            console.log('no notes found in the notes table'); 
        } else {
            console.log('notes table'); 
            rows.forEach(row => {
                console.log(`- ID: ${row.id}, Title: ${row.title}, Contents: ${row.contents}, Created: ${row.created}`);
                console.log(); 
            });
        }


        
        //release the connection back to the pool 
        connection.release(); 
    } catch(error){
        console.error('error: ', error.message); 
    }
}

showColumns(); 
//shows tables from notes_app ^


//redirect the base route to /notes
app.get('/' ,(req,res) => {
    res.redirect('/notes'); 
}); 




//define route to fetch notes 
// defining specific url ednpoint that browser (or another client) 
    // can access to retrieve the notes data from your database

app.get('/notes', async(req,res) => {
    try{

        //get a connection from the pool 
        const connection = await pool.getConnection(); 


        const [rows] = await pool.query('select * from notes'); //query to fetch all notes from the table 

        //release the connection 
        connection.release(); 

        res.json(rows) ; //send rows as a json response to the browser 
    } catch(error){
        res.status(500).send('error fetching notes'); 
    }
}); 


//start server on port 3000
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000'); 
}); 

