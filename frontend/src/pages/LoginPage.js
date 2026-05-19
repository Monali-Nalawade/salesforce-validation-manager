import React from "react";
import {Box, Paper,Typography,  Button} from "@mui/material";

const LoginPage = () => {
    const handleLogin = () => {

        window.location.href =
            "http://localhost:5000/auth/login";
    };

    return (

        <Box
            sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f4f7fb"
            }}
        >

            <Paper
                elevation={3}
                sx={{
                    p: 5,
                    borderRadius: 3,
                    width: 400,
                    textAlign: "center"
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
                >
                    Login with Salesforce
                </Button>

            </Paper>

        </Box>
    );
};

export default LoginPage;