import { createTheme } from "@mui/material/styles";

const theme = createTheme({

    palette: {

        primary: {
            main: "#1976d2"
        },

        secondary: {
            main: "#0f172a"
        },

        background: {
            default: "#f4f7fb"
        }
    },

    typography: {

        fontFamily: "Inter, Arial"
    }
});

export default theme;