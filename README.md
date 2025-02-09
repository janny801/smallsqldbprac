# Notes App

## Description
This application provides a simple web-based note-taking interface where users can create, edit, and delete notes. It utilizes Express.js for the server backend, MySQL for the database, and basic HTML/CSS for the frontend.

## Features
- **Create Notes**: Users can add new notes with a title and contents.
- **View Notes**: All notes are listed with options to edit or delete.
- **Delete Notes**: Notes can be securely deleted via a password-protected interface.
- **Edit Notes**: Existing notes can be edited, allowing changes to the title and contents.

## Installation

### Prerequisites
- Node.js
- MySQL

### Setup
1. **Clone the repository:**
   - Use the command below to clone the repository to your local machine:
     ```bash
     git clone https://your-repository-url.git
     ```
2. **Navigate to the project directory:**
   - Change into the project directory with:
     ```bash
     cd path-to-your-project
     ```
3. **Install dependencies:**
   - Install the required npm packages:
     ```bash
     npm install
     ```
4. **Ensure your MySQL database is set up and running.**

5. **Create a `.env` file in the project root with the following content (update the value accordingly):**
   - Set the environment variables:
     ```bash
     INSERT_PASSWORD="your_password_here"
     ```
6. **Run the schema setup script to create your database and tables:**
   - Execute the SQL schema script:
     ```bash
     mysql -u root -p < schema.sql
     ```

## Usage
- To start the server, run:
  ```bash
  nodemon database.js
