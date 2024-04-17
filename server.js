const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const app = express();

const mongoUri = "mongodb+srv://qfloyd:myR7edfSSZug7AZe@atlascluster.gag1v4a.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster";

const sneakerSchema = new mongoose.Schema({
  imgSrc: String,
  alt: String,
  title: String,
  releaseDate: String,
  description: String
});


const Sneaker = mongoose.model('Sneaker', sneakerSchema);


const insertSneakerNewsToMongoDB = () => {
  const sneakerNewsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'blog', 'sneaker-news.json'), 'utf8'));

  Sneaker.insertMany(sneakerNewsData.sneakers)
    .then(() => console.log('Sneaker news data has been inserted into MongoDB'))
    .catch(err => console.error('Error inserting sneaker news data into MongoDB', err));
};

mongoose.connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB...');
   
  })
  .catch(err => console.error('Could not connect to MongoDB...', err));

app.use(express.static(path.join(__dirname, 'final')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'final', 'index.html'));
});

app.get('/blog/sneaker-news', (req, res) => {
  Sneaker.findOne({}, (err, doc) => {
    if (err) {
      console.error('Error retrieving sneaker news from the database:', err);
      res.status(500).send('Error retrieving sneaker news from the database');
    } else {
      
      res.json(doc.sneakers);
    }
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});
