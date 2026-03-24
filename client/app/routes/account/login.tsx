import type { Route } from "../+types/account.login";
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

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) return;

    try {
      const { data } = await axios.post("http://localhost:3000/api/auth/login", form, {
        withCredentials: true,
      });
      dispatch(setAuthenticatedUser(data));
      navigate('/');
    } catch (error: any) {
      if (error.response && error.response.data?.errors) {
        const backendErrors = error.response.data.errors;

        const newErrors = { emailOrUsername: "", password: "" };

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
          Login
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal" error={!!errors.emailOrUsername}>
            <TextField
              label="Email or Username"
              name="emailOrUsername"
              value={form.emailOrUsername}
              onChange={handleChange}
              fullWidth
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
            />
            {errors.password && (
              <FormHelperText>{errors.password}</FormHelperText>
            )}
          </FormControl>

          <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
            Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
