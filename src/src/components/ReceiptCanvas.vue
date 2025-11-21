<template>
  <div class="receipt-canvas-container">
    <h2 class="canvas-title">Receipt Preview</h2>
    <div class="canvas-wrapper">
      <canvas ref="canvasRef" class="receipt-canvas"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useReceiptStore } from '../stores/receiptStore';
import { useReceiptCanvas } from '../composables/useReceiptCanvas';
import { useDebounceFn } from '@vueuse/core';
import { CANVAS_REDRAW_DEBOUNCE } from '../utils/constants';

const receiptStore = useReceiptStore();
const { formData, receiptNumber } = storeToRefs(receiptStore);
const { drawReceipt } = useReceiptCanvas();

const canvasRef = ref<HTMLCanvasElement | null>(null);

// Debounced redraw function
const debouncedRedraw = useDebounceFn(() => {
  if (canvasRef.value && receiptNumber.value) {
    drawReceipt(canvasRef.value, formData.value, receiptNumber.value);
  }
}, CANVAS_REDRAW_DEBOUNCE);

// Watch form data for changes
watch(formData, debouncedRedraw, { deep: true });

// Watch receipt number
watch(receiptNumber, debouncedRedraw);

// Initial draw on mount
onMounted(() => {
  if (canvasRef.value && receiptNumber.value) {
    drawReceipt(canvasRef.value, formData.value, receiptNumber.value);
  }
});

// Expose canvas ref for parent components
defineExpose({
  canvasRef,
});
</script>

<style scoped>
.receipt-canvas-container {
  width: 100%;
  padding: 1rem;
}

.canvas-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1a202c;
}

.canvas-wrapper {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  justify-content: center;
  overflow: auto;
}

.receipt-canvas {
  border: 1px solid #cbd5e0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background: white;
  max-width: 100%;
  height: auto;
}

@media (min-width: 768px) {
  .receipt-canvas-container {
    padding: 1.5rem;
  }
}
</style>
