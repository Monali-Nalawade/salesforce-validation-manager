require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/auth");
const app = express();
app.use(cors());
app.use(express.json());

/* API ROUTES */

app.use("/auth", authRoutes);

/* SERVE REACT BUILD */

app.use(
    express.static(
        path.join(__dirname, "../frontend/build")
    )
);

/* REACT ROUTES */

app.get("*", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../frontend/build/index.html"
        )
    );
});

const PORT =
    process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );
});