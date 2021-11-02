const express = require("express")
const router = express.Router()


const Url = require("../models/Url")

router.get("/api/shorturl/:code", (req, res) => {
  res.json({ code: req.params.code })
})

module.exports = router;

