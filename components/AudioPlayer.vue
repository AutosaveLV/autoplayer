<script lang="ts">
import Knob from "primevue/knob";

function getBPMColor(bpm: number) {
  const minColor = [255, 144, 200];
  const maxColor = [128, 0, 128];

  const interpolatedColor = minColor.map((channel, i) => {
    const range = maxColor[i] - channel;
    return Math.round(channel + range * (bpm / MAX_BPM));
  });

  return `rgb(${interpolatedColor.join(",")})`;
}

const audio = {
  publicPath: "audio/sample_1.mp3",
  bpm: 119,
};
export default {
  data() {
    return {
      isPlaying: false,
      audioSource: audio.publicPath,
      tempo: INITIAL_BPM,
      strokeWidth: 20,
    };
  },
  methods: {
    togglePlayback() {
      const audioElement = this.$refs.audio as HTMLAudioElement;
      if (this.isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
        audioElement.playbackRate = getPlaybackRate(audio.bpm, this.tempo);
      }

      this.isPlaying = !this.isPlaying;
    },
  },
  computed: {
    knobColor() {
      return getBPMColor(this.tempo);
    },
  },
  watch: {
    tempo(newTempo: number) {
      const audioElement = this.$refs.audio as HTMLAudioElement;
      audioElement.playbackRate = getPlaybackRate(audio.bpm, newTempo);
    },
  },
};
</script>

<template>
  <div>
    <Knob
      v-model="tempo"
      :size="150"
      :min="MIN_BPM"
      :max="MAX_BPM"
      :textColor="knobColor"
      :valueColor="knobColor"
      rangeColor="#E7B6DC"
      :strokeWidth="strokeWidth"
    />
    <audio ref="audio" :src="audioSource"></audio>
    <button @click="togglePlayback" data-testid="play_button">
      {{ isPlaying ? "Pause" : "Play" }}
    </button>
  </div>
</template>
