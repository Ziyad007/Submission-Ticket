import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { darkBlueTheme, BackgroundContainer } from "./Login";
import { Button, Card, Hero } from "react-daisyui";
import ProjectNavbar from "./ProjectNavbar";
import Footer from "./Footer";

function TeacherDashboard({ teacherId, setTeacherId }) {
  const [teacherData, setTeacherData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(
      `https://submission-ticket-d9nh.onrender.com/teacher/dashboard/${teacherId}`
    )
      .then((response) => response.json())
      .then((data) => setTeacherData(data))
      .catch((error) => console.error("Error fetching teacher data:", error));
  }, [teacherId]);

  const handleSubjectClick = (subjectName) => {
    navigate(`/subject/${subjectName}?teacherEmail=${teacherData.email}`);
  };

  const handleLabClick = (labName) => {
    navigate(`/lab/${labName}?teacherEmail=${teacherData.email}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("teacherId");
    setTeacherId(null);
    navigate("/");
  };

  if (!teacherData) return <div>Loading...</div>;

  return (
    <ThemeProvider theme={darkBlueTheme}>
      <CssBaseline />
      <BackgroundContainer>
        <ProjectNavbar
          handleLogout={handleLogout}
          setTeacherId={setTeacherId}
        />

        {/* Main Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "3rem",
            paddingTop: "6rem",
            marginBottom: "2rem",
          }}
        >
          {/* Cards Section */}
          <div style={{ marginTop: "25rem" }}>
            <Hero>
              <Hero.Content className="text-center">
                <div>
                  <h1 className="text-4xl font-bold">
                    Welcome {teacherData.name}
                  </h1>

                  <p className="py-6">
                    Here you can manage your assigned subjects and labs, keep
                    track of your classes, and easily configure the settings for
                    each.
                  </p>
                </div>
              </Hero.Content>
            </Hero>
          </div>
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            {/* Assigned Subjects */}
            <div style={{ flex: 1 }}>
              <Typography
                variant="h4"
                style={{
                  marginBottom: "1rem",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Assigned Subject
              </Typography>
              {teacherData.assigned_subjects.map((subjectName, index) => (
                <Card
                  key={index}
                  className="shadow-lg bg-base-100 rounded-lg w-100 pt-5"
                >
                  <Card.Image src="/Class.jpg" className="h-40" />
                  <Card.Body>
                    <Card.Title tag="h2">{`Subject: ${subjectName}`}</Card.Title>
                    <p>{`Class: ${teacherData.assigned_classes[0]}`}</p>
                    <p>Details for the assigned subject will go here.</p>
                    <Card.Actions>
                      <Button
                        color="primary"
                        onClick={() => handleSubjectClick(subjectName)}
                      >
                        Configure
                      </Button>
                    </Card.Actions>
                  </Card.Body>
                </Card>
              ))}
            </div>
            {/* Divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "2px",
                  height: "100%",
                  backgroundColor: "gray",
                }}
              ></div>
            </div>
            {/* Assigned Labs */}
            <div style={{ flex: 1 }}>
              <Typography
                variant="h4"
                style={{
                  marginBottom: "1rem",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Assigned Lab
              </Typography>
              {teacherData.assigned_labs.map((labName, index) => (
                <Card
                  key={index}
                  className="shadow-lg bg-base-100 rounded-lg w-100 pt-5"
                >
                  <Card.Image src="/Class.jpg" className="h-40" />
                  <Card.Body>
                    <Card.Title tag="h2">{`Lab: ${labName}`}</Card.Title>
                    <p>{`Class: ${teacherData.assigned_classes[0]}`}</p>
                    <p>Details for the assigned lab will go here.</p>
                    <Card.Actions>
                      <Button
                        color="primary"
                        onClick={() => handleLabClick(labName)}
                      >
                        Configure
                      </Button>
                    </Card.Actions>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
          <Footer />
        </div>
      </BackgroundContainer>
    </ThemeProvider>
  );
}

export default TeacherDashboard;
