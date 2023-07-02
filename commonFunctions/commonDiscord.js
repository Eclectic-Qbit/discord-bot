const { default: axios } = require("axios");

async function getDiscordData(code) {
  const redirect =
    process.env.IS_TESTING_ENV === "true"
      ? process.env.REDIRECT_URL_TESTING
      : process.env.REDIRECT_URL_PROD;
  const params = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: "authorization_code",
    code: code,
    redirect_uri: redirect,
  });
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  try {
    const response = await axios.post(
      "https://discord.com/api/oauth2/token",
      params,
      {
        headers,
      }
    );
    const userResponse = await axios.get("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${response.data.access_token}`,
        ...headers,
      },
    });
    return { ...userResponse.data, refreshToken: response.data.refresh_token };
  } catch (e) {
    console.error("Error");
    console.error(e);
    return null;
  }
}

module.exports = { getDiscordData };
