//using mysql2 


import dotenv from 'dotenv';
dotenv.config();  // This loads the environment variables from the .env file

const correctPassword = process.env.INSERT_PASSWORD;  // Get the password from environment variable


import mysql from 'mysql2/promise';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express(); //create express app
//instance of express framework to build and manage a web application 
app.use(express.static(__dirname));
app.use(express.json()); 

const port = 3000; 

const pool = mysql.createPool({
    host: '127.0.0.1', 
    user: 'root', 
    password: correctPassword,
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


/*
showColumns(); //removed since we are showing when opening using localhost
//shows tables from notes_app ^
*/ 

//serve index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Serve the index.html file
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



app.post('/add-note', express.json(), async (req, res) => { //used to add notes from the browser
    const { title, contents, password } = req.body;

    // Check if the password is correct
    if (password !== correctPassword) {
        return res.status(403).send('Unauthorized: Incorrect password');
    }



    if (!title || !contents) {
        return res.status(400).send('Title and contents are required');
    }

    try {
        const connection = await pool.getConnection();
        const query = 'INSERT INTO notes (title, contents, created) VALUES (?, ?, NOW())';
        await connection.query(query, [title, contents]);
        connection.release();

        console.log(`\nNote added: Title: "${title}", Contents: "${contents}"`);
        await showColumns(); // Call showColumns to log the updated database state


        res.status(201).send('Note added successfully');
    } catch (error) {
        console.error('Error adding note:', error.message);
        res.status(500).send('Error adding note');
    }
});




//for deletion 
app.delete('/delete-note/:id', express.json(), async (req, res) => {
    const noteId = req.params.id;
    const { password } = req.body; // Get the password from the request body

    console.log('Received password:', password); // Log password for debugging

    // Check if the password is correct
    if (password !== correctPassword) {
        return res.status(403).send('Unauthorized: Incorrect password');
    }

    try {
        const connection = await pool.getConnection();
        const query = 'DELETE FROM notes WHERE id = ?';
        const result = await connection.query(query, [noteId]);
        connection.release();

        if (result.affectedRows === 0) {
            return res.status(404).send('Note not found');
        }

        console.log(`Note with ID: ${noteId} deleted successfully`);
        res.status(200).send('Note deleted successfully');
    } catch (error) {
        console.error('Error deleting note:', error.message);
        res.status(500).send('Error deleting note');
    }
});




//start server on port 3000
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000'); 
    (async () => {
        console.log('Fetching initial database state:\n');
        await showColumns(); // Call showColumns() asynchronously
    })();
});

