const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');

// Multer setup for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

const app = express();
app.use(cors()); // Allow cross-origin requests
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection setup
mongoose.connect("mongodb+srv://qfloyd:myR7edfSSZug7AZe@atlascluster.gag1v4a.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB...");
}).catch(err => {
    console.error("Could not connect to MongoDB...", err);
});

// Mongoose model for sneakers
const sneakerSchema = new mongoose.Schema({
  name: String,
  releaseDate: String,
  description: String,
  image: String  // Storing the path to the image file
});
const Sneaker = mongoose.model('Sneaker', sneakerSchema);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to add a new sneaker
app.post('/api/sneakers', upload.single('image'), (req, res) => {
    const { name, releaseDate, description } = req.body;
    const image = req.file.path;
    const newSneaker = new Sneaker({ name, releaseDate, description, image });

    newSneaker.save()
        .then(() => res.status(201).send('Sneaker added successfully'))
        .catch(err => res.status(500).send('Error saving sneaker data'));
});

// Endpoint to fetch all sneakers
app.get('/api/sneakers', (req, res) => {
    Sneaker.find()
    .then(sneakers => res.json({ sneakers }))
    .catch(err => res.status(500).send('Error retrieving sneaker data from MongoDB'));
});

// Endpoint to update an existing sneaker
app.put('/api/sneakers/:id', upload.single('image'), (req, res) => {
    const { name, releaseDate, description } = req.body;
    const image = req.file ? req.file.path : undefined;
    const updateData = { name, releaseDate, description };

    if (image) updateData.image = image;

    Sneaker.findByIdAndUpdate(req.params.id, updateData, { new: true })
        .then(sneaker => res.json(sneaker))
        .catch(err => res.status(500).send('Error updating sneaker data'));
});

// Endpoint to delete a sneaker
app.delete('/api/sneakers/:id', (req, res) => {
    Sneaker.findByIdAndRemove(req.params.id)
        .then(() => res.send('Sneaker deleted successfully'))
        .catch(err => res.status(500).send('Error deleting sneaker'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`);
});
