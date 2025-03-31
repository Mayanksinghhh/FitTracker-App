import express from "express"
import User from "../models/User.js"
import Activity from "../models/Activity.js"
import auth from "../middleware/auth.js"

const router = express.Router()

// @route   GET /api/social/users
// @desc    Get users to follow
// @access  Private
router.get("/users", auth, async (req, res) => {
  try {
    // Get all users except current user
    const users = await User.find({ _id: { $ne: req.user._id } }).select("name avatar")

    // Format response
    const formattedUsers = users.map((user) => ({
      id: user._id,
      name: user.name,
      avatar: user.avatar,
      isFollowing: req.user.following.includes(user._id),
    }))

    // Get users that current user is following
    const following = formattedUsers.filter((user) => user.isFollowing)

    res.json({
      users: formattedUsers,
      following,
    })
  } catch (error) {
    console.error("Get users error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/social/follow/:id
// @desc    Follow/unfollow a user
// @access  Private
router.post("/follow/:id", auth, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" })
    }

    const userToFollow = await User.findById(req.params.id)

    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" })
    }

    const isFollowing = req.user.following.includes(userToFollow._id)

    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: userToFollow._id } })

      await User.findByIdAndUpdate(userToFollow._id, { $pull: { followers: req.user._id } })

      res.json({ message: "User unfollowed" })
    } else {
      // Follow
      await User.findByIdAndUpdate(req.user._id, { $push: { following: userToFollow._id } })

      await User.findByIdAndUpdate(userToFollow._id, { $push: { followers: req.user._id } })

      // Create activity
      const activity = new Activity({
        user: req.user._id,
        type: "follow",
        targetUser: userToFollow._id,
      })

      await activity.save()

      res.json({ message: "User followed" })
    }
  } catch (error) {
    console.error("Follow/unfollow error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/social/feed
// @desc    Get activity feed
// @access  Private
router.get("/feed", auth, async (req, res) => {
  try {
    // Get users that current user is following
    const following = req.user.following

    // Get activities from following users and current user
    const activities = await Activity.find({
      $or: [{ user: { $in: [...following, req.user._id] } }, { targetUser: req.user._id }],
    })
      .populate("user", "name avatar")
      .populate("workout")
      .populate("targetUser", "name")
      .sort({ createdAt: -1 })
      .limit(20)

    // Format activities for frontend
    const formattedActivities = activities.map((activity) => {
      const base = {
        id: activity._id,
        user: {
          id: activity.user._id,
          name: activity.user.name,
          avatar: activity.user.avatar,
        },
        type: activity.type,
        likes: activity.likes.length,
        comments: activity.comments.length,
        createdAt: activity.createdAt,
        isLiked: activity.likes.includes(req.user._id),
      }

      if (activity.type === "workout" && activity.workout) {
        return {
          ...base,
          workout: {
            type: activity.workout.type,
            duration: activity.workout.duration,
            calories: activity.workout.calories,
          },
        }
      }

      if (activity.type === "post") {
        return {
          ...base,
          content: activity.content,
        }
      }

      if (activity.type === "follow" && activity.targetUser) {
        return {
          ...base,
          targetUser: {
            id: activity.targetUser._id,
            name: activity.targetUser.name,
          },
        }
      }

      return base
    })

    res.json(formattedActivities)
  } catch (error) {
    console.error("Get feed error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/social/post
// @desc    Create a post
// @access  Private
router.post("/post", auth, async (req, res) => {
  try {
    const { content } = req.body

    if (!content) {
      return res.status(400).json({ message: "Content is required" })
    }

    // Create activity
    const activity = new Activity({
      user: req.user._id,
      type: "post",
      content,
    })

    await activity.save()

    res.status(201).json(activity)
  } catch (error) {
    console.error("Create post error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/social/like/:id
// @desc    Like/unlike an activity
// @access  Private
router.post("/like/:id", auth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" })
    }

    const isLiked = activity.likes.includes(req.user._id)

    if (isLiked) {
      // Unlike
      activity.likes = activity.likes.filter((like) => like.toString() !== req.user._id.toString())
    } else {
      // Like
      activity.likes.push(req.user._id)
    }

    await activity.save()

    res.json({
      likes: activity.likes.length,
      isLiked: !isLiked,
    })
  } catch (error) {
    console.error("Like/unlike error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/social/comment/:id
// @desc    Comment on an activity
// @access  Private
router.post("/comment/:id", auth, async (req, res) => {
  try {
    const { text } = req.body

    if (!text) {
      return res.status(400).json({ message: "Text is required" })
    }

    const activity = await Activity.findById(req.params.id)

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" })
    }

    // Add comment
    activity.comments.push({
      user: req.user._id,
      text,
    })

    await activity.save()

    // Populate user info for the new comment
    const populatedActivity = await Activity.findById(req.params.id).populate("comments.user", "name avatar")

    res.json(populatedActivity.comments)
  } catch (error) {
    console.error("Comment error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router

