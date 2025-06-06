# Image Gallery Application

A full-stack web application that allows users to search for images using the Pexels API and save their favorite images to a MongoDB database.

## Features

- Search for images using keywords
- View image search results from Pexels API
- Save favorite images to MongoDB
- View all saved images in a gallery
- Responsive design for desktop and mobile devices

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **API**: Pexels API for image search
- **Containerization**: Docker, Docker Compose

## Prerequisites

Before running this application, you need to have the following installed:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Pexels API Key](https://www.pexels.com/api/) (free)

## Setup and Installation

1. Clone this repository:

   ```
   git clone <repository-url>
   cd des-project
   ```

2. Create a `.env` file in the project root with your Pexels API key:

   ```
   PEXELS_API_KEY=your_pexels_api_key_here
   ```

3. Build and start the containers using Docker Compose:

   ```
   docker compose up -d --build
   ```

4. Access the application in your browser:
   ```
   http://localhost:3000
   ```

## Project Structure

```
.
├── docker-compose.yml    # Docker Compose configuration
├── Dockerfile            # Docker configuration for Node.js app
├── package.json          # Node.js dependencies
├── server.js             # Express.js server
├── models/               # MongoDB models
│   └── image.js          # Image schema
└── public/               # Frontend files
    ├── index.html        # Search page
    ├── saved.html        # Saved images page
    ├── css/              # CSS styles
    │   └── style.css     # Main styles
    └── js/               # JavaScript files
        ├── main.js       # Search page functionality
        └── saved.js      # Saved images page functionality
```

## Using the Application

1. **Search for Images**:

   - Go to the home page (`/`)
   - Enter a search term in the search bar
   - Click "Search" to see results from Pexels API
   - Click "Save" on any image to save it to your collection

2. **View Saved Images**:
   - Click "Saved Images" in the navigation
   - View all images you've saved to MongoDB

## Database Management

To access the MongoDB database directly:

1. Connect to the MongoDB container:

   ```
   docker exec -it des-project-mongodb-1 mongosh
   ```

2. Use the application database:

   ```
   use imagegallery
   ```

3. View saved images:

   ```
   db.images.find().pretty()
   ```

4. Clear all saved images:
   ```
   db.images.deleteMany({})
   ```

## Troubleshooting

If you encounter Docker connectivity issues:

1. Flush DNS cache:

   ```
   ipconfig /flushdns
   ```

2. Restart Docker Desktop

3. Check firewall settings to ensure Docker can access the internet

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Pexels](https://www.pexels.com/) for providing the image API
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Docker](https://www.docker.com/)
