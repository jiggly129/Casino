<script setup>

import { ref, onMounted } from 'vue'
import { generateClientSeed } from '@/utils/clientSeed'

const clientSeed = ref('')

onMounted(() => {
  const saved = localStorage.getItem('clientSeed')
  if (saved) {
    clientSeed.value = saved
  } else {
    const seed = generateClientSeed()
    clientSeed.value = seed
    localStorage.setItem('clientSeed', seed)
  }
})

function regenerateClientSeed() {
  const seed = generateClientSeed()
  clientSeed.value = seed
  localStorage.setItem('clientSeed', seed)
}

</script>

<template>
    <div id="outerProvablyFairDiv">
        <p>Provably Fair</p>
        <button @click="$emit('closeProvablyFair')">X</button>
        <div id="provablyFairMainDiv" class="flexcolumn">
        <div id="clientSeedDiv" class="flexcolumn">
            <p>Player Seed:</p>
            <div class="flexrow">
                <p id="clientSeed">{{ clientSeed }}</p>
                <img id="regenerateBtn" src="@/assets/refresh.png" @click="regenerateClientSeed()">
            </div>
        </div>
        </div>
    </div>
</template>