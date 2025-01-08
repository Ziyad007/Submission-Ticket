import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const darkBlueTheme = createTheme({
  typography: {
    fontFamily: "Poppins, Arial, sans-serif",
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#1E3A8A", // Dark blue
    },
    background: {
      default: "#121212", // Dark background
      paper: "rgba(255, 255, 255, 0.1)", // Transparent-ish card
    },
    text: {
      primary: "#FFFFFF", // White text
      secondary: "#A5A5A5", // Gray text
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(5px)", // Glassmorphism effect
          borderRadius: "16px", // Rounded corners
          boxShadow: "0px 8px 24px rgba(0,0,0,0.2)", // Subtle shadow
        },
      },
    },
  },
});

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "500px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
}));

const BackgroundContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  overflow: "auto",
  backgroundImage:
    "radial-gradient(ellipse at 50% 50%, hsl(212, 74.00%, 24.10%), hsl(0, 0.00%, 0.00%))",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    backgroundImage:
      "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    backgroundBlendMode: "multiply",
    zIndex: -1,
  },
}));

function Login({ setTeacherId, setStudentId }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const navigate = useNavigate();

  const validateInputs = () => {
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    try {
      const response = await fetch(
        "https://submission-ticket-d9nh.onrender.com/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        if (data.type === "teacher") {
          localStorage.setItem("teacherId", data.id);
          setTeacherId(data.id);
          navigate(`/teacher/${data.id}`);
        } else if (data.type === "student") {
          localStorage.setItem("StudentRollNo", data.rollNo);
          setStudentId(data.rollNo);
          navigate(`/student/${data.rollNo}`);
        } else {
          alert("Invalid login credentials");
          setEmail("");
          setPassword("");
          console.error("Invalid Login credentials");
        }
      } else {
        console.error("Invalid Login credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <ThemeProvider theme={darkBlueTheme}>
      <CssBaseline />
      <BackgroundContainer>
        <Card>
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
            Login
          </Typography>
          <Box
            component="form"
            onSubmit={handleLogin}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
                required
                fullWidth
                variant="outlined"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
              />
            </FormControl>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
              Login
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
            Don't have an account?{" "}
            <Link
              to="/signup"
              style={{
                color: "#1E90FF",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </Card>
      </BackgroundContainer>
    </ThemeProvider>
  );
}

export default Login;
export { darkBlueTheme, BackgroundContainer, Card };
