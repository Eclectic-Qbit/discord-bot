async function insertFirstForm(req, res) {
  console.log("Inserting form");
  return res.sendStatus(200);
}
module.exports = { insertFirstForm };
