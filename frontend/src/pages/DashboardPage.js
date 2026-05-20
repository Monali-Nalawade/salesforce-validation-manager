import React, {
    useEffect,
    useState
} from "react";

import {
    Box,
    Container,
    Typography,
    Button,
    CircularProgress,
    Switch,
    Paper
} from "@mui/material";

import API from "../services/api";

const DashboardPage = () => {

    const [rules, setRules] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [deployLoading, setDeployLoading] =
        useState(false);

    const [userData, setUserData] =
        useState({
            username: "",
            email: "",
            organization: ""
        });

    /*
    -----------------------------------
    STORE URL PARAMS
    -----------------------------------
    */

    useEffect(() => {

        const params =
            new URLSearchParams(
                window.location.search
            );

        const accessToken =
            params.get("accessToken");

        const instanceUrl =
            params.get("instanceUrl");

        const username =
            params.get("username");

        const email =
            params.get("email");

        const organization =
            params.get("organization");

        /*
        SAVE TO LOCAL STORAGE
        */

        if (accessToken) {

            localStorage.setItem(
                "accessToken",
                accessToken
            );
        }

        if (instanceUrl) {

            localStorage.setItem(
                "instanceUrl",
                instanceUrl
            );
        }

        if (username) {

            localStorage.setItem(
                "username",
                username
            );
        }

        if (email) {

            localStorage.setItem(
                "email",
                email
            );
        }

        if (organization) {

            localStorage.setItem(
                "organization",
                organization
            );
        }

        /*
        LOAD USER DATA
        */

        setUserData({

            username:
                localStorage.getItem(
                    "username"
                ) || "",

            email:
                localStorage.getItem(
                    "email"
                ) || "",

            organization:
                localStorage.getItem(
                    "organization"
                ) || ""
        });

    }, []);

    /*
    -----------------------------------
    FETCH VALIDATION RULES
    -----------------------------------
    */

    const fetchRules = async () => {

        try {

            setLoading(true);

            const accessToken =
                localStorage.getItem(
                    "accessToken"
                );

            const instanceUrl =
                localStorage.getItem(
                    "instanceUrl"
                );

            console.log(
                "TOKEN:",
                accessToken
            );

            console.log(
                "INSTANCE:",
                instanceUrl
            );

            const response =
                await API.post(

                    "/auth/validation-rules",

                    {
                        accessToken,
                        instanceUrl
                    }
                );

            console.log(
                "RULES:",
                response.data
            );

            /*
            IMPORTANT FIX
            */

            if (
                Array.isArray(
                    response.data
                )
            ) {

                setRules(
                    response.data
                );

            } else {

                setRules([]);
            }

        } catch (error) {

            console.log(error);

            alert(
                "Failed to fetch validation rules"
            );

        } finally {

            setLoading(false);
        }
    };

    /*
    -----------------------------------
    TOGGLE
    -----------------------------------
    */

    const handleToggle = (id) => {

        const updatedRules =
            rules.map((rule) => {

                if (
                    rule.Id === id
                ) {

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

    /*
    -----------------------------------
    ENABLE ALL
    -----------------------------------
    */

    const enableAll = () => {

        const updatedRules =
            rules.map((rule) => ({

                ...rule,

                Active: true
            }));

        setRules(updatedRules);
    };

    /*
    -----------------------------------
    DISABLE ALL
    -----------------------------------
    */

    const disableAll = () => {

        const updatedRules =
            rules.map((rule) => ({

                ...rule,

                Active: false
            }));

        setRules(updatedRules);
    };

    /*
    -----------------------------------
    DEPLOY
    -----------------------------------
    */

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

            const response =
                await API.post(

                    "/auth/deploy",

                    {
                        accessToken,
                        instanceUrl,
                        rules
                    }
                );

            console.log(
                response.data
            );

            alert(
                "Deployment completed"
            );

        } catch (error) {

            console.log(error);

            alert(
                "Deployment failed"
            );

        } finally {

            setDeployLoading(false);
        }
    };

    return (

        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor:
                    "#f4f7fb",
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

                    <Button
                        variant="contained"
                        onClick={
                            fetchRules
                        }
                    >
                        Get Metadata
                    </Button>

                    {loading && (

                        <Box sx={{ mt: 3 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {rules.length > 0 && (

                        <Box sx={{ mt: 5 }}>

                            <Box
                                sx={{
                                    display:
                                        "flex",
                                    gap: 2,
                                    mb: 3
                                }}
                            >

                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={
                                        enableAll
                                    }
                                >
                                    Enable All
                                </Button>

                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={
                                        disableAll
                                    }
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

                            <Box
                                sx={{
                                    display:
                                        "flex",
                                    justifyContent:
                                        "space-between",
                                    mb: 2,
                                    fontWeight:
                                        "bold"
                                }}
                            >

                                <Typography>
                                    Validations
                                </Typography>

                                <Typography>
                                    Activate /
                                    Deactivate
                                </Typography>

                            </Box>

                            {rules.map(
                                (rule) => (

                                    <Box
                                        key={
                                            rule.Id
                                        }
                                        sx={{
                                            display:
                                                "flex",
                                            justifyContent:
                                                "space-between",
                                            alignItems:
                                                "center",
                                            borderBottom:
                                                "1px solid #ddd",
                                            py: 2
                                        }}
                                    >

                                        <Typography>
                                            {
                                                rule.ValidationName
                                            }
                                        </Typography>

                                        <Switch
                                            checked={
                                                rule.Active
                                            }
                                            onChange={() =>
                                                handleToggle(
                                                    rule.Id
                                                )
                                            }
                                        />

                                    </Box>
                                )
                            )}

                        </Box>
                    )}

                </Paper>

            </Container>

        </Box>
    );
};

export default DashboardPage;
