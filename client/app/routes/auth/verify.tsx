import type { Route } from "../auth/+types/verify";
import { useLoaderData, useNavigate } from "react-router";
import { Box, Paper, Typography, Button, FormControl, FormHelperText, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

export async function loader({ request }: Route.LoaderArgs): Promise<
  {
    success: boolean;
    message: string;
  } & { type: "LINK" | "OTP" }
> {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const email = url.searchParams.get("email");

  if (token) {
    try {
      const { data } = await axios.post(`http://localhost:3000/api/verification/verify`, { token, type: "LINK" });

      return { ...data, type: "LINK" };
    } catch (error: any) {
      const response = error.response?.data;
      const validationError = response?.errors?.[0];
      return {
        success: false,
        message: validationError?.msg || response?.message || "Verification failed",
        type: "LINK",
      };
    }
  }

  if (email) {
    return { success: false, message: "", type: "OTP" }; // OTP page shows form
  }

  return { success: false, message: "Invalid verification request", type: "LINK" };
}

export function meta() {
  return [{ title: "Verify Account" }, { name: "description", content: "Verify your email via link or OTP" }];
}

export default function VerifyPage() {
  const navigate = useNavigate();
  const loaderData = useLoaderData<typeof loader>();
  const { type, success, message } = loaderData;

  const [form, setForm] = useState({ email: "", otp: "" });
  const [errors, setErrors] = useState<{ email: string; otp: string }>({ email: "", otp: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (type === "OTP" && loaderData.message === "") {
      const params = new URLSearchParams(window.location.search);
      setForm((prev) => ({ ...prev, email: params.get("email") ?? "" }));
    }
  }, [type, loaderData.message]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setErrors({ email: "", otp: "" });
    setIsSubmitting(true);

    try {
      await axios.post(`http://localhost:3000/api/verification/verify`, {
        email: form.email,
        otp: form.otp,
        type: "OTP",
      });
      navigate("/account/login");
    } catch (error: any) {
      const backendErrors = error.response?.data?.errors || [];
      const newErrors = { email: "", otp: "" };
      backendErrors.forEach((err: any) => {
        if (err.path in newErrors) newErrors[err.path as keyof typeof newErrors] = err.msg;
      });
      setErrors(newErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  // LINK verification
  if (type === "LINK") {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper elevation={4} sx={{ p: 4, width: 360, textAlign: "center", borderRadius: 3 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {success ? "🎉 Success" : "❌ Verification Failed"}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            {message}
          </Typography>
        </Paper>
      </Box>
    );
  }

  // OTP verification
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: 360,
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" mb={2} textAlign="center">
          Verify OTP
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal" error={!!errors.email}>
            <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth />
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

          <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }} disabled={isSubmitting}>
            {isSubmitting ? "Verifying..." : "Verify"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
