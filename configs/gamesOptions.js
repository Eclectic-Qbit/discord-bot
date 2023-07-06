const maxGamePoints = 80;
const memoryGame = {
  points: [
    {
      duration: 20,
      points: 3,
    },
    {
      duration: 30,
      points: 2,
    },
    {
      duration: 1 * 60 * 60 * 24,
      points: 1,
    },
  ],
};

module.exports = { maxGamePoints, memoryGame };
