import type { Route } from "./+types/_index";
import { Box, Button, Typography, AppBar, Toolbar, Container, Stack, Alert } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import axios from "axios";
import React from "react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Home" }, { name: "description", content: "Dashboard" }];
}

export default function Index() {
  const navigate = useNavigate();

  const user = useSelector((state: any) => state.auth.user);

  return (
    <React.Fragment>
      <Container maxWidth={"xl"}>
        {user && !user.isEmailVerified && (
          <Box sx={{ py: 2 }}>
            <Alert
              severity="warning"
              action={
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={async () => {
                      await axios.post(
                        "http://localhost:3000/api/verification/send",
                        {
                          email: user.email,
                          type: "OTP",
                        },
                        { withCredentials: true },
                      );
                      navigate(`/account/verify?email=${encodeURIComponent(user.email)}`);
                    }}
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
                            type: "LINK",
                          },
                          { withCredentials: true },
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

        <Typography variant="h4" fontWeight={600} sx={{ my: 2 }}>
          Welcome 👋
        </Typography>

        <Typography variant="body1" color="text.secondary">
          You are successfully logged in.
        </Typography>
      </Container>
    </React.Fragment>
  );
}
