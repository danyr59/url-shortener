const express = require("express")
const router = express.Router()


const Url = require("../models/Url")

router.get("/api/shorturl/:code", async (req, res) => {
  //verificar que exista en db 
  //si existe reedirect 
  try {
    const url = await Url.findOne({ short_url: req.params.code });
    if (!url) {
      res.status(404).json("No url found")
    }
    res.redirect(url.original_url);

  } catch (error) {
    console.log(error.message);
    res.status(500).json("Server Error")
  }

})

module.exports = router;

