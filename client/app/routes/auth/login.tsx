import type { Route } from "../account/+types/login";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  FormHelperText,
  FormControl,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setAuthenticatedUser } from "~/store/authSlice";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Login page" },
    { name: "description", content: "Login page" },
  ];
}

export default function LoginPage() {
  const [form, setForm] = useState({
    emailOrUsername: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    emailOrUsername: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { emailOrUsername: "", password: "" };

    if (!form.emailOrUsername) {
      newErrors.emailOrUsername = "Email or Username is required";
      valid = false;
    }

    if (!form.password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/auth/login",
        form,
        { withCredentials: true }
      );

      dispatch(setAuthenticatedUser(data.data));
      navigate("/");
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        const newErrors = { emailOrUsername: "", password: "" };

        backendErrors.forEach((err: any) => {
          if (err.path in newErrors) {
            newErrors[err.path as keyof typeof newErrors] = err.msg;
          }
        });

        setErrors(newErrors);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f7fa, #e4ecf7)",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: 360,
          borderRadius: 3,
        }}
      >
        <Box textAlign="center" mb={3}>
          <Typography variant="h5" fontWeight={600}>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Login to your account
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal" error={!!errors.emailOrUsername}>
            <TextField
              label="Email or Username"
              name="emailOrUsername"
              value={form.emailOrUsername}
              onChange={handleChange}
              fullWidth
              size="small"
            />
            {errors.emailOrUsername && (
              <FormHelperText>{errors.emailOrUsername}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth margin="normal" error={!!errors.password}>
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              size="small"
            />
            {errors.password && (
              <FormHelperText>{errors.password}</FormHelperText>
            )}
          </FormControl>

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{
              mt: 2,
              py: 1.2,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Login
          </Button>

          <Typography
            variant="body2"
            textAlign="center"
            sx={{ my: 2, color: "text.secondary" }}
          >
            OR
          </Typography>

          <Button
            fullWidth
            variant="outlined"
            sx={{
              py: 1.2,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
            }}
            onClick={() => navigate("/account/register")}
          >
            Create an account
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
