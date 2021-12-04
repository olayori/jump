const express = require('express');
const fs = require('fs');
const http = require('https');
const app = express();
app.use(express.json());

const url = 'https://www.learningcontainer.com/wp-content/uploads/2020/04/sample-text-file.txt';
const file = fs.createWriteStream("sample.txt");  
http.get(url, function(response) { response.pipe(file);});

app.get('/manage_file', (req, res) => {
  const action = req.body.action
  if (action && action.toLowerCase() === "read"){
      res.redirect(url);
  } else if (action && action.toLowerCase() === "download") {  
      res.status(200).download('./sample.txt')
  } else {
      res.status(400).send('Invalid Request (No key "action" found in request)')
  }      
});

app.get('/', (req, res) => {
    res.status(404).send("No valid endpoint here");
});

app.listen(80, () => console.log('Listening on port 80...')); 