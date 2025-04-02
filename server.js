
const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const axios = require("axios")
const multer = require("multer")
const fs = require("fs")
const Image = require("./models/image")
const app = express()
const PORT = process.env.PORT || 3000

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://mongodb:27017/imagegallery", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))

// Set up storage for downloaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./public/uploads"
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})

const upload = multer({ storage })

// API Routes
// Fetch images from Pexels API
app.get("/api/images", async (req, res) => {
  try {
    const query = req.query.query || "nature"
    const response = await axios.get(`https://api.pexels.com/v1/search?query=${query}&per_page=15`, {
      headers: {
        Authorization: process.env.PEXELS_API_KEY || "",
      },
    })

    const images = response.data.photos.map((photo) => ({
      id: photo.id,
      url: photo.src.medium,
      photographer: photo.photographer,
      description: photo.alt || photo.photographer,
    }))

    res.json(images)
  } catch (error) {
    console.error("Error fetching images:", error)
    res.status(500).json({ error: "Failed to fetch images" })
  }
})

// Save image to MongoDB
app.post("/api/images", async (req, res) => {
  try {
    const { url, description } = req.body

    if (!url) {
      return res.status(400).json({ error: "Image URL is required" })
    }

    // Download the image
    const imageResponse = await axios({
      url,
      method: "GET",
      responseType: "stream",
    })

    const filename = Date.now() + ".jpg"
    const filepath = path.join(__dirname, "public/uploads", filename)
    const writer = fs.createWriteStream(filepath)

    imageResponse.data.pipe(writer)

    writer.on("finish", async () => {
      // Save image info to MongoDB
      const newImage = new Image({
        url: `/uploads/${filename}`,
        originalUrl: url,
        description: description || "No description",
        createdAt: new Date(),
      })

      await newImage.save()
      res.status(201).json(newImage)
    })

    writer.on("error", (err) => {
      console.error("Error saving image file:", err)
      res.status(500).json({ error: "Failed to save image file" })
    })
  } catch (error) {
    console.error("Error saving image:", error)
    res.status(500).json({ error: "Failed to save image" })
  }
})

// Get all saved images
app.get("/api/saved-images", async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 })
    res.json(images)
  } catch (error) {
    console.error("Error fetching saved images:", error)
    res.status(500).json({ error: "Failed to fetch saved images" })
  }
})

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.get("/saved", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "saved.html"))
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

