const express = require("express");
const router = express.Router();

const Comment = require("../schemas/comment.js");
const Post = require("../schemas/post.js");

// 댓글 작성
router.post("/comments/:postsId", async (req, res) => {
  const postsId = req.params.postsId;
  const { user, password, content } = req.body;

  const getComment = await Comment.find({});

  //동일한 user 이름이 있을 때 오류
  let userName;
  for (const comment of getComment) {
    if (user === comment.user) {
      userName = comment;
    }
  }
  if (userName) {
    if (user === userName.user) {
      return res.status(400).json({
        success: false,
        errorMessage: "동일한 user이름이 있습니다.",
      });
    }
  }

  // 댓글이 비어있을때
  if (content.length === 0) {
    return res.status(400).json({
      success: false,
      errorMessage: "댓글 내용을 입력해주세요.",
    });
    // 비밀번호는 3자리 이상
  } else if (password < 3) {
    return res.status(400).json({
      success: false,
      errorMessage: "비밀번호는 3자리 이상입력해 주세요.",
    });
    // 공백이 존재할 경우
  } else if (!user || !password || !content) {
    return res.status(400).json({
      success: false,
      errorMessage: "빈칸이 있습니다.",
    });
  }

  const today = new Date();
  const addTime =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    today.getDate().toString().padStart(2, "0") +
    ":" +
    today.getHours().toString().padStart(2, "0") +
    ":" +
    today.getMinutes().toString().padStart(2, "0");

  if (!postsId) {
    return res.status(400).json({
      success: false,
      errorMessage: "일치하는 게시물이 없습니다.",
    });
  }

  await Comment.create({ postsId, user, password, content, addTime });

  res.status(200).json({ result: "success" });
});

// 댓글 목록 조회
router.get("/comments/:postsId", async (req, res) => {
  const { postsId } = req.params;
  const comment = await Comment.find({ postsId });
  res.json({ comment });
});

// 댓글 수정
router.put("/comments/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const { user, password, content } = req.body;

  const getComment = await Comment.find({});

  let result;
  for (const comment of getComment) {
    if (commentId === comment._id.toString()) {
      result = comment;
    }
  }

  if (result) {
    if (password !== result.password) {
      res.status(400).json({ errMessage: "비밀번호가 일치하지 않습니다." });
    } else if (!content) {
      res.status(400).json({ errMessage: "댓글 내용을 입력해주세요." });
    } else {
      await Comment.updateOne(
        { _id: commentId },
        {
          $set: {
            user: user,
            password: password,
            content: content,
          },
        }
      );
      res.status(200).json({ success: true });
    }
  } else {
    res.status(400).json({ errMessage: "댓글이 없습니다" });
  }
});

//댓글 삭제
router.delete("/comments/:commentId", async (req, res) => {
    const { commentId } = req.params;
    const { password } = req.body;

    const getComment = await Comment.find({ _id: commentId });

    let result
    for (const comment of getComment){
        if(commentId===comment._id.toString()){
            result = comment;
        }
    }

    if(result){
        if (password !== result.password){
            res.status(400).json({ errMessage: "비밀번호가 일치하지 않습니다." });
        } else {
            await result.deleteOne({commentId});
            res.status(200).json({ success : true});
        }
    } else {
        res.status(400).json({errMessage: "댓글이 없습니다."})
    }

})

module.exports = router;
