document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input")
    const searchButton = document.getElementById("search-button")
    const imageGallery = document.getElementById("image-gallery")
    const loadingElement = document.getElementById("loading")
  
    // Set default search term
    searchInput.value = "nature"
  
    // Fetch images on page load
    fetchImages("nature")
  
    // Add event listeners
    searchButton.addEventListener("click", () => {
      const query = searchInput.value.trim()
      if (query) {
        fetchImages(query)
      }
    })
  
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const query = searchInput.value.trim()
        if (query) {
          fetchImages(query)
        }
      }
    })
  
    // Function to fetch images from API
    async function fetchImages(query) {
      try {
        // Show loading spinner
        loadingElement.classList.remove("hidden")
        imageGallery.innerHTML = ""
  
        const response = await fetch(`/api/images?query=${encodeURIComponent(query)}`)
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
  
        const images = await response.json()
  
        // Hide loading spinner
        loadingElement.classList.add("hidden")
  
        // Display images
        displayImages(images)
      } catch (error) {
        console.error("Error fetching images:", error)
        loadingElement.classList.add("hidden")
        imageGallery.innerHTML = `<p class="error">Error loading images. Please try again.</p>`
      }
    }
  
    // Function to display images in the gallery
    function displayImages(images) {
      if (images.length === 0) {
        imageGallery.innerHTML = `<p class="no-results">No images found. Try a different search term.</p>`
        return
      }
  
      images.forEach((image) => {
        const imageCard = document.createElement("div")
        imageCard.className = "image-card"
  
        imageCard.innerHTML = `
          <div class="image-container">
            <img src="${image.url}" alt="${image.description || "Image"}" loading="lazy">
          </div>
          <div class="image-info">
            <p>${image.description || "No description"}</p>
            <p><i class="fas fa-camera"></i> By: ${image.photographer || "Unknown"}</p>
            <button class="save-button" data-url="${image.url}" data-description="${image.description || "No description"}">
              <i class="fas fa-save"></i> Save Image
            </button>
          </div>
        `
  
        imageGallery.appendChild(imageCard)
      })
  
      // Add event listeners to save buttons
      document.querySelectorAll(".save-button").forEach((button) => {
        button.addEventListener("click", saveImage)
      })
    }
  
    // Function to save an image
    async function saveImage(e) {
      const button = e.target.closest(".save-button")
      const url = button.getAttribute("data-url")
      const description = button.getAttribute("data-description")
  
      try {
        button.disabled = true
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...'
  
        const response = await fetch("/api/images", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url, description }),
        })
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
  
        const result = await response.json()
  
        button.innerHTML = '<i class="fas fa-check"></i> Saved!'
        button.style.backgroundColor = "#00c853"
  
        setTimeout(() => {
          button.innerHTML = '<i class="fas fa-save"></i> Save Image'
          button.disabled = false
          button.style.backgroundColor = ""
        }, 2000)
      } catch (error) {
        console.error("Error saving image:", error)
        button.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error!'
        button.style.backgroundColor = "#f44336"
  
        setTimeout(() => {
          button.innerHTML = '<i class="fas fa-save"></i> Save Image'
          button.disabled = false
          button.style.backgroundColor = ""
        }, 2000)
      }
    }
  })
  
  