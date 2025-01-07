<template>
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <span class="close" @click="$emit('close-modal')">&times;</span>

      <h3>File Properties</h3>

      <hr />
      <!-- Display file properties -->
      <div v-if="file">
        <p><strong>File Name:</strong> {{ file.file_name }}</p>
        <p><strong>File Size:</strong> {{ formattedSize(file.file_size) }}</p>
        <p><strong>File Type:</strong> {{ file.file_type }}</p>
        <p><strong>Uploaded On:</strong> {{ formatDate(file.created_at) }}</p>
      </div>

      <hr />
      <!-- Modal Buttons -->
      <div class="modal-button">
        <button @click="$emit('close-modal')">Close</button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PropertiesModal',
  props: {
    showModal: Boolean,
    file: Object,  // Expecting a file object passed as prop
  },
  methods: {
    // Format file size (bytes to KB/MB/GB)
    formattedSize(sizeInBytes) {
      if (sizeInBytes < 1024) return `${sizeInBytes} B`;
      else if (sizeInBytes < 1048576) return `${(sizeInBytes / 1024).toFixed(2)} KB`;
      else if (sizeInBytes < 1073741824) return `${(sizeInBytes / 1048576).toFixed(2)} MB`;
      else return `${(sizeInBytes / 1073741824).toFixed(2)} GB`;
    },

    // Format date to a readable format
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(date).toLocaleDateString('en-US', options);
    },
  },
};
</script>

<style scoped>
/* Styling for the modal */
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
  text-align: left;
}

.close {
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
  font-size: 20px;
}

.modal-button {
  margin-top: 20px;
}

.modal-button button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.modal-button button:hover {
  background-color: #0056b3;
}

p {
  margin: 10px 0;
  font-size: 14px;
}

strong {
  font-weight: bold;
}

.modal-button {
  display: flex;
  justify-content: center;
  gap: 10px;
}

hr {
  margin: 15px 0;
  border: 0;
  border-top: 1px solid #ddd;
}
</style>