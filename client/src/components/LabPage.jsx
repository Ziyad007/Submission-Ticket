import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { darkBlueTheme, BackgroundContainer } from "./Login";
import ProjectNavbar from "./ProjectNavbar";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "react-daisyui";

function LabPage(props) {
  const [subData, setData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch user info
    fetch(
      `https://submission-ticket-d9nh.onrender.com/lab/${props.labName}?teacherEmail=${props.teacherEmail}`
    )
      .then((response) => response.json())
      .then((data) => {
        setData(Array.isArray(data) ? data : []);
      })
      .catch((error) => console.error("Error fetching user info:", error));
  }, [props.labName, props.teacherEmail]);

  function handleLabStatusToggle(rollNo, currentStatus) {
    console.log(currentStatus);

    fetch(
      `https://submission-ticket-d9nh.onrender.com/lab/${props.labName}/status`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNo, status: !currentStatus }),
      }
    )
      .then((response) => response.json())
      .then(() => {
        setData((prevData) =>
          prevData
            .map((student) =>
              student.roll_no === rollNo
                ? { ...student, lab_status: !currentStatus }
                : student
            )
            .sort((a, b) => a.roll_no - b.roll_no)
        );
      })
      .catch((error) => console.error("Error updating lab status:", error));
  }
  // console.log(subData[0].lab_status);

  function handleLogout() {
    localStorage.removeItem("teacherId");
    props.setTeacherId(null);
    navigate("/");
  }
  const columns = [
    {
      field: "roll_no",
      headerName: "Roll No",
      width: 100,
      renderCell: (params) => (
        <Link to={`/studentInfo/${params.value}`}>{params.value}</Link>
      ),
    },
    { field: "student_name", headerName: "Name", width: 180 },
    { field: "class", headerName: "Class", width: 120 },
    { field: "batch", headerName: "Batch", width: 120 },
    { field: "student_email", headerName: "Email", width: 200 },
    {
      field: "lab_attendance",
      headerName: "Attendance",
      width: 150,
      editable: true,
    },
    {
      field: "lab_status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <Button
          color="ghost"
          onClick={() =>
            handleLabStatusToggle(params.row.roll_no, params.value)
          }
        >
          {params.value ? "Active" : "Inactive"}
        </Button>
      ),
    },
  ];
  // Display the list of students and their data
  return (
    <ThemeProvider theme={darkBlueTheme}>
      <CssBaseline />
      <BackgroundContainer>
        {/* Navbar */}
        <ProjectNavbar
          handleLogout={handleLogout}
          setTeacherId={props.setTeacherId}
        />

        {/* Main Content */}
        <div
          style={{
            paddingTop: "15rem",
            display: "flex",
            flexDirection: "column",
            gap: "3rem",
          }}
        >
          <h1>Lab: {props.labName}</h1>
          {/* DataGrid Table */}
          <div
            style={{ height: 600, display: "flex", justifyContent: "center" }}
          >
            <DataGrid
              rows={subData.map((data) => ({ ...data, id: data.roll_no }))}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              pagination
              sortingOrder={["asc", "desc"]}
              style={{ height: "370px" }}
            />
          </div>
        </div>
      </BackgroundContainer>
    </ThemeProvider>
  );
}

export default LabPage;
