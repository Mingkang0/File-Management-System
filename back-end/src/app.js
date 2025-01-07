const express = require('express');
const cors = require('cors');
const fileController = require('./controllers/fileController');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fileRoutes = require('./routes/fileRoutes');
const folderRoutes = require('./routes/folderRoutes'); // Import the folderRoutes module

const app = express();
app.use(cors(
  {
    origin: 'http://localhost:8081',
    credentials: true,
    methods: 'GET, POST, PUT, DELETE',
  }
));
app.use(express.json());

app.use('/api/files', fileRoutes);
app.use('/api/folders', folderRoutes); // Use the folderRoutes module

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});