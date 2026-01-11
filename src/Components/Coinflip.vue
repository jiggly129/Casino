<script setup>
import { ref, computed } from "vue";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL
} from "@solana/web3.js";

const betAmount = ref(0.01);
const choice = ref("heads");
const isFlipping = ref(false);
const result = ref(null);
const showResult = ref(false);
const message = ref("");
const isProcessingTx = ref(false)

const connection = new Connection(
  "https://mainnet.helius-rpc.com/?api-key=977c8759-f750-4b90-a93d-a694b510ff0f",
  "confirmed"
);

const HOUSE_WALLET = new PublicKey(
  "4aPh2KDNjEDgcchP73qnNvTarDLyporLdwhovbHR7kqd"
);

const canFlip = computed(() => betAmount.value > 0 && !isFlipping.value);

async function flipCoin() {
  try {
    if (!window.solana?.isPhantom || !window.solana.publicKey) {
      alert("Connect Phantom wallet first");
      return;
    }

    // Show transaction processing
    isProcessingTx.value = true;
    showResult.value = false;
    result.value = null;

    const lamports = Math.floor(betAmount.value * LAMPORTS_PER_SOL);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: window.solana.publicKey,
        toPubkey: HOUSE_WALLET,
        lamports
      })
    );

    transaction.feePayer = window.solana.publicKey;

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;

    const signedTx = await window.solana.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTx.serialize());

    await connection.confirmTransaction(
      { signature, blockhash, lastValidBlockHeight },
      "confirmed"
    );

    // ✅ Only after confirmation, start animation
    const flipResult = Math.random() < 0.5 ? "heads" : "tails";
    result.value = flipResult;

    // Start coin flip animation
    isFlipping.value = true;

    // Show modal after animation (duration = 1.2s)
    setTimeout(() => {
      message.value = flipResult === choice.value ? "🎉 YOU WON!" : "💀 YOU LOST";
      showResult.value = true;
      isFlipping.value = false;
      isProcessingTx.value = false;
    }, 1200);

  } catch (err) {
    console.error("Transaction failed:", err);
    alert(err.message || "Transaction failed");
    isFlipping.value = false;
    isProcessingTx.value = false;
  }
}


</script>

<template>
  <div class="casino">
    <p>🪙 Coin Flip</p>

    <div class="coin-container">
      <div
        class="coin"
        :class="{ flipping: isFlipping, heads: result === 'heads', tails: result === 'tails' }"
      >
        <div class="side heads">H</div>
        <div class="side tails">T</div>
      </div>
    </div>

    <!-- Transaction feedback -->
    <p v-if="isProcessingTx && !isFlipping">Waiting...</p>


    <div class="controls">
      <div class="flexrow">
        <button @click="choice = 'heads'" :class="{ active: choice === 'heads' }">Heads</button>
        <button @click="choice = 'tails'" :class="{ active: choice === 'tails' }">Tails</button>
      </div>

      <input
        type="number"
        step="0.001"
        v-model.number="betAmount"
        placeholder="Bet (SOL)"
      />

      <button @click="flipCoin" :disabled="!canFlip">
        Bet & Flip
      </button>
    </div>

    <div class="modal" v-if="showResult">
      <div class="modal-content">
        <h1>{{ message }}</h1>
        <button @click="showResult = false" id="close">Close</button>
      </div>
    </div>
  </div>
</template>
