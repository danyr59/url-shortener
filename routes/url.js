require("dotenv").config()
const express = require("express")
const router = express.Router()
const dns = require("dns")
const util = require("util")

const lookup = util.promisify(dns.lookup)

const isHttp = async (url) => {
  console.log(url)
  const expRegHttp = /https?:\/\/|localhost/;

  const expReg = /(https?:\/\/)?(w{3}.)?[\w.-]{0,}.[a-z]{0,}/;

  //separar url
  let newUrl = (/localhost/.test(url) != false ? url.match(/localhost/)[0] : null)
    || (expReg.test(url) != false ? url.match(expReg)[0].replace(/www.|https?:\/\/|\/\w{0,}$|/g, "") : null);

  //si no coincide con la expresion significa que cualquier otra cosa o que la url no esta bien escrita 
  console.log(expRegHttp.test(url))
  if (!expRegHttp.test(url) || !newUrl) {
    throw new TypeError(`invalid url : ${url}`);
  }
  await lookup(newUrl)
}

const generationCode = (arr) => {
  let array = arr || new Array(9).fill();
  return array.map((current) => {
    return Math.floor(Math.random() * (9 - 0)) + 0;
  }).join("")
}

const Url = require("../models/Url")
const { throws } = require("assert")
router.post("/shorturl", async (req, res) => {
  const { url: longUrl } = req.body;
  try {
    //queria decir que la url esta bien 
    await isHttp(process.env.baseUrl)
    // if (! await isHttp(process.env.baseUrl)) {
    //   res.json({ error: "invalid url" })
    // }

    //generator the number random
    let code = generationCode().toString();

    //check short Url 

    //queria decir que la url esta bien 
    await isHttp(longUrl)
    // if (! await isHttp(longUrl)) {
    //   res.json({ error: "invalid url" })
    // }


    url = await Url.findOne({ original_url: longUrl })

    if (url) {
      res.json({
        original_url: url.original_url,
        short_url: url.short_url
      })
    } else {
      url = new Url({ original_url: longUrl, short_url: code })
      await url.save();
      res.json({
        original_url: longUrl,
        short_url: code
      });
    }

  } catch (error) {
    console.log(error.message)
    //qeria decir que la url no existe
    res.json({ error: error.message })
  }

  //comprobar url base 
  //comprobar url de envio 
  //crear numero random 


})

module.exports = router;
