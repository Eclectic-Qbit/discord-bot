async function insertFirstForm(req, res) {
  console.log("Inserting form");
  console.log(req.body);
  return res.sendStatus(200);
}
module.exports = { insertFirstForm };
