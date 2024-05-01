// app.js
const express = require('express');
const path = require('path');
const app = express();
const indexRouter = require('./routes/index');
const cors = require('cors');


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); 

// Routes
app.use('/', indexRouter);
app.use('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
