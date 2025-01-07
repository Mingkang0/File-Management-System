<template>
  <div class="dashboard">
    <Header/>
    <FileManager msg="File Manager"/>
  </div>
</template>

<script>
import FileManager from './components/fileManager.vue';
import Header from './components/Header.vue';

export default {
  name: 'App',
  components: {
    Header,
    FileManager,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}
*{
  margin: 0;
  padding: 0;
}

</style>
