<template>
  <div v-if="showModal" class="modal-overlay">
    <div class="modal">
      <h2>Add New File</h2>
      <form @submit.prevent="addNewFile">
        <div class="container">
          <div class="card">
            <div class="drop_box">
              <header>
                <h4>Select File Here</h4>
              </header>
              <input type="file" id="fileInput" @change="handleFileUpload" hidden />
              <button type="button" class="btn" @click="triggerFileInput">Choose File</button>
              <p v-if="file">
                <strong>Uploaded File Name:</strong> {{ file.name }} <br />
                <strong>Uploaded File Size:</strong> {{ formattedSize(file.size) }} <br />
                <strong>Uploaded File Type:</strong> {{ fileExtension }}
              </p>
            </div>
          </div>
        </div>
        <div v-if="isUploading" class="loading-indicator">
          <span>Uploading...</span>
        </div>

        <div class="modal-actions">
          <button type="submit" class="Add" :disabled="!file">Submit</button>
          <button type="button" @click="closeModal" class="Cancel">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "AddFileModal",
  props: {
    showModal: {
      type: Boolean,
      required: true,
    },
    folder_id: {
      type: [Number, null], // Accept number or null
      required: false, // Make it optional if null is acceptable
    },
  },
  data() {
    return {
      file: null, // To store the selected file object
      fileExtension: "",
      isUploading: false, // Optional: Track uploading state if necessary
    };
  },
  methods: {
    triggerFileInput() {
      // Trigger the hidden file input
      document.getElementById("fileInput").click();
    },
    handleFileUpload(event) {
      // Handle the file upload and store the file details
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        this.file = selectedFile;
        this.fileExtension = this.getFileExtension(selectedFile.name);
      }
    },
    formattedSize(sizeInBytes) {
      if (sizeInBytes < 1024) return `${sizeInBytes} B`;
      else if (sizeInBytes < 1048576) return `${(sizeInBytes / 1024).toFixed(2)} KB`;
      else if (sizeInBytes < 1073741824) return `${(sizeInBytes / 1048576).toFixed(2)} MB`;
      else return `${(sizeInBytes / 1073741824).toFixed(2)} GB`;
    },
    addNewFile() {
      if (this.file) {

        this.isUploading = true; // Optionally show loading state
        const formData = new FormData();
        formData.append("file", this.file);
        formData.append("file_name", this.file.name);
        formData.append("file_size", this.file.size);
        formData.append("file_type", this.fileExtension);
        formData.append("folder_id", this.folder_id); // Add folder_id to FormData
        formData.append("created_at", new Date().toISOString());
        formData.append("updated_at", new Date().toISOString());

        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }
        // Send the file via Axios
        axios.post('http://localhost:5000/api/files/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
          .then(response => {
            console.log('File uploaded successfully:', response.data);
            this.$emit("add-file", response.data.file); // Pass file info to the parent component
            this.resetForm();
            this.closeModal();
            window.location.reload();
          })
          .catch(error => {
            console.error('Error uploading file:', error);
          })
          .finally(() => {
            this.isUploading = false; // Reset the uploading state
          });
      }
    },

    getFileExtension(fileName) {
      // Get the file extension from the file name
      const parts = fileName.split(".");
      return parts[parts.length - 1];
    },
    closeModal() {
      this.$emit("close-modal"); // Notify the parent to close the modal
    },
    resetForm() {
      this.file = null; // Reset the file selection
      this.fileExtension = ""; // Reset the file extension
      document.getElementById("fileInput").value = ""; // Clear the file input
    },
  },
};
</script>

<style scoped>
/* Modal styling and button design */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}

.modal-actions {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.modal-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.Add {
  background-color: #1d02ce;
  color: white;
}

.Cancel {
  background-color: #f44336;
  color: white;
}

.card h3 {
  font-size: 22px;
  font-weight: 600;
}

.drop_box {
  margin: 10px 0;
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border: 3px dotted #a3a3a3;
  border-radius: 5px;
}

.drop_box h4 {
  font-size: 16px;
  font-weight: 400;
  color: #2e2e2e;
}

.drop_box p {
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 12px;
  color: #a3a3a3;
}

.btn {
  text-decoration: none;
  background-color: #005af0;
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  outline: none;
  transition: 0.3s;
  cursor: pointer;
}

.btn:hover {
  text-decoration: none;
  background-color: #ffffff;
  color: #005af0;
  padding: 10px 20px;
  border: none;
  outline: 1px solid #010101;
}

.loading-indicator {
  text-align: center;
  margin: 10px 0;
  font-size: 14px;
  color: #888;
}
</style>
