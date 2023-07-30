const express = require("express");
const router = express.Router();

const Post = require("../schemas/post.js");

// 게시글 목록 조회
router.get("/posts", async (req, res) => {
  const getPost = await Post.find({});
  // 내림차순으로 정리
  function sortDate(getPost) {
    const sortedTime = getPost
      .sort(function (a, b) {
        return new Date(a.addTime).getTime() - new Date(b.addTime).getTime();
        // b-a 도 내림차순이다 .reverse()를 한번 사용해 보고싶어서 .reverse()를 사용함
      })
      .reverse();
    return sortedTime;
  }

  res.json({ post: sortDate(getPost) });
});

// 게시글 상세 조회
router.get("/posts/:postsId", async (req, res) => {
  const { postsId } = req.params;
  const getPost = await Post.find({});

  let result = null;
  for (const post of getPost) {
    if (postsId === post._id.toString()) {
      result = post;
    }}

    if (result === null) {
        res.status(400).json({ errMessage: "id가 일치하는 게시글이 없습니다." });
    } else {
        res.status(200).json({ result });
    }
  
});

// 게시글 작성
router.post("/posts", async (req, res) => {
  const { user, password, title, content } = req.body;
  if (!user || password.length > 3 || !title || !content) {
    res.status(400).json({ errMessage: "모든 정보를 입력해 주세요" });
    return;
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

  const createPost = await Post.create({
    user,
    password,
    title,
    content,
    addTime,
  });

  res.json({ post: createPost });
});

// 게시글 수정
router.put("/posts/:postsId", async (req, res) => {
  const { postsId } = req.params;
  const { user, password, title, content } = req.body;

  const getPost = await Post.find({});

  let result;
  for (const post of getPost) {
    if (postsId === post._id.toString()) {
      result = post;
    }
  }

  if (result) {
    if (password !== result.password) {
      res.status(400).json({ errMessage: "비밀번호가 일치하지 않습니다." });
    } else {
      await Post.updateOne(
        { _id: postsId },
        {
          $set: {
            user: user,
            password: password,
            title: title,
            content: content,
          },
        }
      );
      res.status(200).json({ success: true });
    }
  } else {
    res.status(400).json({ errMessage: "게시글이 없습니다." });
  }
});

// 게시글 삭제
router.delete("/posts/:postsId", async (req, res) => {
  const { postsId } = req.params;
  const { password } = req.body;

  const getPost = await Post.find({ _id: postsId });

  let result;
  for (const post of getPost) {
    if (postsId === post._id.toString()) {
      result = post;
    }
  }

  if (result) {
    if (password !== result.password) {
      res.status(400).json({ errMessage: "비밀번호가 일치하지 않습니다." });
    } else {
      await result.deleteOne({ postsId });
      res.status(200).json({ success: true });
    }
  } else {
    res.status(400).json({ errMessage: "게시글이 없습니다." });
  }
});

module.exports = router;
