<script setup>
import { ref, computed } from "vue";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL
} from "@solana/web3.js";

/* ------------------ STATE ------------------ */

const betAmount = ref(0.01); // SOL
const choice = ref("heads");
const isFlipping = ref(false);
const result = ref(null);
const showResult = ref(false);
const message = ref("");

/* ------------------ MAINNET RPC ------------------ */
/* 🔴 REPLACE WITH YOUR OWN API KEY */
const connection = new Connection(
  "https://api.mainnet-beta.solana.com",
  "confirmed"
);

/* ------------------ HOUSE WALLET ------------------ */
/* Must be a MAINNET address */
const HOUSE_WALLET = new PublicKey(
  "4aPh2KDNjEDgcchP73qnNvTarDLyporLdwhovbHR7kqd"
);

const canFlip = computed(() => betAmount.value > 0 && !isFlipping.value);

/* ------------------ COIN FLIP ------------------ */

async function flipCoin() {
  try {
    if (!window.solana?.isPhantom || !window.solana.publicKey) {
      alert("Connect Phantom wallet first");
      return;
    }

    isFlipping.value = true;
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

    // REQUIRED for legacy tx
    transaction.feePayer = window.solana.publicKey;

    // ✅ Mainnet blockhash (private RPC allows this)
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    transaction.recentBlockhash = blockhash;

    // Sign with Phantom
    const signedTx = await window.solana.signTransaction(transaction);

    // Send
    const signature = await connection.sendRawTransaction(
      signedTx.serialize()
    );

    await connection.confirmTransaction(
      { signature, blockhash, lastValidBlockHeight },
      "confirmed"
    );

    // UI-only result (testing mode)
    setTimeout(() => {
      const flip = Math.random() < 0.5 ? "heads" : "tails";
      result.value = flip;
      message.value = flip === choice.value ? "🎉 YOU WON!" : "💀 YOU LOST";
      showResult.value = true;
      isFlipping.value = false;
    }, 1000);

  } catch (err) {
    console.error("Transaction failed:", err);
    alert(err.message || "Transaction failed");
    isFlipping.value = false;
  }
}
</script>

<template>
  <div class="casino">
    <h2>🪙 Coin Flip</h2>

    <div class="coin-container">
      <div
        class="coin"
        :class="{ flipping: isFlipping, heads: result === 'heads', tails: result === 'tails' }"
      >
        <div class="side heads">H</div>
        <div class="side tails">T</div>
      </div>
    </div>

    <div class="controls">
      <div>
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

    <!-- Result Modal -->
    <div class="modal" v-if="showResult">
      <div class="modal-content">
        <h1>{{ message }}</h1>
        <button @click="showResult = false">Close</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.casino {
  max-width: 420px;
  margin: auto;
  padding: 20px;
  background: #0b0b0b;
  color: white;
  border-radius: 14px;
  text-align: center;
}

.coin {
  width: 120px;
  height: 120px;
  margin: 20px auto;
  transform-style: preserve-3d;
  transition: transform 1.2s;
}

.coin.flipping {
  transform: rotateY(1080deg);
}

.coin.tails {
  transform: rotateY(180deg);
}

.side {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  backface-visibility: hidden;
  font-size: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: gold;
}

.side.tails {
  transform: rotateY(180deg);
  background: silver;
}

.controls button.active {
  background: gold;
  color: black;
}

.modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: black;
  padding: 30px;
  border-radius: 12px;
}
</style>
