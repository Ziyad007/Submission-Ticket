import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from 'cors';
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT;

const db = new pg.Client({
  user:process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DBPORT,
  ssl: {rejectUnauthorized: false}
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

async function updateFinalStatus(rollNo) {
  // Fetch all subject and lab statuses for the student
  const fetchStatusesQuery = `
    SELECT status FROM subjects WHERE user_roll_no = $1
    UNION ALL
    SELECT status FROM labs WHERE user_roll_no = $1
  `;

  const result = await db.query(fetchStatusesQuery, [rollNo]);
  const statuses = result.rows.map((row) => Object.values(row)[0]);

  // Check if all statuses are complete
  const isAllComplete = statuses.every((status) => status === true);

  // Update the final status in the users table
  const updateFinalStatusQuery = `
    UPDATE users
    SET final_status = $1
    WHERE roll_no = $2
  `;
  await db.query(updateFinalStatusQuery, [isAllComplete ? true : false, rollNo]);
}

//GET Specific Student.
app.get("/user/:rollNo", async (req, res) => {
  const { rollNo } = req.params; // Extract roll number from the URL
  try {
    const data = await db.query("SELECT * FROM users WHERE roll_no = $1", [rollNo]);
    if (data.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(data.rows[0]); // Send the first matching user
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/subjects/:rollNo", async (req, res) => {
  const { rollNo } = req.params;
  try {
    const subjects = await db.query(
      `SELECT 
         name AS subject_name, 
         ut1 AS ut1_marks, 
         ut2 AS ut2_marks, 
         attendance AS subject_attendance, 
         status AS subject_status
       FROM subjects
       WHERE user_roll_no = $1`,
      [rollNo]
    );
    res.json(subjects.rows); // Send subjects array
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/labs/:rollNo", async (req, res) => {
  const { rollNo } = req.params;
  try {
    const labsQuery = `
      SELECT l.name, l.attendance AS lab_attendance, l.status AS lab_status
      FROM labs l
      WHERE l.user_roll_no = $1;
    `;
    const labData = await db.query(labsQuery, [rollNo]);

    if (labData.rows.length === 0) {
      return res.status(404).json({ error: "Labs not found" });
    }

    res.json(labData.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/subject/:subjectName", async (req, res) => {
  const { subjectName } = req.params; // Extract subject name from the URL
  const {teacherEmail}=req.query;
  try {
    const teacherData=await db.query("SELECT * FROM teacher where email=$1",[teacherEmail]);
    const teacherClass=teacherData.rows[0].assigned_classes[0]
    
    const subjectQuery = `
  SELECT 
    u.roll_no, 
    u.name AS student_name, 
    u.class, 
    u.batch,  
    u.email AS student_email, 
    sub.name AS subject_name, 
    sub.ut1 AS student_ut1, 
    sub.ut2 AS student_ut2, 
    sub.attendance AS subject_attendance, 
    sub.status AS subject_status
  FROM teacher t
  JOIN subjects sub ON sub.name = ANY(t.assigned_subjects)
  JOIN users u ON u.roll_no = sub.user_roll_no
  WHERE sub.name = $1 
    AND t.email = $2 
    AND u.class = $3 -- Match the class assigned to the teacher
  ORDER BY u.roll_no ASC;
`;

    
    const data = await db.query(subjectQuery, [subjectName,teacherEmail,teacherClass]);    
    if (data.rows.length === 0) {
      return res.status(404).json({ error: "Subject not found" });
    }

    res.json(data.rows); // Send subject details and student data
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/lab/:labName", async (req, res) => {
  const { labName } = req.params; // Extract lab name from the URL
  const { teacherEmail } = req.query; // Extract teacher's email from query parameters

  try {
    const teacherData=await db.query("SELECT * FROM teacher where email=$1",[teacherEmail]);
    const teacherClass=teacherData.rows[0].assigned_classes[0]
    const labQuery = `
      SELECT DISTINCT ON (u.roll_no)
        t.name AS teacher_name,
        t.email AS teacher_email,
        t.assigned_classes,
        t.assigned_labs,
        u.roll_no, 
        u.name AS student_name, 
        u.class, 
        u.batch,  
        u.email AS student_email, 
        lab.name AS lab_name, 
        lab.attendance AS lab_attendance, 
        lab.status AS lab_status
      FROM teacher t
      JOIN labs lab ON lab.name = ANY(t.assigned_labs)
      JOIN users u ON u.roll_no = lab.user_roll_no
      WHERE lab.name = $1
        AND t.email = $2  -- Add condition to match teacher email
        AND u.class=$3
        AND u.batch=$4
      ORDER BY u.roll_no ASC;
    `;
    
    const data = await db.query(labQuery, [labName, teacherEmail,teacherClass,teacherData.rows[0].assigned_batch]);  // Pass labName and teacherEmail
    console.log(data.rows);
    
    
    
    if (data.rows.length === 0) {
      return res.status(404).json({ error: "Lab not found" });
    }

    res.json(data.rows); // Send lab details and student data
  } catch (error) {
    console.error("Backend error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get('/teacher/:teacherId', (req, res) => {
  const { teacherId } = req.params;
  db.query('SELECT * FROM teacher WHERE teacher_id=$1',[teacherId], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching teachers' });
    } else {
      res.json(result.rows);
    }
  });
});

// Route to fetch teacher-specific details
app.get('/teacher/dashboard/:teacherId', async (req, res) => {
  const { teacherId } = req.params;

  try {
      const teacherQuery = `
          SELECT name, email, assigned_classes, assigned_subjects, assigned_labs 
          FROM teacher 
          WHERE teacher_id = $1;
      `;
      const teacherData = await db.query(teacherQuery, [teacherId]);

      if (teacherData.rows.length === 0) {
          return res.status(404).json({ error: 'Teacher not found' });
      }

      const teacher = teacherData.rows[0];
      res.json(teacher);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Update subject status
app.put('/subject/:subName/status', async (req, res) => {
  const { subName } = req.params; // Get subject name from the URL
  const { rollNo, status } = req.body; // Get roll number and status from the request body

  try {
    // Update the subject status for the specific student
    await db.query(
      'UPDATE subjects SET status =$1 WHERE name =$2 AND user_roll_no = $3',
      [status, subName, rollNo]
    );
    await updateFinalStatus(rollNo);
    res.json({ message: 'Subject status updated successfully!' });
  } catch (error) {
    console.error('Error updating subject status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}); 


// Update lab status
app.put('/lab/:labName/status', async (req, res) => {
  const { labName } = req.params; // Get lab name from the URL
  const { rollNo, status } = req.body; // Get roll number and status from the request body

  try {
    // Update the lab status for the specific student
    await db.query(
      'UPDATE labs SET status = $1 WHERE name = $2 AND user_roll_no = $3',
      [status, labName, rollNo]
    );
    await updateFinalStatus(rollNo);
    res.json({ message: 'Lab status updated successfully!' });
  } catch (error) {
    console.error('Error updating lab status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    
    // Check teachers table
    const teacherData = await db.query("SELECT * FROM teacher WHERE email = $1", [email]);
    if (teacherData.rows.length > 0) {
      const teacher = teacherData.rows[0];
      console.log("Stored password",teacher.password);
      
      
      const isPasswordMatch = await bcrypt.compare(password, teacher.password);
      console.log("Bcrypt compare",isPasswordMatch);
      // Verify password (add bcrypt if passwords are hashed)
      if (isPasswordMatch) { 
        return res.json({ type: "teacher", id: teacher.teacher_id });
      }
    }

    // Check users (students) table
    const studentData = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (studentData.rows.length > 0) {
      const student = studentData.rows[0];
      // Verify password
      const isPasswordMatch = await bcrypt.compare(password, student.password);
      console.log("Bcrypt compare",isPasswordMatch);
      
      if (isPasswordMatch) {
        return res.json({ type: "student", rollNo: student.roll_no });
      }
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/signup', async (req, res) => {
  const { name, email, password,phone_number, assigned_classes, assigned_subjects, assigned_labs } = req.body;

  try {
    // Check if the email is already registered
    const existingUser = await db.query(
      'SELECT * FROM teacher WHERE email = $1',
      [email]
    );
    

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword=await bcrypt.hash(password,10);

    // Insert the new teacher into the database
    const newUser = await db.query(
      `INSERT INTO teacher (name, email, password, assigned_classes, assigned_subjects, assigned_labs) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING teacher_id`,
      [name, email, hashedPassword,phone_number, assigned_classes, assigned_subjects, assigned_labs]
    );

    res.status(201).json({ teacherId: newUser.rows[0].teacher_id });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// const hashedPassword = await bcrypt.hash("hashed_password", 10);
// console.log("Manually hashed password:", hashedPassword);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});