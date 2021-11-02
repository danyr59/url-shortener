require("dotenv").config()
const express = require("express")
const router = express.Router()
const dns = require("dns")
const util = require("util")

const lookup = util.promisify(dns.lookup)

const isHttp = async (url) => {
  const expRegHttp = /(https?:\/\/)?|localhost/;

  const expReg = /(https?:\/\/)?(w{3}.)?[\w.]{0,}.[a-z]{0,}/;

  //separar url
  let newUrl = (/localhost/.test(url) != false ? url.match(/localhost/)[0] : null)
    || (expReg.test(url) != false ? url.match(expReg)[0].replace(/www.|https?:\/\/|\/\w{0,}$|/g, "") : null);
  console.log(newUrl)

  //si no coincide con la expresion significa que cualquier otra cosa 
  if (!expRegHttp.test(url) || !newUrl) {
    console.log("entro false")
    return false;
  }


  try {
    await lookup(newUrl)
    return true;
  } catch (error) {
    console.log(error.message)
    throw `${url} don't exist `;
  }
}

const generationCode = (arr) => {
  let array = arr || new Array(9).fill();
  return array.map((current) => {
    return Math.floor(Math.random() * (9 - 0)) + 0;
  }).join("")
}

const Url = require("../models/Url")
router.post("/shorturl", async (req, res) => {
  const { url: longUrl } = req.body;
  // console.log(longUrl)
  // dns.lookup(longUrl, (err, address, family) => {
  //   console.log('address: %j family: IPv%s', address, family);
  // });
  try {
    // await lookup(process.env.baseUrl)
    if (! await isHttp(process.env.baseUrl)) {
      return res.json("Base Url invalid")
    }
    //check long Url 
    // if (!url) {
    //   res.status(401).json("Url base don't exist")
    // }

    //generator the number random
    let code = generationCode().toString();

    //check short Url 

    if (!await isHttp(longUrl)) {
      return res.json("Url invalid")
    }
    // await lookup(longUrl);
    // if (url) {
    //   

    // } else {
    //   res.json("Url don't exist ")
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
    res.json(error.message)
  }

  //comprobar url base 
  //comprobar url de envio 
  //crear numero random 
  //redirect 


})

module.exports = router;
