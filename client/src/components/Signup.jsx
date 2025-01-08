import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { darkBlueTheme, Card, BackgroundContainer } from "./Login";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Select } from "react-daisyui";

function Signup({ setTeacherId }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [assignedClasses, setAssignedClasses] = useState("default");
  const [assignedSubjects, setAssignedSubjects] = useState("default");
  const [assignedLabs, setAssignedLabs] = useState("default");
  const [error, setError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      console.log(error);

      return;
    }

    try {
      const response = await fetch("http://localhost:4000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          assigned_classes: assignedClasses.split(",").map((cls) => cls.trim()),
          assigned_subjects: assignedSubjects
            .split(",")
            .map((sub) => sub.trim()),
          assigned_labs: assignedLabs.split(",").map((lab) => lab.trim()),
          phone_number: phoneNumber,
        }),
      });

      if (response.ok) {
        const { teacherId } = await response.json();
        setTeacherId(teacherId);
        localStorage.setItem("teacherId", teacherId);
        navigate(`/teacher/${teacherId}`);
      } else {
        const { error } = await response.json();
        setError(error);
      }
    } catch {
      setError("An error occurred during signup");
    }
  };

  return (
    <ThemeProvider theme={darkBlueTheme}>
      <CssBaseline />
      <BackgroundContainer>
        <Card style={{ marginTop: "2rem", width: "100%" }}>
          <Box
            component="img"
            src="/PICT_Logo.png" // Replace this with the actual path to your image
            alt="Login Logo"
            sx={{
              width: "200px", // Adjust as per your image size
              height: "auto",
              margin: "0 auto", // Centers the image horizontally
              display: "block",
            }}
          />
          <Typography
            component="h1"
            variant="h4"
            sx={{ textAlign: "left", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Sign Up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSignup}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="name">Name</FormLabel>
              <TextField
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
                variant="outlined"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                variant="outlined"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                variant="outlined"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
              <TextField
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                fullWidth
                variant="outlined"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
              <TextField
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                fullWidth
                variant="outlined"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Assigned Classes</FormLabel>
              <Select
                value={assignedClasses}
                onChange={(event) => setAssignedClasses(event.target.value)}
                fullWidth
                variant="outlined"
              >
                <option value={"default"} disabled>
                  Option
                </option>
                <option value={"TE 9"}>TE 9</option>
                <option value={"TE 10"}>TE 10</option>
                <option value={"TE 11"}>TE 11</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Assigned Subjects</FormLabel>
              <Select
                value={assignedSubjects}
                onChange={(event) => setAssignedSubjects(event.target.value)}
                fullWidth
                variant="outlined"
              >
                <option value={"default"} disabled>
                  Option
                </option>
                <option value={"CC"}>CC</option>
                <option value={"DSBDA"}>DSBDA</option>
                <option value={"CNS"}>CNS</option>
                <option value={"WAD"}>WAD</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Assigned Labs</FormLabel>
              <Select
                value={assignedLabs}
                onChange={(event) => setAssignedLabs(event.target.value)}
                fullWidth
                variant="outlined"
              >
                <option value={"default"} disabled>
                  Option
                </option>
                <option value={"CCL"}>CCL</option>
                <option value={"DSBDAL"}>DSBDAL</option>
                <option value={"Internship"}>Intenrship</option>
                <option value={"WADL"}>WADL</option>
              </Select>
            </FormControl>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
              Signup
            </Button>
          </Box>
          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              mt: 2,
              color: "text.secondary",
            }}
          >
            Already have an account?{" "}
            <Link
              to="/"
              style={{
                color: "#1E90FF",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Login
            </Link>
          </Typography>
        </Card>
      </BackgroundContainer>
    </ThemeProvider>
  );
}

export default Signup;
