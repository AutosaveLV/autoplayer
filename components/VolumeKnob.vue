<script setup lang="ts">
const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>

<script lang="ts">
function getVolumeColor(volume: number) {
  const minColor = 50;
  const maxColor = 100;

  const interpolatedColor = Math.round(
    minColor - (volume / 100) * (minColor - maxColor)
  );

  return `rgb(${interpolatedColor},${interpolatedColor},${interpolatedColor})`;
}

export default {
  data() {
    return {
      windowWidth: window.innerWidth,
    };
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth;
    },
  },
  computed: {
    volumeColor() {
      return getVolumeColor(this.modelValue);
    },
    knobSize() {
      return (
        Math.floor(Math.min(this.windowWidth, MAX_WINDOW_WIDTH) / 1.618) * 0.8
      );
    },
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>

<template>
  <Knob
    v-model="value"
    :size="knobSize"
    :min="0"
    :max="100"
    :textColor="volumeColor"
    :valueColor="volumeColor"
    rangeColor="#262626"
    :strokeWidth="16"
  />
</template>
