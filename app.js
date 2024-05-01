// app.js
const express = require('express');
const path = require('path');
const app = express();
const indexRouter = require('./routes/index');
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors()); 

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

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
