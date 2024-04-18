const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const multer = require('multer');
const cors = require('cors');

const app = express();


const mongoUri = "mongodb+srv://qfloyd:myR7edfSSZug7AZe@atlascluster.gag1v4a.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster"; 


mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));


const sneakerSchema = new mongoose.Schema({
  imgSrc: String,
  alt: String,
  title: String,
  releaseDate: String,
  description: String
});

const Sneaker = mongoose.model('Sneaker', sneakerSchema);

// Initialize sneaker data
const initializeSneakerData = () => {
  const data = fs.readFileSync('/mnt/data/sneakers', 'utf8');
  const jsonData = JSON.parse(data);

  Sneaker.deleteMany({})
    .then(() => Sneaker.insertMany(jsonData.sneakers))
    .then(() => console.log('Sneaker data has been initialized in MongoDB'))
    .catch(err => console.error('Error initializing sneaker data in MongoDB', err));
};

// Middleware
app.use(express.static(path.join(__dirname, 'final')));
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'final', 'index.html'));
});

app.get('/api/sneakers', (req, res) => {
  Sneaker.find()
    .then(sneakers => res.json({ sneakers }))
    .catch(err => res.status(500).send('Error retrieving sneaker data from MongoDB'));
});

app.get('/sell', (req, res) => {
  res.sendFile(path.join(__dirname, 'final', 'sell', 'index.html'));
});

app.get('/blog', (req, res) => {
  res.sendFile(path.join(__dirname, 'final', 'index.html'));
});

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});
