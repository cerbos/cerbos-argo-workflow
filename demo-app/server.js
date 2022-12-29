const express = require("express");
const Cerbos = require("@cerbos/grpc");

const cerbos = new Cerbos.GRPC(process.env.CERBOS_HOST, { tls: false });

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/cerbos", async (req, res) => {
  try {
    const result = await cerbos.checkResources(req);
    res.json(result);
  } catch (e) {
    res.status(402).json(e);
  }
});

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
