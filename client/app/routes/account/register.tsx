import type { Route } from "../+types/account.register";
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

    // Basic email validation
    if (!form.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }

    // Username validation
    if (!form.username) {
      newErrors.username = "Username is required";
      valid = false;
    }

    // Password validation
    if (!form.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) return;

    try {
      await axios.post("http://localhost:3000/api/user/register", form, {
        withCredentials: true,
      });
      navigate('/account/login');
    } catch (error: any) {
      if (error.response && error.response.data?.errors) {
        const backendErrors = error.response.data.errors;

        const newErrors = { email: "", username: "", password: "" };

        backendErrors.forEach((err: any) => {
          if (err.path in newErrors) {
            newErrors[err.path as keyof typeof newErrors] = err.msg;
          }
        });

        setErrors(newErrors);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper elevation={3} sx={{ padding: 4, width: 350 }}>
        <Typography variant="h5" mb={2} textAlign="center">
          Register
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal" error={!!errors.email}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
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
            />
            {errors.username && <FormHelperText>{errors.username}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth margin="normal" error={!!errors.password}>
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
            />
            {errors.password && <FormHelperText>{errors.password}</FormHelperText>}
          </FormControl>

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 2 }}
          >
            Register
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
