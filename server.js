const express = require('express');
const fs = require('fs');
const download = require('download');
const app = express();
app.use(express.json());

const file = 'sample-text-file.txt';
const url = `https://www.learningcontainer.com/wp-content/uploads/2020/04/${file}`;

//processing requests to /manage_file
app.post('/manage_file', (req, res) => { 
  const action = req.body.action;
  if (action && action.toLowerCase() === "read"){
    download(url,'./').then(() => {
        res.status(200).send(fs.readFileSync(file,'utf8'));
        console.log('File successfully read');
    })  
  } else if (action && action.toLowerCase() === "download") { 
        download(url,'./').then(() => {
            res.status(200).download(file);
            console.log('File successfully downloaded');
    }) 
  } else {
      const errmess = 'Invalid Request (No valid value for key "action" found in request)';
      res.status(400).send(errmessage)
      console.log(errmessage);
  }      
});

//processing requests sent to web root
app.post('/', (req, res) => {
    res.status(404).send("No valid endpoint here");
    console.log('Invalid endpoint');
});

//Error handling
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: "syntax error"
    });
    console.log(err.message);
  });  

//Http server 
app.listen(80, () => console.log('Listening on port 80...')); 