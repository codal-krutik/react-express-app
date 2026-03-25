import type { Route } from "./+types/account._index";
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Account" },
    { name: "description", content: "Your account details" },
  ];
}

export default function AccountPage() {
  const navigate = useNavigate();

  const user = useSelector((state: any) => state.auth.user);

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
          p: 5,
          width: 420,
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" fontWeight={600} gutterBottom>
          My Account
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Manage your account details and verification
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Stack spacing={2}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Email
            </Typography>
            <Typography fontWeight={500}>{user?.email}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Username
            </Typography>
            <Typography fontWeight={500}>{user?.username}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Email Status
            </Typography>

            {user?.isEmailVerified ? (
              <Chip label="Verified" color="success" />
            ) : (
              <Chip label="Not Verified" color="warning" />
            )}
          </Box>
        </Stack>

        <Button
          fullWidth
          sx={{ mt: 3, textTransform: "none" }}
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </Paper>
    </Box>
  );
}
