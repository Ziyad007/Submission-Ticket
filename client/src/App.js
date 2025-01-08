import { useState, useEffect } from "react";
import StudentPage from "./components/StudentPage";
import TeacherDashboard from "./components/TeacherDashboard";
import Login from "./components/Login";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Signup from "./components/Signup";
import SubjectPage from "./components/SubjectPage";
import LabPage from "./components/LabPage";
import { useLocation } from "react-router-dom";
import TeacherProfilePage from "./components/TeacherProfilePage";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
function App() {
  const [teacherId, setTeacherId] = useState(null);
  const [studentId, setStudentId] = useState(null);
  useEffect(() => {
    const savedTeacherId = localStorage.getItem("teacherId");
    const saveStudentId = localStorage.getItem("StudentRollNo");
    if (savedTeacherId) {
      setTeacherId(savedTeacherId); // Set teacherId from localStorage
    }
    if (saveStudentId) {
      setStudentId(saveStudentId);
    }
  }, []);
  return (
    <Router>
      <Routes>
        <Route
          path="/student/:rollNo"
          element={<LoginStudentPageWithProps />}
        />
        <Route path="/studentInfo/:rollNo" element={<StudentPageWithProps />} />
        <Route
          path="/subject/:subjectName"
          element={<SubjectPageWithProps />}
        />
        <Route path="/lab/:labName" element={<LabPageWithProps />} />
        <Route
          path="/"
          element={
            teacherId ? (
              <Navigate to={`/teacher/${teacherId}`} />
            ) : studentId ? (
              <Navigate to={`/student/${studentId}`} />
            ) : (
              <Login setTeacherId={setTeacherId} setStudentId={setStudentId} />
            )
          }
        />
        <Route
          path="/teacher/:id"
          element={
            teacherId ? (
              <TeacherDashboard
                teacherId={teacherId}
                setTeacherId={setTeacherId}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route 
          path="/teacherInfo/:id"
          element={
            <TeacherProfilePage teacherId={teacherId} setTeacherId={setTeacherId}/>
          }
        />
        <Route
          path="/signup"
          element={<Signup setTeacherId={setTeacherId} />}
        ></Route>
      </Routes>
    </Router>
  );
  function LoginStudentPageWithProps() {
    const { rollNo } = useParams(); //Get rollNo from URL
    return studentId ? (
      <StudentPage rollNo={rollNo} role="student" />
    ) : (
      <Navigate to="/" />
    );
  }
  function StudentPageWithProps() {
    const { rollNo } = useParams(); //Get rollNo from URL
    return <StudentPage rollNo={rollNo} role="teacher" />;
  }
  function SubjectPageWithProps() {
    const { subjectName } = useParams();
    const query = useQuery();
    const teacherEmail = query.get("teacherEmail");
    return <SubjectPage subName={subjectName} teacherEmail={teacherEmail} teacherId={teacherId} setTeacherId={setTeacherId}/>;
  }
  function LabPageWithProps() {
    const { labName } = useParams();
    const query = useQuery(); // Get query parameters
    const teacherEmail = query.get("teacherEmail");
    return <LabPage labName={labName} teacherEmail={teacherEmail} teacherId={teacherId} setTeacherId={setTeacherId} />;
  }
}
export default App;
