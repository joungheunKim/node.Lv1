const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  user:{
    type : String,
    required : true,
    unique : true
  },
  password :{
    type : String,
  },
  title:{
    type : String,
  },
  content:{
    type : String,
  },
  addTime:{
    type : String,
  }
});

module.exports = mongoose.model("posts", postSchema);