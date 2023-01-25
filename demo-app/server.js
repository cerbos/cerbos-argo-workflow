const express = require("express");
const Cerbos = require("@cerbos/grpc");

const cerbos = new Cerbos.GRPC(process.env.CERBOS_HOST, { tls: false });

const app = express();
const port = process.env.PORT || 3000;

const sample = {
  principal: {
    id: "sally",
    roles: ["USER"],
    attributes: {
      department: "SALES",
      region: "EMEA",
    },
  },
  resource: {
    kind: "expense",
    id: "expense1",
    policyVersion: "default",
    attributes: {
      ownerId: "sally",
      createdAt: "2021-10-01T10:00:00.021-05:00",
      vendor: "Flux Water Gear",
      region: "EMEA",
      amount: 500,
      status: "OPEN",
    },
  },
  actions: ["approve", "create", "delete", "update", "view", "view:approver"],
};

app.get("/", async (req, res) => {
  try {
    const result = await cerbos.checkResource(sample);
    res.json(result);
  } catch (e) {
    res.status(402).json(e);
  }
});

app.post("/cerbos", async (req, res) => {
  try {
    const result = await cerbos.checkResource(req);
    res.json(result);
  } catch (e) {
    res.status(402).json(e);
  }
});

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
