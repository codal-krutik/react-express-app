import type { Route } from "./+types/verify-otp";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Verify OTP" },
    { name: "description", content: "Verify email OTP" },
  ];
}

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    email: searchParams.get("email") ?? "",
    otp: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    otp: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/api/user/verify-otp", form);
      navigate("/account/login");
    } catch (error: any) {
      if (error.response && error.response.data?.errors) {
        const backendErrors = error.response.data.errors;
        const newErrors = { email: "", otp: "" };
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
          Verify OTP
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

          <FormControl fullWidth margin="normal" error={!!errors.otp}>
            <TextField
              label="OTP"
              name="otp"
              value={form.otp}
              onChange={handleChange}
              fullWidth
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 6 }}
            />
            {errors.otp && <FormHelperText>{errors.otp}</FormHelperText>}
          </FormControl>

          <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
            Verify
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}