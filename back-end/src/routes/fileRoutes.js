const path = require("path");
const express = require("express");

const { getFiles, uploadFile, upload, deleteFile, updateFileName } = require("../controllers/fileController");

const router = express.Router();
router.get('/list', getFiles);

router.post('/upload', upload.single('file'), uploadFile);


router.put('/update/:id', (req, res) => {
  console.log('PUT route hit');
  const { id } = req.params;
  const { file_name } = req.body;
  console.log('fileId:', id + ' ' + file_name);
  updateFileName(req, res);
});

// DELETE endpoint for deleting a file
router.delete('/delete/:id', (req, res) => {
  console.log('DELETE route hit');
  const { id } = req.params;
  console.log('fileId:', id);
  deleteFile(id, res);
});


module.exports = router;