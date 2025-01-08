import React, { useState, useEffect } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { darkBlueTheme, BackgroundContainer } from "./Login";
import { Button } from "react-daisyui";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Navbar, Menu } from "react-daisyui";
import { useNavigate } from "react-router-dom";

function StudentPage(props) {
  const [userInfo, setUserInfo] = useState(null); // For user info
  const [subjects, setSubjects] = useState([]); // For subject data
  const [labsData, setLabsData] = useState([]); //For lab data
  const navigate = useNavigate();

  const Card = styled(MuiCard)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    width: "100%",
    padding: "2rem",
    gap: "4rem",
    marginTop: "15rem",
    maxHeight: "100vh", // Allow card to grow in height up to the viewport height
    overflowY: "auto", // Enable vertical scrolling if content exceeds height
    [theme.breakpoints.up("sm")]: {
      maxWidth: "600px",
    },
    boxShadow:
      "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  }));
  function homePage() {
    navigate("/");
  }
  function Nav() {
    return (
      <Navbar className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-opacity-40 bg-base-100 shadow-lg rounded-lg w-3/4 z-50">
        <div className="flex-1">
          <img src="/PICT_Logo.png" alt="Logo" width={60} />
          <Button
            tag="a"
            color="ghost"
            className="normal-case text-xl"
            onClick={homePage}
          >
            Submission Ticket Manager
          </Button>
        </div>
        <div className="flex-none">
          <Menu horizontal={true} className="px-1">
            <Menu.Item>
              <details>
                <summary>
                  <AccountCircleIcon />
                </summary>
                <ul className="p-2 bg-base-100 shadow-lg rounded-lg">
                  <li>
                    <button>Profile</button>
                  </li>
                  <li>
                    {props.role === "student" && (
                      <button
                        onClick={() => {
                          localStorage.removeItem("StudentRollNo");
                          window.location.href = "/";
                        }}
                      >
                        Logout
                      </button>
                    )}
                  </li>
                </ul>
              </details>
            </Menu.Item>
          </Menu>
        </div>
      </Navbar>
    );
  }
  useEffect(() => {
    // Fetch user info
    fetch(`http://localhost:4000/user/${props.rollNo}`)
      .then((response) => response.json())
      .then((data) => setUserInfo(data))
      .catch((error) => console.error("Error fetching user info:", error));

    // Fetch subjects
    fetch(`http://localhost:4000/subjects/${props.rollNo}`)
      .then((response) => response.json())
      .then((data) => setSubjects(data))
      .catch((error) => console.error("Error fetching subjects:", error));

    // Fetch subjects
    fetch(`http://localhost:4000/labs/${props.rollNo}`)
      .then((response) => response.json())
      .then((data) => setLabsData(data))
      .catch((error) => console.error("Error fetching subjects:", error));
  }, [props.rollNo]);

  return (
    <ThemeProvider theme={darkBlueTheme}>
      <CssBaseline />
      <BackgroundContainer>
        <Nav />
        <Card>
          {userInfo ? (
            <div style={{ display: "flex", gap: "2rem" }}>
              <AccountCircleIcon sx={{ fontSize: 150 }} />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <h1 className="text-2xl font-bold">{userInfo.name}'s Page</h1>
                <p>Roll No: {userInfo.roll_no}</p>
                <p>Class: {userInfo.class}</p>
                <p>Batch: {userInfo.batch}</p>
                <p>Overall Attendance: {userInfo.overall_attendance}%</p>
                <h3 style={{ fontWeight: "bold", fontSize: "larger" }}>
                  Final Status:
                  {userInfo.final_status ? "Completed" : "Not Completed"}
                </h3>
              </div>
            </div>
          ) : (
            <p>Loading user info...</p>
          )}

          {subjects.length > 0 ? (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
            >
              <h2 className="text-xl font-bold">Subjects</h2>
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Subject Name</th>
                    <th>UT1 Marks</th>
                    <th>UT2 Marks</th>
                    <th>Attendance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((subject, index) => (
                    <tr key={index}>
                      <td>{subject.subject_name}</td>
                      <td>{subject.ut1_marks}</td>
                      <td>{subject.ut2_marks}</td>
                      <td>{subject.subject_attendance}%</td>
                      <td>
                        {subject.subject_status ? "Completed" : "Not Completed"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h2 className="text-xl font-bold">Labs</h2>
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Lab Name</th>
                    <th>Lab Attendance</th>
                    <th>Lab Status</th>
                  </tr>
                </thead>
                <tbody>
                  {labsData.map((lab, index) => (
                    <tr key={index}>
                      <td>{lab.name}</td>
                      <td>{lab.lab_attendance}%</td>
                      <td>{lab.lab_status ? "Completed" : "Not Completed"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Loading subjects and labs...</p>
          )}
        </Card>
      </BackgroundContainer>
    </ThemeProvider>
  );
}

export default StudentPage;
