import express from "express"
import User from "../models/User.js"
import Workout from "../models/Workout.js"
import auth from "../middleware/auth.js"

const router = express.Router()

// @route   GET /api/users/me
// @desc    Get current user
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")
    res.json(user)
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/users/profile
// @desc    Get user profile with stats
// @access  Private
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")

    // Get workout count
    const workoutCount = await Workout.countDocuments({ user: req.user._id })

    // Get follower and following counts
    const followerCount = user.followers.length
    const followingCount = user.following.length

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      fitnessGoal: user.fitnessGoal,
      stats: {
        workouts: workoutCount,
        followers: followerCount,
        following: followingCount,
      },
    })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, bio, fitnessGoal } = req.body

    // Update user
    const user = await User.findByIdAndUpdate(req.user._id, { name, bio, fitnessGoal }, { new: true }).select(
      "-password",
    )

    res.json(user)
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router

