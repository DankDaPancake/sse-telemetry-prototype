<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

// Generate random ID cho session trên browser
const myId = ref(Math.random().toString(36).substring(7));
const myName = ref("");
const hasJoined = ref(false);

interface Player {
  name: string;
  score: number;
}

const gameState = ref<{ players: Record<string, Player> }>({ players: {} });

const playerList = computed(() => {
  return Object.entries(gameState.value.players)
    .map(([id, data]) => ({
      id,
      ...data,
      isMe: id === myId.value,
    }))
    .sort((a, b) => b.score - a.score); // Sort theo điểm cao nhất
});

// 1. Join game
const joinGame = async () => {
  if (!myName.value) return;

  await fetch('/api/join', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: myId.value, name: myName.value }),
  });

  hasJoined.value = true
};

// 2. Move
const run = async () => {
  await fetch("/api/move", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: myId.value, name: myName.value }),
  });
};

onMounted(() => {
  // Connect to the NestJS Backend
  // Make sure your backend is running on port 3000!
  const eventSource = new EventSource("/api/events");

  eventSource.onopen = () => {
    console.log("Connection opened");
  };

  eventSource.onmessage = (event) => {
    gameState.value = JSON.parse(event.data);
  };

  eventSource.onerror = (error) => {
    console.error("SSE error:", error);
    eventSource?.close();
  };
});
</script>

<template>
  <div class="game-container">
    <h1>🏁 Click Race 🏁</h1>

    <div v-if="!hasJoined" class="login">
      <input
        v-model="myName"
        placeholder="Enter your name"
        @keyup.enter="joinGame"
      />
      <button @click="joinGame">Join Race</button>
    </div>

    <div v-else class="race-track">
      <button class="run-btn" @click="run">🏃 RUN (+5)</button>

      <div v-for="player in playerList" :key="player.id" class="lane">
        <div class="info">
          <span :class="{ me: player.isMe }">{{ player.name }}</span>
          <span>{{ player.score }}</span>
        </div>

        <div class="progress-bg">
          <div
            class="progress-bar"
            :style="{ width: player.score + '%' }"
            :class="{ 'winner': player.score >= 100 }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  max-width: 600px;
  margin: 2rem auto;
  font-family: sans-serif;
}
.login {
  display: flex;
  gap: 10px;
  justify-content: center;
}
input {
  padding: 10px;
  font-size: 1.2rem;
}
button {
  padding: 10px 20px;
  font-size: 1.2rem;
  cursor: pointer;
  background: #333;
  color: white;
  border: none;
  border-radius: 4px;
}
.run-btn {
  width: 100%;
  margin-bottom: 2rem;
  background: #e91e63;
  font-weight: bold;
  font-size: 2rem;
}
.run-btn:active {
  transform: scale(0.98);
}
.lane {
  margin-bottom: 1.5rem;
}
.info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-weight: bold;
}
.me {
  color: #e91e63;
  text-decoration: underline;
}
.progress-bg {
  background: #ddd;
  height: 30px;
  border-radius: 15px;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  background: #2196f3;
  transition: width 0.3s ease;
}
.progress-bar.winner {
  background: #4caf50;
}
</style>
