<template>
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-content">
      <h2 class="modal-header">Edit File</h2>
      <hr>

      <label for="file-name" class="label">File Name:</label>
      <!-- Display file name without extension initially -->
      <input type="text" id="file-name" v-model="fileData.file_name_without_extension" class="input-field" />

      <div class="file-size">
        <label for="file-size" class="label">File Size:</label>
        <p v-if="fileData.file_size" class="file-detail">{{ formattedSize(fileData.file_size) }}</p>
      </div>

      <div class="file-type">
        <label for="file-type" class="label">File Type:</label>
        <p v-if="fileData.file_type" class="file-detail">{{ fileData.file_type }} file</p>
      </div>

      <div class="modal-actions">
        <button class="save-button" @click="updateFileName">Save</button>
        <button class="cancel-button" @click="closeModal">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    showModal: Boolean,
    file: Object
  },
  data() {
    return {
      // Extracting file name without extension
      fileData: {
        file_name_without_extension: this.file.file_name.replace(/\.[^/.]+$/, ''),
        file_size: this.file.file_size,
        file_type: this.file.file_type
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close-modal');
    },
    formattedSize(sizeInBytes) {
      if (sizeInBytes < 1024) return `${sizeInBytes} B`;
      else if (sizeInBytes < 1048576) return `${(sizeInBytes / 1024).toFixed(2)} KB`;
      else if (sizeInBytes < 1073741824) return `${(sizeInBytes / 1048576).toFixed(2)} MB`;
      else return `${(sizeInBytes / 1073741824).toFixed(2)} GB`;
    },
    updateFileName() {
      // Append the extension back to the file name before saving
      const fileNameWithExtension = `${this.fileData.file_name_without_extension}.${this.file.file_type}`;

      // Emit the updated file name (including extension)
      this.$emit('update-file-name', fileNameWithExtension);


      // Optionally, close the modal after saving
      this.closeModal();
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 100%;
}

.modal-header {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
}

.label {
  display: block;
  margin-top: 10px;
  font-size: 18px;
  color: #333;
  text-align: left;
}

.input-field {
  width: 100%;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 5px;
  margin-right: 5px;
  margin-top: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  background-color: #fafafa;
}

.input-field:focus {
  border-color: #4CAF50;
  outline: none;
}

.file-detail {
  font-size: 18px;
  color: #666;
  margin-top: 5px;
}

.file-size, .file-type {
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  width: 48%;
}

.save-button {
  background-color: #1100ff;
  color: white;
}

.save-button:hover {
  opacity: 0.8;
}

.cancel-button {
  background-color: #f44336;
  color: white;
}

.cancel-button:hover {
  background-color: #e53935;
}
</style>
