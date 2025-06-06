const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// Create a new post
router.post("/", async (req, res) => {
    const { name, location, condition, description, availability } = req.body;
    
    const post = new Post({
        item_name: name,
        pickup_location: location,
        condition: condition,
        availability: {
            date: availability.date,
            time: availability.time
        },
        description: description
    });

    const savedPost = await post.save();

    return res.json({ success: savedPost ? true : false });
});

// Get all posts
router.get("/", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || "";
    const sort = req.query.sort || "recents";
    const condition = req.query.condition || "";
    const limit = 6;

    const filter = {
        $or: [
            { item_name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ],
    };

    if (condition && condition !== "all") {
        filter.condition = condition;
    }

    const posts = await Post.find(filter).skip((page - 1) * limit).limit(limit).sort({ createdAt: (sort == "old" ? 1 : -1) })
    const totalPosts = await Post.countDocuments(filter);    

    return res.json({ posts: posts, totalPages: Math.ceil(totalPosts / limit) });
});

// Get a specific post by ID
router.get("/:id", async (req, res) => {
    const postId = req.params.id;
    
    if (!postId) {
        return res.status(400).json({ error: "Post ID is required" });
    }

    const post = await Post.findById(postId);

    if (!post) {
        return res.status(404).json({ error: "Post not found" });
    }

    return res.json({ success: true, post: post });
});

// Update a post by ID
router.put("/:id", async (req, res) => {
    const postId = req.params.id;
    const { name, location, condition, description, availability } = req.body;
    
    if (!postId) {
        return res.status(400).json({ error: "Post ID is required" });
    }

    const updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
            item_name: name,
            pickup_location: location,
            condition: condition,
            availability: {
                date: availability.date,
                time: availability.time
            },
            description: description
        },
        { new: true }
    );

    if (!updatedPost) {
        return res.status(404).json({ error: "Post not found" });
    }

    return res.json({ success: true });
});

// Delete a post by ID
router.delete("/:id", async (req, res) => {
    const postId = req.params.id;

    if (!postId) {
        return res.status(400).json({ error: "Post ID is required" });
    }

    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
        return res.status(404).json({ error: "Post not found" });
    }

    return res.json({ success: true });
});

module.exports = router;