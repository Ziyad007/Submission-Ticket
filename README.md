# PERN Student Submission Ticket Manager
## Student Submission Ticket Management Web App
The PERN Student Submission Ticket Manager is a web application built using the PERN stack (PostgreSQL, Express.js, React, Node.js) for managing student submissions. It has two interfaces: one for teachers to manage student submissions and attendance, and one for students to view their submissions, marks, and status. The app includes functionalities for managing student data, including CRUD operations, sorting, and searching.

## Install Dependencies
Before running the app, you need to install the required dependencies. Run the following command for both server and client folder:
```
cd client
npm install
```
```
cd server
npm install
```
This will install all the necessary packages defined in the package.json file.

### Set Up Environment Variables
You need to set up your database and configure the app. Create a .env file in the root of the project directory and add the following lines:
```
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
PORT=3000
```
Replace the placeholders with your actual database credentials.

### Set Up Database
Before starting the app, you'll need to create the database and tables. You can run the following SQL script to set up the necessary structure for storing student and submission data:

```
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  roll_no VARCHAR(20) NOT NULL,
  class VARCHAR(50),
  batch VARCHAR(20),
  attendance FLOAT,
  ut1_marks FLOAT,
  ut2_marks FLOAT,
  status VARCHAR(20)
);

CREATE TABLE subjects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  teacher_id INT REFERENCES teachers(id)
);

CREATE TABLE teachers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);
```
### Run the App
Run the following command for client:
```
npm start
```
Run the following command for server:
```
node index.js
```
The app will start.

## Features:
* Teacher Interface: Teachers can view a list of subjects and manage student submissions, marks, and attendance. 
* Student Interface: Students can view their personal details, submission status, and marks.
* Sorting and Searching: Sort and search students by criteria such as marks, status, and subjects.
* Student Submission Status: Teachers can toggle submission status (Approved/Not Approved).
