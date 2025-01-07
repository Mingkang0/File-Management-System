<template>
  <div class="sidebar" @click="handleOutsideClick">

    <div class="folder">
      <div class="header">
        <button v-if="currentFolder" class="back-btn" @click="goBack">
          <i class="fas fa-arrow-left"></i> Back
        </button>
        <h3>
          <i class="fas fa-folder"></i> {{ currentFolder ? currentFolder.folder_name : 'Root' }}
        </h3>
        <button class="add-btn" @click="toggleMenu($event)">
          <i class="fas fa-plus"></i>
          Add
        </button>
      </div>

      <div class="folder-file-container">
        <div v-for="(folder, index) in folders" :key="index" class="item folder-item" @click="openFolder(folder)"
          @contextmenu.prevent="showFolderContextMenu($event, folder)">
          <i class="fas fa-folder folder-icon"></i>
          <p class="item-name">{{ folder.folder_name }}</p>
        </div>

        <div v-if="folderContextMenuVisible" class="context-menu"
          :style="{ top: `${folderContextMenuPosition.y}px`, left: `${folderContextMenuPosition.x}px` }"
          @click="hideFolderContextMenu">
          <ul>
            <li @click="editFolder"><i class="fas fa-edit"></i> Edit</li>
            <li @click="deleteFolder"><i class="fas fa-trash"></i> Delete</li>
          </ul>
        </div>

        <div v-for="(file, index) in files" :key="index" class="item file-item" @click="openFileInNewTab(file)"
          @contextmenu.prevent="showFileContextMenu($event, file)">
          <i class="fas fa-file file-icon"></i>
          <p class="item-name">{{ file.file_name }}</p>
        </div>
      </div>

      <div v-if="fileContextMenuVisible" class="context-menu"
        :style="{ top: `${fileContextMenuPosition.y}px`, left: `${fileContextMenuPosition.x}px` }">
        <ul>
          <li @click="viewFile"><i class="fas fa-eye"></i> View</li>
          <li @click="editFile"><i class="fas fa-edit"></i> Edit</li>
          <li @click="deleteFile"><i class="fas fa-trash"></i> Delete</li>
          <li @click="showFileProperties"><i class="fas fa-info-circle"></i> Properties</li>
        </ul>
      </div>

      <div v-if="menuVisible" class="context-menu" :style="{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }"
        @click="hideMenu">
        <ul>
          <li @click="showAddFileModal">Add File</li>
          <li @click="showAddFolderModal">Add Folder</li>
        </ul>
      </div>
    </div>

    <!-- Add File Modal -->
    <AddFileModal :showModal="isAddFileModalVisible" :folder_id="currentFolder ? currentFolder.id : null"
      @close-modal="closeAddFileModal" />

    <!-- Add Folder Modal -->
    <AddFolderModal :showModal="isAddFolderModalVisible" :parent_id="currentFolder ? currentFolder.id : null"
      @close-modal="closeAddFolderModal" />

    <edit-file-modal v-if="isEditFileModalVisible" :file="selectedFile" :showModal="isEditFileModalVisible"
      @close-modal="closeEditFileModal" @edit-file="handleEditFile" @update-file-name="updateFileName" />

    <EditFolderModal v-if="isEditFolderModalVisible" :folder="selectedFolder" :showModal="isEditFolderModalVisible"
      @close-modal="closeEditFolderModal" @edit-folder="handleEditFolder" @update-folder-name="updateFolderName" />


    <PropertiesModal v-if="isPropertiesModalVisible" :file="selectedFile" :showModal="isPropertiesModalVisible" @close-modal="closePropertiesModal" />

  </div>
</template>

<script>

import addFile from './addFile.vue';
import addFolder from './addFolder.vue';
import axios from 'axios';
import updateFile from './updateFile.vue';
import updateFolder from './updateFolder.vue';
import properties from './properties.vue';

