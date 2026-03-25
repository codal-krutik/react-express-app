import type { Route } from "./+types/verify";
import { useLoaderData, useNavigate } from "react-router";
import { Box, Paper, Typography, Button } from "@mui/material";
import axios from "axios";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return {
      success: false,
      message: "Token is required",
    };
  }

  try {
    const { data } = await axios.get(
      `http://localhost:3000/api/user/verify-email-link?token=${token}`
    );

    return {
      success: true,
      message: data.message || "Email verified successfully",
    };
  } catch (error: any) {
    const response = error.response?.data;

    const validationError =
      response?.errors && response.errors.length > 0
        ? response.errors[0]
        : null;

    return {
      success: false,
      message:
        validationError?.msg ||
        response?.message ||
        "Verification failed or link expired",
    };
  }
}

export default function AccountVerifyPage() {
  const { success, message } = useLoaderData<typeof loader>();

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
        sx={{ p: 4, width: 360, textAlign: "center", borderRadius: 3 }}
      >
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
