import React, { useState, useEffect } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { darkBlueTheme, BackgroundContainer } from "./Login";
import ProjectNavbar from "./ProjectNavbar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { Button } from "react-daisyui";

function TeacherProfilePage(props) {
  const [teacherInfo, setTeacherInfo] = useState([]);
  const navigate = useNavigate();

  const Card = styled(MuiCard)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    width: "100%",
    marginTop: "15rem",
    gap: theme.spacing(2),
    margin: "auto",
    maxHeight: "100vh",
    overflowY: "auto",
    [theme.breakpoints.up("sm")]: {
      maxWidth: "450px",
    },
    boxShadow:
      "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  }));

  useEffect(() => {
    // Fetch teacher info
    fetch(
      `https://submission-ticket-d9nh.onrender.com/teacher/${props.teacherId}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        setTeacherInfo(Array.isArray(data) ? data : []);
      })
      .catch((error) => console.error("Error fetching teacher info:", error));
  }, [props.teacherId]);

  const handleLogout = () => {
    localStorage.removeItem("teacherId");
    props.setTeacherId(null);
    navigate("/");
  };
  console.log();

  return (
    <ThemeProvider theme={darkBlueTheme}>
      <CssBaseline />
      <BackgroundContainer>
        <ProjectNavbar
          handleLogout={handleLogout}
          setTeacherId={props.setTeacherId}
        />
        <Card>
          {teacherInfo ? (
            teacherInfo.map((Info, index) => {
              return (
                <div
                  key={index}
                  className="p-5"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <div className="flex items-center mb-5">
                    <AccountCircleIcon sx={{ fontSize: 100 }} />
                    <h1 className="ml-4 text-2xl font-bold">{Info.name}</h1>
                  </div>
                  <p>Teacher ID: {Info.teacher_id}</p>
                  <p>Email: {Info.email}</p>
                  <p>Phone Number: {Info.phone_number}</p>
                  <p>Class: {Info.assigned_classes}</p>
                  <div
                    style={{ display: "flex", gap: "1rem", paddingTop: "1rem" }}
                  >
                    <Button>Subject: {Info.assigned_subjects[0]}</Button>
                    <Button>Lab: {Info.assigned_labs[0]}</Button>
                    <Button>Batch: {Info.assigned_batch[0]}</Button>
                  </div>
                </div>
              );
            })
          ) : (
            <p>Loading teacher info...</p>
          )}
        </Card>
      </BackgroundContainer>
    </ThemeProvider>
  );
}

export default TeacherProfilePage;
