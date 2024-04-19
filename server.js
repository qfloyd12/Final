const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');

const app = express();
app.use(cors()); 
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


mongoose.connect("mongodb+srv://qfloyd:myR7edfSSZug7AZe@atlascluster.gag1v4a.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error("Could not connect to MongoDB...", err));


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


const Sneaker = mongoose.model('Sneaker', new mongoose.Schema({
  name: String,
  releaseDate: String,
  description: String,
  image: String 
}));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.post('/api/sneakers', upload.single('image'), (req, res) => {
    const { name, releaseDate, description } = req.body;
    const image = req.file ? req.file.path : '';
    const newSneaker = new Sneaker({ name, releaseDate, description, image });

    newSneaker.save()
        .then(() => res.status(201).send({ message: 'Sneaker added successfully', sneaker: newSneaker }))
        .catch(err => res.status(500).send({ error: 'Error saving sneaker data', details: err.message }));
});

app.get('/api/sneakers', (req, res) => {
    Sneaker.find()
        .then(sneakers => res.json({ sneakers }))
        .catch(err => res.status(500).send({ error: 'Error retrieving sneaker data from MongoDB', details: err.message }));
});


app.put('/api/sneakers/:id', upload.single('image'), (req, res) => {
    const { name, releaseDate, description } = req.body;
    const updateData = { name, releaseDate, description };

    if (req.file) {
        updateData.image = req.file.path;
    }

    Sneaker.findByIdAndUpdate(req.params.id, updateData, { new: true })
        .then(sneaker => res.json({ message: 'Sneaker updated successfully', sneaker }))
        .catch(err => res.status(500).send({ error: 'Error updating sneaker data', details: err.message }));
});


app.delete('/api/sneakers/:id', (req, res) => {
    Sneaker.findByIdAndRemove(req.params.id)
        .then(() => res.send({ message: 'Sneaker deleted successfully' }))
        .catch(err => res.status(500).send({ error: 'Error deleting sneaker', details: err.message }));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`);
});
