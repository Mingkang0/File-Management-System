const path = require("path");
const express = require("express");

const { addFolder, getFolders, deleteFolder, updateFolderName } = require("../controllers/folderController");

const router = express.Router();

router.post('/add', addFolder);
router.get('/list', getFolders);

router.delete('/delete/:id', deleteFolder);

router.put('/update/:id', (req, res) => {
  console.log('PUT route hit');
  const { id } = req.params;
  const { folder_name } = req.body;
  console.log('folderId:', id + ' ' + folder_name);
  updateFolderName(req, res);
});

module.exports = router;