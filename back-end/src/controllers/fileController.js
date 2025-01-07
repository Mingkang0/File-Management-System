const client = require("../config/db");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const getFiles = (req, res) => {
  const folderId = req.query.folderId === "null" ? null : req.query.folderId;

  const query = folderId
    ? "SELECT * FROM files WHERE folder_id = $1"
    : "SELECT * FROM files WHERE folder_id IS NULL";
  const values = folderId ? [folderId] : [];

  client
    .query(query, values)
    .then((result) => res.json(result.rows))
    .catch((err) => res.status(500).json({ error: err.message }));
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Upload file handler (with middleware)
const uploadFile = (req, res) => {
  const { file_name, file_type, file_size, folder_id } = req.body;

  if (req.file) {
    // Insert file metadata into the database
    const query =
      "INSERT INTO files (file_name, file_type, file_size, folder_id) VALUES ($1, $2, $3, $4)";
    const values = [file_name, file_type, file_size, folder_id === "null" ? null : folder_id];

    client
      .query(query, values)
      .then(() => res.json({ message: "File uploaded successfully" }))
      .catch((err) => res.status(500).json({ error: err.message }));
  } else {
    res.status(400).json({ error: "No file uploaded" });
  }
};


const updateFileName = (req, res) => {
  const { id } = req.params;
  const { file_name } = req.body;

  console.log("Requested fileId:", id, "New file name:", file_name);

  // Step 1: Fetch the current file name from the database
  const selectQuery = "SELECT file_name FROM files WHERE id = $1";
  const updateQuery = "UPDATE files SET file_name = $1 WHERE id = $2";

  client
    .query(selectQuery, [id])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(404).json({ error: `File with id ${id} not found` });
      }

      const currentFileName = result.rows[0].file_name;
      console.log("Current file name:", currentFileName);

      // Step 2: Rename the file in the 'uploads' folder
      const currentPath = path.resolve(__dirname, '../../uploads', currentFileName);
      const newPath = path.resolve(__dirname, '../../uploads', file_name);

      console.log("Renaming file:", currentPath, "->", newPath);

      if (fs.existsSync(currentPath)) {
        fs.rename(currentPath, newPath, (err) => {
          if (err) {
            console.error("Error renaming file:", err);
            return res.status(500).json({ error: `Failed to rename file: ${err.message}` });
          }

          // Step 3: Update the file name in the database
          client
            .query(updateQuery, [file_name, id])
            .then(() => {
              console.log(`File name updated successfully in the database for id ${id}`);
              res.json({ message: "File name updated successfully" });
            })
            .catch((err) => {
              console.error("Error updating database:", err);
              // Revert file rename if database update fails
              fs.rename(newPath, currentPath, () => {
                console.error("Reverted file rename due to database update failure.");
              });
              res.status(500).json({ error: `Database update failed: ${err.message}` });
            });
        });
      } else {
        console.error("File does not exist in the uploads folder.");
        res.status(404).json({ error: `File does not exist in uploads folder` });
      }
    })
    .catch((err) => {
      console.error("Error querying database:", err);
      res.status(500).json({ error: `Database query failed: ${err.message}` });
    });
};


const deleteFile = (fileId, res) => {
  const query = "SELECT * FROM files WHERE id = $1";
  const values = [fileId];

  // Log the fileId to make sure it's correct
  console.log("Requested fileId:", fileId);

  client
    .query(query, values)
    .then((result) => {
      // Log the result to see if the file exists
      console.log("Database query result:", result.rows);

      if (result.rows.length === 0) {
        // If no file is found, return a 404 error with a message
        return res
          .status(404)
          .json({ error: `File with id ${fileId} not found` });
      }

      const file = result.rows[0];
      console.log("File found:", file);
      // Correctly resolve the file path by navigating up from 'controllers' to the root
      const filePath = path.resolve(
        __dirname,
        "../../uploads",
        file.file_name
      );

      console.log("current directory:", __dirname);
      console.log("File path for deletion:", filePath);

      // Delete the file from the filesystem
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          return res.status(500).json({ error: err.message });
        } else {
          // Proceed to delete the file record from the database
          const deleteQuery = "DELETE FROM files WHERE id = $1";
          client
            .query(deleteQuery, values)
            .then(() => {
              console.log(`File with id ${fileId} deleted from database.`);
              res.json({
                message: `File with id ${fileId} deleted successfully`,
              });
            })
            .catch((err) => {
              console.error("Error deleting file from database:", err);
              res.status(500).json({ error: err.message });
            });
        }
      });
    })
    .catch((err) => {
      console.error("Error querying the database:", err);
      res.status(500).json({ error: err.message });
    });
};

module.exports = { getFiles, uploadFile, upload, deleteFile, updateFileName };
