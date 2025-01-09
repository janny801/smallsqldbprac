//using mysql2 

import mysql from 'mysql2/promise'

const pool = mysql.createPool({
    host: '127.0.0.1', 
    user: 'root', 
    password: 'janred0801', 
    database: 'notes_app'

});



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