import express from "express"
import Workout from "../models/Workout.js"
import Activity from "../models/Activity.js"
import auth from "../middleware/auth.js"

const router = express.Router()

// @route   POST /api/workouts
// @desc    Create a workout
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const { type, duration, calories, notes } = req.body

    // Create workout
    const workout = new Workout({
      user: req.user._id,
      type,
      duration,
      calories,
      notes,
    })

    await workout.save()

    // Create activity for the workout
    const activity = new Activity({
      user: req.user._id,
      type: "workout",
      workout: workout._id,
    })

    await activity.save()

    res.status(201).json(workout)
  } catch (error) {
    console.error("Create workout error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/workouts
// @desc    Get all workouts for a user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user._id }).sort({ createdAt: -1 })

    res.json(workouts)
  } catch (error) {
    console.error("Get workouts error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/workouts/:id
// @desc    Get a workout by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id)

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" })
    }

    // Check if workout belongs to user
    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" })
    }

    res.json(workout)
  } catch (error) {
    console.error("Get workout error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/workouts/:id
// @desc    Update a workout
// @access  Private
router.put("/:id", auth, async (req, res) => {
  try {
    const { type, duration, calories, notes } = req.body

    let workout = await Workout.findById(req.params.id)

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" })
    }

    // Check if workout belongs to user
    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" })
    }

    // Update workout
    workout = await Workout.findByIdAndUpdate(req.params.id, { type, duration, calories, notes }, { new: true })

    res.json(workout)
  } catch (error) {
    console.error("Update workout error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   DELETE /api/workouts/:id
// @desc    Delete a workout
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id)

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" })
    }

    // Check if workout belongs to user
    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" })
    }

    // Delete workout
    await workout.remove()

    // Delete associated activity
    await Activity.deleteOne({ workout: workout._id })

    res.json({ message: "Workout removed" })
  } catch (error) {
    console.error("Delete workout error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/workouts/summary
// @desc    Get workout summary
// @access  Private
router.get("/summary", auth, async (req, res) => {
  try {
    // Get total workouts
    const totalWorkouts = await Workout.countDocuments({ user: req.user._id })

    // Get total duration
    const durationResult = await Workout.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: null, total: { $sum: "$duration" } } },
    ])

    const totalDuration = durationResult.length > 0 ? durationResult[0].total : 0

    // Get total calories
    const caloriesResult = await Workout.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: null, total: { $sum: "$calories" } } },
    ])

    const totalCalories = caloriesResult.length > 0 ? caloriesResult[0].total : 0

    res.json({
      totalWorkouts,
      totalDuration,
      totalCalories,
    })
  } catch (error) {
    console.error("Get workout summary error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/workouts/stats
// @desc    Get workout stats for charts
// @access  Private
router.get("/stats", auth, async (req, res) => {
  try {
    // Get workouts for the last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const workouts = await Workout.find({
      user: req.user._id,
      createdAt: { $gte: sevenDaysAgo },
    }).sort({ createdAt: 1 })

    // Format data for charts
    const stats = workouts.map((workout) => ({
      date: workout.createdAt.toLocaleDateString("en-US", { weekday: "short" }),
      duration: workout.duration,
      calories: workout.calories,
      type: workout.type,
    }))

    res.json(stats)
  } catch (error) {
    console.error("Get workout stats error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router

