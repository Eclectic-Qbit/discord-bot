async function insertFirstForm(req, res) {
  console.log("Inserting form");
  console.log("FULL REQ");
  console.log(req);
  console.log("BODY");
  console.log(req.body);
  return res.sendStatus(200);
}
module.exports = { insertFirstForm };
