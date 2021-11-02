const mongoose = require('mongoose')
require('dotenv').config()


// @desc connecting the database
const connectionDB = async () => {
  try {
    await mongoose.connect(process.env.mongoURI, {
      useNewUrlParser: true
    })

    console.log("connected with database...")
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = connectionDB;
