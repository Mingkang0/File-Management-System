<template>
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-content">
      <h2 class="modal-header">Edit Folder</h2>
      <hr />

      <label for="folder-name" class="label">Folder Name:</label>
      <!-- Display folder name initially -->
      <input
        type="text"
        id="folder-name"
        v-model="folderData.folder_name"
        class="input-field"
      />

      <div class="modal-actions">
        <button class="save-button" @click="updateFolderName">Save</button>
        <button class="cancel-button" @click="closeModal">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showModal: Boolean,
    folder: Object,
  },
  data() {
    return {
      folderData: {
        folder_name: this.folder.folder_name,
      },
    };
  },
  methods: {
    closeModal() {
      this.$emit("close-modal");
    },
    updateFolderName() {
      // Emit the updated folder name
      this.$emit("update-folder-name", this.folderData.folder_name);

      // Optionally, close the modal after saving
      this.closeModal();
    },
  },
};
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
  padding: 12px;
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
