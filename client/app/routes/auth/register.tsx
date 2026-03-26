import type { Route } from "../account/+types/register";
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
import { useNavigate } from "react-router";
import axios from "axios";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Register page" },
    { name: "description", content: "Register page" },
  ];
}

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    username: "",
    password: "",
  });

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
    const newErrors = { email: "", username: "", password: "" };

    if (!form.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }

    if (!form.username) {
      newErrors.username = "Username is required";
      valid = false;
    }

    if (!form.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await axios.post("http://localhost:3000/api/auth/register", form, {
        withCredentials: true,
      });

      navigate("/");
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;

        const newErrors = { email: "", username: "", password: "" };

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
          width: 380,
          borderRadius: 3,
        }}
      >
        <Box textAlign="center" mb={3}>
          <Typography variant="h5" fontWeight={600}>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign up to get started
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal" error={!!errors.email}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              size="small"
            />
            {errors.email && <FormHelperText>{errors.email}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth margin="normal" error={!!errors.username}>
            <TextField
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              fullWidth
              size="small"
            />
            {errors.username && (
              <FormHelperText>{errors.username}</FormHelperText>
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
            Register
          </Button>

          <Typography
            variant="body2"
            textAlign="center"
            sx={{ my: 2, color: "text.secondary" }}
          >
            Already have an account?
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
            onClick={() => navigate("/account/login")}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
