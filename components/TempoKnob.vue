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
function getBPMColor(bpm: number) {
  const minColor = [255, 144, 200];
  const maxColor = [128, 0, 128];

  const interpolatedColor = minColor.map((channel, i) => {
    const range = maxColor[i] - channel;
    return Math.round(channel + range * (bpm / MAX_BPM));
  });

  return `rgb(${interpolatedColor.join(",")})`;
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
    tempoColor() {
      return getBPMColor(this.modelValue);
    },
    knobSize() {
      return Math.floor(Math.min(this.windowWidth, MAX_WINDOW_WIDTH) / 1.618);
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
    :min="MIN_BPM"
    :max="MAX_BPM"
    :textColor="tempoColor"
    :valueColor="tempoColor"
    rangeColor="#E7B6DC"
    :strokeWidth="20"
  />
</template>
