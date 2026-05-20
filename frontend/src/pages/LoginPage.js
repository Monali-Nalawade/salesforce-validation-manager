import React from "react";

import {
    Box,
    Paper,
    Typography,
    Button
} from "@mui/material";

const LoginPage = () => {

    const handleLogin = () => {

        window.location.href =
            "https://sfswitch-4tts.onrender.com/auth/login";
    };

    return (

        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background:
                    "linear-gradient(135deg, #0f172a, #1e293b)"
            }}
        >

            <Paper
                elevation={3}
                sx={{
                    p: 5,
                    borderRadius: 4,
                    width: 400,
                    textAlign: "center",
                    backgroundColor: "#1e293b",
                    color: "white",
                    boxShadow:
                        "0px 0px 20px rgba(0,0,0,0.4)"
                }}
            >

                <Typography
                    variant="h4"
                    fontWeight="bold"
                    gutterBottom
                >
                    Salesforce Validation Manager
                </Typography>

                <Typography sx={{ mb: 4 }}>
                    Login securely using Salesforce OAuth 2.0
                </Typography>

                <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleLogin}
                    sx={{
                        mt: 2,
                        backgroundColor: "#2563eb",
                        "&:hover": {
                            backgroundColor: "#1d4ed8"
                        }
                    }}
                >
                    Login with Salesforce
                </Button>

            </Paper>

        </Box>
    );
};

export default LoginPage;
