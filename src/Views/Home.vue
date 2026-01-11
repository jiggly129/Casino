<script setup>
import ProvablyFair from "@/Components/Provablyfair.vue"
import { ref, onMounted, defineComponent, onUnmounted } from "vue"

const provablyfairVisible = ref(false)

</script>

<template>
    <div id="provablyFairDiv" class="flexrow">
        <img src="@/assets/provablyfair.png" @click="provablyfairVisible = true">
        <p>Provably Fair</p>
    </div>

    <div v-if="provablyfairVisible === true">
        <ProvablyFair @closeProvablyFair="provablyfairVisible = false"/>
    </div>
</template>