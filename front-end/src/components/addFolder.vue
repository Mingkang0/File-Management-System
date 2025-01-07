<template>
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <span class="close" @click="$emit('close-modal')">&times;</span>
      <h2>Add Folder</h2>
      <form @submit.prevent="submitForm">
        <div>
          <label for="folderName">Folder Name:</label>
          <input type="text" v-model="folderName" id="folderName" required />
        </div>
        <button type="submit" class="createFolder">Create Folder</button>
        <button type="button" @click="$emit('close-modal')">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    showModal: Boolean,
    parent_id: [Number, null], // Accept number or null
  },
  data() {
    return {
      folderName: '', // Holds the name of the new folder
    };
  },
  methods: {
    submitForm() {
      const newFolder = { 
        file_name: this.folderName,
        parent_id: null,
      };
      
      // Validate folder name before sending request
      if (!this.folderName.trim()) {
        this.errorMessage = 'Folder name cannot be empty.';
        return;
      }

      const formData = new FormData();
      formData.append('folder_name', newFolder.file_name);
      formData.append('parent_id', this.parent_id);

      axios.post(`http://localhost:5000/api/folders/add`, formData , {headers: { 'Content-Type': 'application/json' }})
        .then(response => {
          console.log(response.data); // Example: log the response data
          this.$emit('close-modal'); // Close the modal after adding the folder
          this.$emit('add-folder', newFolder); // Emit the folder data to the parent
          window.location.reload(); // Reload the page to display the new folder
        })
        .catch(error => {
          this.errorMessage = 'Error adding folder. Please try again.';
          console.error(error);
        });
    },
  },
};
</script>

<style scoped>
/* Add styles for the modal */
.modal {
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

.modal-content {
  background-color: #fff;
  padding: 20px 35px 20px 25px;
  border-radius: 5px;
  width: 400px;
  text-align: center;
}

.close {
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
  font-size: 20px;
}

form div {
  margin-bottom: 15px;
}

form label {
  display: block;
  text-align: left;
}

form input {
  width: 100%;
  padding-left:4px;
  padding-right:4px;
  padding-top: 8px;
  padding-bottom: 8px;
  margin-top: 5px;
}

form button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #df0324;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

form button.createFolder {
  background-color: #6a00ff;
  margin-right: 6px;
}
</style>
