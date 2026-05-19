import React, { useState, useEffect} from "react";
import {Box,Container, Typography,Button, CircularProgress, Switch,Paper} from "@mui/material";
import API from "../services/api";

const DashboardPage = () => {

    /*    STATES  */

    const [rules, setRules] = useState([]);
    const [loading, setLoading] =useState(false);
    const [deployLoading, setDeployLoading] = useState(false);
    const [userData, setUserData] =
       useState({
            username: "",
            email: "",
            organization: ""
        });

    /* STORE QUERY PARAMS TO LOCAL STORAGE    */

    useEffect(() => {

        const queryParams =
            new URLSearchParams(
                window.location.search
            );

        const accessToken =
            queryParams.get("accessToken");

        const instanceUrl =
            queryParams.get("instanceUrl");

        const username =
            queryParams.get("username");

        const email =
            queryParams.get("email");

        const organization =
            queryParams.get("organization");

        if (accessToken) {

            localStorage.setItem(
                "accessToken",
                accessToken
            );

            localStorage.setItem(
                "instanceUrl",
                instanceUrl
            );

            localStorage.setItem(
                "username",
                username
            );

            localStorage.setItem(
                "email",
                email
            );

            localStorage.setItem(
                "organization",
                organization
            );
        }

        /*  LOAD FROM LOCAL STORAGE    */

        setUserData({

            username:
                localStorage.getItem("username") || "",

            email:
                localStorage.getItem("email") || "",

            organization:
                localStorage.getItem("organization") || ""
        });

    }, []);

    /*    FETCH VALIDATION RULES */

   const fetchRules = async () => {

    try {

        setLoading(true);

        const accessToken =
            localStorage.getItem("accessToken");

        const instanceUrl =
            localStorage.getItem("instanceUrl");

        console.log("TOKEN:", accessToken);
        console.log("INSTANCE:", instanceUrl);

        const response = await API.post(
            "/auth/validation-rules",
            {
                accessToken,
                instanceUrl
            }
        );

        console.log("RULE RESPONSE:", response.data);

        if (Array.isArray(response.data)) {

            setRules(response.data);

        } else {

            console.log(
                "INVALID RESPONSE:",
                response.data
            );

            setRules([]);

            alert(
                response.data.error ||
                "Failed to fetch validation rules"
            );
        }

    } catch (error) {

        console.log(error);

        setRules([]);

        alert(
            error.response?.data?.error ||
            "Failed to fetch validation rules"
        );

    } finally {

        setLoading(false);
    }
};
    /* TOGGLE RULE    */

    const handleToggle = (id) => {

        const updatedRules =
            rules.map((rule) => {

                if (rule.Id === id) {

                    return {
                        ...rule,
                        Active:
                            !rule.Active
                    };
                }

                return rule;
            });

        setRules(updatedRules);
    };

    /*    ENABLE ALL    */

    const enableAll = () => {

        const updatedRules =
            rules.map((rule) => ({
                ...rule,
                Active: true
            }));

        setRules(updatedRules);
    };

    /*    DISABLE ALL    */

    const disableAll = () => {

        const updatedRules =
            rules.map((rule) => ({
                ...rule,
                Active: false
            }));

        setRules(updatedRules);
    };

    /*    DEPLOY CHANGES    */

    const handleDeploy = async () => {

        try {

            setDeployLoading(true);

            const accessToken =
                localStorage.getItem(
                    "accessToken"
                );

            const instanceUrl =
                localStorage.getItem(
                    "instanceUrl"
                );

            await API.post(
                "/deploy",
                {
                    accessToken,
                    instanceUrl,
                    rules
                }
            );

            alert(
                "Validation rules updated successfully"
            );

        } catch (error) {

            console.log(error);

            console.log(
                error.response?.data
            );

            alert("Deployment failed");

        } finally {

            setDeployLoading(false);
        }
    };

    return (

        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f4f7fb",
                py: 5
            }}
        >

            <Container maxWidth="md">

                <Paper
                    sx={{
                        p: 4,
                        borderRadius: 3
                    }}
                >

                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        mb={3}
                    >
                        Salesforce Validation Manager
                    </Typography>

                    {/* USER DETAILS */}

                    <Typography mb={1}>
                        <strong>
                            Username:
                        </strong>{" "}
                        {
                            userData.username
                        }
                    </Typography>

                    <Typography mb={1}>
                        <strong>
                            Email:
                        </strong>{" "}
                        {
                            userData.email
                        }
                    </Typography>

                    <Typography mb={4}>
                        <strong>
                            Organization:
                        </strong>{" "}
                        {
                            userData.organization
                        }
                    </Typography>

                    {/* GET METADATA BUTTON */}

                    <Button
                        variant="contained"
                        onClick={fetchRules}
                    >
                        Get Metadata
                    </Button>

                    {loading && (

                        <Box sx={{ mt: 3 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {/* VALIDATION RULES */}

                    {rules.length > 0 && (

                        <Box sx={{ mt: 5 }}>

                            {/* ACTION BUTTONS */}

                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 2,
                                    mb: 3
                                }}
                            >

                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={enableAll}
                                >
                                    Enable All
                                </Button>

                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={disableAll}
                                >
                                    Disable All
                                </Button>

                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={
                                        handleDeploy
                                    }
                                >
                                    {
                                        deployLoading
                                            ? "Deploying..."
                                            : "Deploy Changes"
                                    }
                                </Button>

                            </Box>

                            {/* RULE LIST */}

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    borderBottom: "2px solid #1976d2",
                                    pb: 1,
                                    mb: 1,
                                    mt: 3
                                }}
                            >

                                <Typography
                                    fontWeight="bold"
                                    fontSize="18px"
                                >
                                    Validation Rules
                                </Typography>

                                <Typography
                                    fontWeight="bold"
                                    fontSize="18px"
                                >
                                    Activate / Deactivate
                                </Typography>

                            </Box>

                            {Array.isArray(rules) &&
                             rules.map((rule) => (

                                <Box
                                    key={rule.Id}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        borderBottom: "1px solid #ddd",
                                        py: 2
                                    }}
                                >

                                    <Typography>
                                        {rule.ValidationName}
                                    </Typography>

                                    <Switch
                                        checked={rule.Active}
                                        onChange={() =>
                                            handleToggle(rule.Id)
                                        }
                                    />

                                </Box>
                            ))}

                        </Box>
                    )}

                </Paper>

            </Container>

        </Box>
    );
};

export default DashboardPage;
