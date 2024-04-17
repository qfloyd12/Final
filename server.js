const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs'); 

const app = express();
const mongoUri = "mongodb+srv://qfloyd:myR7edfSSZug7AZe@atlascluster.gag1v4a.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster"; 
const Content = mongoose.model('Content', contentSchema);


const insertSellContentToMongoDB = () => {

  const jsonData = JSON.parse(fs.readFileSync('path/to/content.json', 'utf8'));

  if (jsonData && jsonData.content) {
    const sellContent = new Content(jsonData.content);
    
    sellContent.save()
      .then(doc => {
        console.log('Sell content data has been inserted into MongoDB', doc);
      })
      .catch(err => {
        console.error('Error inserting sell content data into MongoDB', err);
      });
  }
};

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB...');
   
    insertSellContentToMongoDB();
  })
  .catch(err => console.error('Could not connect to MongoDB...', err));


app.use(express.static(path.join(__dirname, 'final')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'final', 'index.html'));
});


app.get('/sell', (req, res) => {
  res.sendFile(path.join(__dirname, 'final', 'sell', 'index.html'));
});

app.get('/blog/sneaker-news', (req, res) => {
  res.json(sneakerNews);
});




const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});
