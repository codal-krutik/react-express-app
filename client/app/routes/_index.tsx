import type { Route } from "./+types/_index";
import {
  Box,
  Button,
  Typography,
  AppBar,
  Toolbar,
  Container,
  Stack,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { unsetAuthenticatedUser } from "~/store/authSlice";
import axios from "axios";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Home" },
    { name: "description", content: "Dashboard" },
  ];
}

export default function Index() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: any) => state.auth.user);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        { withCredentials: true }
      );

      dispatch(unsetAuthenticatedUser());
      navigate("/account/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f9fafb" }}>
      <AppBar position="static" elevation={1} color="inherit">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight={600}>
            React express app
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              variant="text"
              onClick={() => navigate("/account")}
              sx={{ textTransform: "none", fontWeight: 500 }}
            >
              Account
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
              sx={{ textTransform: "none" }}
            >
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container>
        {user && !user.isEmailVerified && (
          <Box sx={{ py: 2 }}>
            <Alert
              severity="warning"
              action={
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() =>
                      navigate(
                        `/account/verify-otp?email=${encodeURIComponent(user.email)}`
                      )
                    }
                    sx={{ textTransform: "none" }}
                  >
                    Verify OTP
                  </Button>

                  <Button
                    size="small"
                    variant="outlined"
                    onClick={async () => {
                      try {
                        await axios.post(
                          "http://localhost:3000/api/verification/send",
                          {
                            email: user.email,
                            type: "LINK"
                          },
                          { withCredentials: true }
                        );
                      } catch (error) {
                        console.error(error);
                      }
                    }}
                    sx={{ textTransform: "none" }}
                  >
                    Resend Link
                  </Button>
                </Stack>
              }
            >
              Your email is not verified. Please verify to unlock all features.
            </Alert>
          </Box>
        )}

        <Typography variant="h4" fontWeight={600} gutterBottom>
          Welcome 👋
        </Typography>

        <Typography variant="body1" color="text.secondary">
          You are successfully logged in.
        </Typography>
      </Container>
    </Box>
  );
}
