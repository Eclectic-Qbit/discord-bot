const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://www.eclecticqbit.art",
    "https://www.eclecticqbit.art",
  ],
  credentials: true,
};
module.exports = { corsOptions };