export default {
  name: "FolderAndFile",
  props: {
    msg: String,
  },
  components: {
    AddFileModal: addFile,
    AddFolderModal: addFolder,
    EditFileModal: updateFile,
    EditFolderModal: updateFolder,
    PropertiesModal: properties,
  },
  data() {
    return {
      menuVisible: false,
      menuPosition: { x: 0, y: 0 },
      isAddFileModalVisible: false,
      isAddFolderModalVisible: false,
      isEditFileModalVisible: false,
      isEditFolderModalVisible: false,
      isPropertiesModalVisible: false,
      folders: [],
      files: [],
      folderHistory: [],
      fileContextMenuVisible: false,
      fileContextMenuPosition: { x: 0, y: 0 },
      folderContextMenuVisible: false,
      folderContextMenuPosition: { x: 0, y: 0 },
      selectedFolder: null,
      currentFolder: null,
      selectedFile: null,
    };
  },
  mounted() {
    this.fetchFiles();
    this.fetchFolder();
  },
  methods: {
    toggleMenu(event) {
      event.stopPropagation(); // Prevent triggering the global click listener
      const buttonRect = event.target.getBoundingClientRect();
      this.menuPosition = { x: buttonRect.right - 100, y: buttonRect.bottom + window.scrollY };
      this.menuVisible = !this.menuVisible;
    },
    hideMenu() {
      this.menuVisible = false;
    },
    showAddFileModal() {
      this.isAddFileModalVisible = true;
      this.hideMenu();
    },
    closeAddFileModal() {
      this.isAddFileModalVisible = false;
    },
    showAddFolderModal() {
      this.isAddFolderModalVisible = true;
      this.hideMenu();
    },
    closeAddFolderModal() {
      this.isAddFolderModalVisible = false;
    },
    openFolder(folder) {
      if (this.currentFolder) {
        this.folderHistory.push(this.currentFolder); // Save the current folder to history
      }
      this.currentFolder = folder; // Set the clicked folder as the current folder
      this.fetchFolder(); // Fetch subfolders
      this.fetchFiles(); // Fetch files in this folder
    },
    fetchFiles() {
      const folderId = this.currentFolder ? this.currentFolder.id : null;
      axios.get(`http://localhost:5000/api/files/list?folderId=${folderId}`)
        .then(response => {
          console.log(response.data);
          this.files = response.data; // Store the fetched data in the `files` array
        })
        .catch(error => {
          console.error(error);
        });
    },
    goBack() {
      if (this.folderHistory.length > 0) {
        this.currentFolder = this.folderHistory.pop(); // Get the last folder from the history stack
        this.fetchFolder();
        this.fetchFiles();
      } else {
        this.currentFolder = null; // Go back to the root folder
        this.fetchFolder();
        this.fetchFiles();
      }
    },
    fetchFolder() {
      const folderId = this.currentFolder ? this.currentFolder.id : null;
      axios.get(`http://localhost:5000/api/folders/list?parentId=${folderId ?? 'null'}`)
        .then(response => {
          console.log(response.data);
          this.folders = response.data; // Store the fetched data in the `folders` array
        })
        .catch(error => {
          console.error(error);
        });
    },
    openFileInNewTab(file) {
      const fileUrl = `http://localhost:5000/uploads/${file.file_name}`;
      window.open(fileUrl, '_self');
    },
    showFileContextMenu(event, file) {
      this.selectedFile = file;
      this.fileContextMenuVisible = true;
      this.fileContextMenuPosition = { x: event.clientX, y: event.clientY };
    },
    hideFileContextMenu() {
      this.fileContextMenuVisible = false;
    },
    handleOutsideClick(event) {
      const contextMenu = this.$el.querySelector(".context-menu");
      if (contextMenu && !contextMenu.contains(event.target)) {
        this.hideFileContextMenu();
        this.hideFolderContextMenu();
        this.hideMenu();
      }
    },
    viewFile() {
      this.hideFileContextMenu();
      this.openFileInNewTab(this.selectedFile);
    },
    deleteFile() {
      this.hideFileContextMenu();

      const confirmDelete = window.confirm('Are you sure you want to delete this file?');
      if (confirmDelete) {
        axios.delete(`http://localhost:5000/api/files/delete/${this.selectedFile.id}`)
          .then(response => {
            console.log('File deleted:', response.data);
            this.fetchFiles(); // Refresh the files list
          })
          .catch(error => {
            console.error('Error deleting file:', error);
          });
      }
    },
    editFile() {
      this.hideFileContextMenu();
      this.isEditFileModalVisible = true;
    },
    closeEditFileModal() {
      this.isEditFileModalVisible = false;
    },
    updateFileName(newFileName) {
      this.selectedFile.file_name = newFileName;
      axios.put(`http://localhost:5000/api/files/update/${this.selectedFile.id}`, this.selectedFile)
        .then(response => {
          console.log('File name updated:', response.data);
          this.fetchFiles(); // Refresh the files list
          this.closeEditFileModal(); // Close the modal
        })
        .catch(error => {
          console.error('Error updating file name:', error);
        });
    },
    // Show folder context menu
    showFolderContextMenu(event, folder) {
      this.selectedFolder = folder;
      this.folderContextMenuPosition = { x: event.clientX, y: event.clientY };
      this.folderContextMenuVisible = true;
    },

    // Hide folder context menu
    hideFolderContextMenu() {
      this.folderContextMenuVisible = false;
    },


    // Delete folder logic
    deleteFolder() {
      console.log('Delete folder:', this.selectedFolder.id);
      this.hideFolderContextMenu();
      const confirmDelete = window.confirm('Are you sure you want to delete this folder?');
      if (confirmDelete) {
        axios.delete(`http://localhost:5000/api/folders/delete/${this.selectedFolder.id}`)
          .then(response => {
            console.log('Folder deleted:', response.data);
            this.fetchFolder(); // Refresh the folder list
          })
          .catch(error => {
            console.error('Error deleting folder:', error);
          });
      }
    },
    openEditFolderModal() {
      this.isEditFolderModalVisible = true;
    },
    closeEditFolderModal() {
      this.isEditFolderModalVisible = false;
    },
    editFolder() {
      this.hideFolderContextMenu();
      this.isEditFolderModalVisible = true;
    },

    updateFolderName(newFolderName) {
      this.selectedFolder.folder_name = newFolderName;
      axios.put(`http://localhost:5000/api/folders/update/${this.selectedFolder.id}`, this.selectedFolder)
        .then(response => {
          console.log('Folder name updated:', response.data);
          this.fetchFolder(); // Refresh the folder list
          this.closeEditFolderModal(); // Close the modal
        })
        .catch(error => {
          console.error('Error updating folder name:', error);
        });
    },
    openPropertiesModal() {
      this.isPropertiesModalVisible = true;
    },
    closePropertiesModal() {
      this.isPropertiesModalVisible = false;
    },
    showFileProperties() {
      this.hideFileContextMenu();
      this.openPropertiesModal();


    },
  },
};
</script>

