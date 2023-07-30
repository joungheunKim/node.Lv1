const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  postsId:{
    type : String,
    required : true,
  },
  user:{
    type : String,
    required : true,
  },
  password :{
    type : String,
  },
  content:{
    type : String,
  },
  addTime:{
    type : String,
  }
});

module.exports = mongoose.model("comments", commentSchema);

// 미국 시간으로 표시됨
// commentSchema.set("timestamps", true);
