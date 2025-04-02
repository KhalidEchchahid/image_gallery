document.addEventListener("DOMContentLoaded", () => {
    const savedGallery = document.getElementById("saved-gallery")
    const loadingElement = document.getElementById("loading")
    const noImagesElement = document.getElementById("no-images")
  
    // Fetch saved images on page load
    fetchSavedImages()
  
    // Function to fetch saved images from API
    async function fetchSavedImages() {
      try {
        // Show loading spinner
        loadingElement.classList.remove("hidden")
        savedGallery.innerHTML = ""
  
        const response = await fetch("/api/saved-images")
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
  
        const images = await response.json()
  
        // Hide loading spinner
        loadingElement.classList.add("hidden")
  
        // Display images or show no images message
        if (images.length === 0) {
          noImagesElement.classList.remove("hidden")
        } else {
          noImagesElement.classList.add("hidden")
          displaySavedImages(images)
        }
      } catch (error) {
        console.error("Error fetching saved images:", error)
        loadingElement.classList.add("hidden")
        savedGallery.innerHTML = `<p class="error">Error loading saved images. Please try again.</p>`
      }
    }
  
    // Function to display saved images in the gallery
    function displaySavedImages(images) {
      images.forEach((image) => {
        const imageCard = document.createElement("div")
        imageCard.className = "image-card"
  
        const date = new Date(image.createdAt).toLocaleDateString()
  
        imageCard.innerHTML = `
          <div class="image-container">
            <img src="${image.url}" alt="${image.description || "Saved image"}" loading="lazy">
          </div>
          <div class="image-info">
            <p>${image.description || "No description"}</p>
            <p><i class="fas fa-calendar-alt"></i> Saved on: ${date}</p>
          </div>
        `
  
        savedGallery.appendChild(imageCard)
      })
    }
  })
  
  