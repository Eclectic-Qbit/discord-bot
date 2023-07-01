async function handleIndex(req, res) {
  console.log("handle index!");
  res.status(200).json({});
}

module.exports = { handleIndex };
