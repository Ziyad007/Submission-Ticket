CREATE TABLE users (
    roll_no VARCHAR(5) PRIMARY KEY, -- Increased size for roll numbers
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Ensure passwords are hashed in your app
    role VARCHAR(50) NOT NULL CHECK (role IN ('teacher', 'student')), -- Or ENUM if supported
    class VARCHAR(50),
    batch CHAR(1), -- Use CHAR(1) for single-character batch codes
    overall_attendance NUMERIC(5, 2) CHECK (overall_attendance BETWEEN 0 AND 100) -- Allows fractional attendance
);

CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ut1 NUMERIC(5, 2) CHECK (ut1 BETWEEN 0 AND 30), -- Scores allow decimals
    ut2 NUMERIC(5, 2) CHECK (ut2 BETWEEN 0 AND 30),
    attendance NUMERIC(5, 2) CHECK (attendance BETWEEN 0 AND 100),
    status BOOLEAN NOT NULL, -- TRUE for approved, FALSE for not approved
    user_roll_no VARCHAR(5) NOT NULL, -- Foreign key referencing users
    FOREIGN KEY (user_roll_no) REFERENCES users(roll_no) ON DELETE CASCADE
);


CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    student_roll_no VARCHAR(5) NOT NULL, -- Foreign key referencing users
    subject_id INT NOT NULL, -- Foreign key referencing subjects
    ut1_marks NUMERIC(5, 2) CHECK (ut1_marks BETWEEN 0 AND 100), -- Allows fractional marks
    ut2_marks NUMERIC(5, 2) CHECK (ut2_marks BETWEEN 0 AND 100),
    subject_attendance NUMERIC(5, 2) CHECK (subject_attendance BETWEEN 0 AND 100),
    status BOOLEAN DEFAULT FALSE, -- TRUE for approved
    final_status BOOLEAN DEFAULT FALSE, -- TRUE for completed
    FOREIGN KEY (student_roll_no) REFERENCES users(roll_no) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE labs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    attendance NUMERIC(5, 2) CHECK (attendance BETWEEN 0 AND 100),
    status BOOLEAN NOT NULL, -- TRUE for completed, FALSE for incomplete
    user_roll_no VARCHAR(5) NOT NULL, -- Foreign key referencing users
    FOREIGN KEY (user_roll_no) REFERENCES users(roll_no) ON DELETE CASCADE
);

INSERT INTO users (roll_no, name, email, password, class, batch, overall_attendance, final_status)
VALUES
('33206', 'Riya Shah', '33206@gmail.com', '$2b$10$Xnkgj2uoL1AhB7NdfF7Twiom8lTTb9y/3R7PR9V4xBoz4IW4Db/5W', 'TE 10', 'K', 85.34, true),
('33101', 'Aarav Deshmukh', '33101@gmail.com', '$2b$10$Xnkgj2uoL1AhB7NdfF7Twiom8lTTb9y/3R7PR9V4xBoz4IW4Db/5W', 'TE 09', 'J', 78.12, false),
('33207', 'Ishita Kulkarni', '33207@gmail.com', '$2b$10$Xnkgj2uoL1AhB7NdfF7Twiom8lTTb9y/3R7PR9V4xBoz4IW4Db/5W', 'TE 10', 'K', 90.23, true),
('33102', 'Vivaan Joshi', '33102@gmail.com', '$2b$10$Xnkgj2uoL1AhB7NdfF7Twiom8lTTb9y/3R7PR9V4xBoz4IW4Db/5W', 'TE 09', 'J', 88.67, false),
('33208', 'Nisha Patil', '33208@gmail.com', '$2b$10$Xnkgj2uoL1AhB7NdfF7Twiom8lTTb9y/3R7PR9V4xBoz4IW4Db/5W', 'TE 10', 'K', 82.45, true),
('33103', 'Rohan Mehta', '33103@gmail.com', '$2b$10$Xnkgj2uoL1AhB7NdfF7Twiom8lTTb9y/3R7PR9V4xBoz4IW4Db/5W', 'TE 09', 'L', 76.34, false),
('33209', 'Anaya Kapoor', '33209@gmail.com', '$2b$10$Xnkgj2uoL1AhB7NdfF7Twiom8lTTb9y/3R7PR9V4xBoz4IW4Db/5W', 'TE 10', 'K', 88.12, true);


INSERT INTO subjects ( name, ut1, ut2, attendance, status, user_roll_no, teacher_id)
VALUES
( 'CC', 24.00, 26.00, 70.00, true, '33206', 1),
( 'DSBDA', 26.00, 30.00, 75.00, false, '33206', 2),
( 'WAD', 22.00, 24.00, 68.00, true, '33206', 3),
( 'CNS', 20.00, 22.00, 60.00, false, '33206', 4),



( 'CC', 28.00, 25.00, 78.00, false, '33101', 10),
( 'DSBDA', 29.00, 30.00, 80.00, true, '33101', 11),
( 'WAD', 27.00, 28.00, 72.00, true, '33101', 13),
( 'CNS', 23.00, 24.00, 68.00, true, '33101', 12),


( 'CC', 30.00, 30.00, 85.00, true, '33207', 1),
( 'DSBDA', 30.00, 30.00, 90.00, true, '33207', 2),
( 'WAD', 28.00, 30.00, 88.00, true, '33207', 3),
( 'CNS', 26.00, 27.00, 82.00, true, '33207', 4),

( 'CC', 28.00, 25.00, 78.00, false, '33102', 10),
( 'DSBDA', 29.00, 30.00, 80.00, true, '33102', 11),
( 'WAD', 27.00, 28.00, 72.00, true, '33102', 13),
( 'CNS', 23.00, 24.00, 68.00, true, '33102', 12),

( 'CC', 28.00, 25.00, 78.00, false, '33208', 1),
( 'DSBDA', 29.00, 30.00, 80.00, true, '33208', 2),
( 'WAD', 27.00, 28.00, 72.00, true, '33208', 3),
( 'CNS', 23.00, 24.00, 68.00, true, '33208', 4),

( 'CC', 28.00, 25.00, 78.00, false, '33103', 10),
( 'DSBDA', 29.00, 30.00, 80.00, true, '33103', 11),
( 'WAD', 27.00, 28.00, 72.00, true, '33103', 13),
( 'CNS', 23.00, 24.00, 68.00, true, '33103', 12),

( 'CC', 28.00, 25.00, 78.00, false, '33209', 1),
( 'DSBDA', 29.00, 30.00, 80.00, true, '33209', 2),
( 'WAD', 27.00, 28.00, 72.00, true, '33209', 3),
( 'CNS', 23.00, 24.00, 68.00, true, '33209', 4);


