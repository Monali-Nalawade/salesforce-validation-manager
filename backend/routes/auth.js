const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const router = express.Router();

/* PKCE Values */
const generateCodeVerifier = () => {

    return crypto
        .randomBytes(32)
        .toString("hex");
};

const generateCodeChallenge = (verifier) => {

    return crypto
        .createHash("sha256")
        .update(verifier)
        .digest("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
};

/* Salesforce Login */
router.get("/login", (req, res) => {

    const codeVerifier =
        generateCodeVerifier();

    const codeChallenge =
        generateCodeChallenge(codeVerifier);

    global.codeVerifier = codeVerifier;

    const loginUrl =

        `https://login.salesforce.com/services/oauth2/authorize` +

        `?response_type=code` +

        `&client_id=${process.env.SALESFORCE_CLIENT_ID}` +

        `&redirect_uri=${process.env.SALESFORCE_REDIRECT_URI}` +

        `&code_challenge=${codeChallenge}` +

        `&code_challenge_method=S256`;

    res.redirect(loginUrl);
});

/* OAuth Callback */

router.get("/callback", async (req, res) => {

    try {

        const code = req.query.code;
        const tokenResponse =
            await axios.post(

                "https://login.salesforce.com/services/oauth2/token",

                null,

                {
                    params: {

                        grant_type:
                            "authorization_code",

                        client_id:
                            process.env.SALESFORCE_CLIENT_ID,

                        client_secret:
                            process.env.SALESFORCE_CLIENT_SECRET,

                        redirect_uri:
                            process.env.SALESFORCE_REDIRECT_URI,

                        code,

                        code_verifier:
                            global.codeVerifier
                    }
                }
            );

        console.log(
            "TOKEN RESPONSE:",
            tokenResponse.data
        );

        const {
            access_token,
            instance_url,
            id
        } = tokenResponse.data;

        /*      GET USER INFO     */

        const userResponse =
            await axios.get(
                id,
                {
                    headers: {
                        Authorization:
                            `Bearer ${access_token}`
                    }
                }
            );

        const userData =
            userResponse.data;

        console.log(
            "USER DATA:",
            userData
        );

        /*        REDIRECT TO FRONTEND        */

        const redirectUrl =

            `http://localhost:3000/dashboard` +

            `?accessToken=${encodeURIComponent(access_token)}` +

            `&instanceUrl=${encodeURIComponent(instance_url)}` +

            `&username=${encodeURIComponent(userData.username)}` +

            `&email=${encodeURIComponent(userData.email)}` +

            `&organization=${encodeURIComponent(userData.organization_id)}`;

        console.log(
            "REDIRECT URL:",
            redirectUrl
        );

        res.redirect(redirectUrl);

    } catch (error) {

        console.log(
            "CALLBACK ERROR:",
            error.response?.data ||
            error.message
        );

        res.status(500).send(
            "OAuth Error"
        );
    }
});

/*Fetch Validation Rules*/

router.post(
    "/validation-rules",
    async (req, res) => {

        try {

            const {
                accessToken,
                instanceUrl
            } = req.body;

            const basicQuery =
                "SELECT Id, ValidationName, Active FROM ValidationRule";
            const basicResponse =
                await axios.get(

                    `${instanceUrl}/services/data/v59.0/tooling/query`,

                    {
                        headers: {
                            Authorization:
                                `Bearer ${accessToken}`
                        },

                        params: {
                            q: basicQuery
                        }
                    }
                );

            const basicRules =
                basicResponse.data.records;

            const formattedRules = [];

            for (const rule of basicRules) {

                const metadataQuery =

                    `SELECT Id, Metadata ` +

                    `FROM ValidationRule ` +

                    `WHERE Id='${rule.Id}'`;

                const metadataResponse =
                    await axios.get(

                        `${instanceUrl}/services/data/v59.0/tooling/query`,

                        {
                            headers: {
                                Authorization:
                                    `Bearer ${accessToken}`
                            },

                            params: {
                                q: metadataQuery
                            }
                        }
                    );

                const metadataRecord =
                    metadataResponse
                        .data
                        .records[0];

                formattedRules.push({

                    Id: rule.Id,

                    ValidationName:
                        rule.ValidationName,

                    Active:
                        rule.Active,

                    Metadata:
                        metadataRecord.Metadata
                });
            }

            res.json(formattedRules);

        } catch (error) {

            console.log(
                "VALIDATION FETCH ERROR:",
                error.response?.data ||
                error.message
            );

            res.status(500).json({
                error:
                    "Failed to fetch validation rules"
            });
        }
    }
);              /*    Deploy Validation Rules        */

                  router.post(
                      "/deploy",
                      async (req, res) => {

                          try {

                              const {
                                  accessToken,
                                  instanceUrl,
                                  rules
                              } = req.body;

                              for (const rule of rules) {

                                  /* UPDATE ACTIVE STATUS    */

                                  rule.Metadata.active =
                                      rule.Active;

                                  const url =

                                      `${instanceUrl}` +

                                      `/services/data/v59.0/tooling/sobjects/ValidationRule/` +

                                      `${rule.Id}`;

                                  console.log(
                                      "UPDATING:",
                                      rule.ValidationName
                                  );

                                  await axios.patch(

                                      url,

                                      {
                                          Metadata:
                                              rule.Metadata
                                      },

                                      {
                                          headers: {

                                              Authorization:
                                                  `Bearer ${accessToken}`,

                                              "Content-Type":
                                                  "application/json"
                                          }
                                      }
                                  );
                              }

                              res.json({
                                  success: true
                              });

                          } catch (error) {

                              console.log(
                                  "DEPLOY ERROR:",
                                  error.response?.data ||
                                  error.message
                              );

                              res.status(500).json({
                                  error:
                                      "Deployment failed"
                              });
                          }
                      }
                  );
module.exports = router;