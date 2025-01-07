<template>
  <div class="file-manager">
    <h1>{{ msg }}</h1>
    <div class="dashboard">
      <!-- Sidebar for folders -->
      <sidebar class="sidebar" />

    </div>
  </div>
</template>

<script>
import sidebar from './FolderFile.vue';

export default {
  name: 'FileManager',
  components: {
    sidebar,
  },
  props: {
    msg: String,
  },
};
</script>

<style scoped>
.file-manager {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.dashboard {
  display: flex;
  gap: 20px;
}

.sidebar {
  width: 100%; /* Adjust the width as needed */
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  background-color: #f9f9f9;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.5em;
}
</style>
