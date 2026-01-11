<script setup>
import {RouterLink, RouterView} from 'vue-router'
import { ref, onMounted, defineComponent, onUnmounted } from "vue"
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

const walletAddress = ref(null);
const provider = ref(null);
const connectStatus = ref('Connect')

  const getProvider = () => {
    if ("solana" in window) {
      const solana = window.solana;
      if (solana.isPhantom) {
        return solana;
      }
    }
    return null;
  };

  const connectWallet = async () => {
    try {
      if (!provider.value) provider.value = getProvider();
      if (!provider.value) throw new Error("Phantom wallet not found");

      const resp = await provider.value.connect();
      walletAddress.value = resp.publicKey.toString();
      connectStatus.value = 'Connected'
      console.log("Connected:", walletAddress.value);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  };

  const disconnectWallet = async () => {
    try {
      if (provider.value) await provider.value.disconnect();
      walletAddress.value = null;
      connectStatus.value = 'Connect'
    } catch (err) {
      console.error("Disconnect failed:", err);
    }
  };

  const autoConnect = async () => {
    try {
      if (!provider.value) provider.value = getProvider();
      if (!provider.value) return;
      const resp = await provider.value.connect({ onlyIfTrusted: true });
      walletAddress.value = resp.publicKey.toString();
      connectStatus.value = 'Connected'
      console.log("Auto-connected:", walletAddress.value);
    } catch {
    }
  };

  const handleDisconnect = () => {
    walletAddress.value = null;
  };

  onMounted(() => {
    provider.value = getProvider();
    if (provider.value) {
      provider.value.on("disconnect", handleDisconnect);
      autoConnect();
    }
  });

  onUnmounted(() => {
    if (provider.value) provider.value.removeListener("disconnect", handleDisconnect);
  });

</script>

<template>
  <header>     
    <nav id="navtop">
      <img src="@/assets/logo.png" id="logo">
      <button id="connect" button @click="connectWallet">{{ connectStatus }}</button>
    </nav>
    <nav id="navbot">
      <h1>MINER.IO</h1>
    </nav>
  </header>
  <main>
    <RouterView />
  </main>
</template>

