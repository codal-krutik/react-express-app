import type { Route } from "./+types/account.register";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper
} from "@mui/material";
import { useState } from "react";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    console.log("Form Data:", form);
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
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            margin="normal"
            value={form.email}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            label="Username"
            name="username"
            margin="normal"
            value={form.username}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            margin="normal"
            value={form.password}
            onChange={handleChange}
            required
          />

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
