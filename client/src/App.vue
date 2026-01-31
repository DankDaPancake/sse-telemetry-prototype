<script setup lang="ts">
import GameStream from "./components/GameStream.vue";
</script>

<template>
  <header>
    <h1>My SSE App</h1>
  </header>

  <main>
    <GameStream />
  </main>
</template>

<style>
/* Basic reset */
body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
}
header {
  background-color: #333;
  color: white;
  padding: 1rem;
  text-align: center;
}
</style>