<style scoped>
.sidebar {
  padding: 16px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.folder h3 {
  margin-top: 5px;
  margin-bottom: 14px;
  font-size: 1.2em;
  color: #333;
}

.folder-file-container {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: start;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 140px;
  text-align: center;
  cursor: pointer;
  word-break: break-word;
  /* Prevent text overflow */
}

.item .item-name {
  margin-top: 8px;
  font-size: 16px;
  line-height: 1.2;
  /* Adjust line height for better spacing */
}

.folder-icon {
  font-size: 48px;
  /* Enlarge folder icons */
  color: #f7c52b;
  /* Windows folder yellow color */
}

.file-icon {
  font-size: 48px;
  /* Enlarge file icons */
  color: #007bff;
  /* Windows file blue color */
}


.item:hover .folder-icon {
  color: #fcce44;
  /* Change text color on hover for better UI feedback */
}

.item:hover .file-icon {
  color: #3094ff;
  /* Change color on hover for better UI feedback */
}

.add-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
}

.add-btn:hover {
  background-color: #0056b3;
}

.context-menu {
  position: absolute;
  background-color: white;
  border: 1px solid #ddd;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  padding: 0;
  margin: 0;
}

.context-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.context-menu li {
  padding: 8px 16px;
  cursor: pointer;
}

.context-menu li:hover {
  background-color: #f1f1f1;
}

.back-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 6px 24px;
  border-radius: 4px;
  cursor: pointer;
}

.context-menu {
  position: absolute;
  background-color: white;
  border: 1px solid #ddd;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  padding: 0;
  margin: 0;
}

.context-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.context-menu li {
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.context-menu li i {
  margin-right: 8px;
}

.context-menu li:hover {
  background-color: #f1f1f1;
}
</style>
