const client = require("../config/db");
const fs = require("fs");
const path = require("path");
const multer = require("multer");


const addFolder = (req, res) => {
  const { folder_name, parent_id } = req.body;

  const query = "INSERT INTO folders (folder_name, parent_id) VALUES ($1, $2)";
  const values = [folder_name, parent_id === 'null' ? null : parent_id];

  client
    .query(query, values)
    .then(() => res.json({ message: "Folder added successfully" }))
    .catch((err) => res.status(500).json({ error: err.message }));
};

const getFolders = (req, res) => {
  const parentId = req.query.parentId === 'null' || req.query.parentId === undefined ? null : req.query.parentId;

  const query = parentId
    ? "SELECT * FROM folders WHERE parent_id = $1"
    : "SELECT * FROM folders WHERE parent_id IS NULL";
  
  const values = parentId ? [parentId] : [];

  client
    .query(query, values)
    .then((result) => res.json(result.rows))
    .catch((err) => res.status(500).json({ error: err.message }));
};


const deleteFolder = async (req, res) => {
  const { id } = req.params;

  try {
    // Start a transaction
    await client.query("BEGIN");

    // Delete all files associated with the folder
    const deleteFilesQuery = "DELETE FROM files WHERE folder_id = $1";
    await client.query(deleteFilesQuery, [id]);

    // Recursively delete subfolders and their files
    const getSubfoldersQuery = "SELECT id FROM folders WHERE parent_id = $1";
    const subfoldersResult = await client.query(getSubfoldersQuery, [id]);

    const subfolderIds = subfoldersResult.rows.map(row => row.id);

    for (const subfolderId of subfolderIds) {
      await deleteFolder({ params: { id: subfolderId } }, { json: () => {}, status: () => ({ json: () => {} }) });
    }

    // Delete the folder itself
    const deleteFolderQuery = "DELETE FROM folders WHERE id = $1";
    await client.query(deleteFolderQuery, [id]);

    // Commit the transaction
    await client.query("COMMIT");

    res.json({ message: "Folder and its contents deleted successfully" });
  } catch (error) {
    // Rollback the transaction in case of an error
    await client.query("ROLLBACK");
    res.status(500).json({ error: error.message });
  }
};

const updateFolderName = (req, res) => {
  const { id } = req.params;
  const { folder_name } = req.body;

  const query = "UPDATE folders SET folder_name = $1 WHERE id = $2";
  const values = [folder_name, id];

  client
    .query(query, values)
    .then(() => res.json({ message: "Folder name updated successfully" }))
    .catch((err) => res.status(500).json({ error: err.message }));
}



module.exports = { addFolder, getFolders, deleteFolder, updateFolderName };