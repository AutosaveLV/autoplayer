<script lang="ts">
import Knob from "primevue/knob";
import { MAX_WINDOW_WIDTH } from "~/utils/constants";

function getBPMColor(bpm: number) {
  const minColor = [255, 144, 200];
  const maxColor = [128, 0, 128];

  const interpolatedColor = minColor.map((channel, i) => {
    const range = maxColor[i] - channel;
    return Math.round(channel + range * (bpm / MAX_BPM));
  });

  return `rgb(${interpolatedColor.join(",")})`;
}

const songs = [
  {
    publicPath: "audio/Track_1.mp3",
    bpm: 117,
  },
  {
    publicPath: "audio/Track_2.mp3",
    bpm: 120,
  },
  {
    publicPath: "audio/Track_3.mp3",
    bpm: 120,
  },
  {
    publicPath: "audio/Track_4.mp3",
    bpm: 102,
  },
];

export default {
  data() {
    return {
      isPlaying: false,
      audioSource: songs[0].publicPath,
      tempo: INITIAL_BPM,
      strokeWidth: 20,
      windowWidth: window.innerWidth,
    };
  },
  methods: {
    togglePlayback() {
      const audioElement = this.$refs.audio as HTMLAudioElement;
      if (this.isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
        audioElement.playbackRate = getPlaybackRate(songs[0].bpm, this.tempo);
      }

      this.isPlaying = !this.isPlaying;
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
    },
    playNextSong() {
      const sortedSongs = [...songs].sort(
        (a, b) => Math.abs(a.bpm - this.tempo) - Math.abs(b.bpm - this.tempo)
      );
      const nextSong = sortedSongs.find(
        (song) => song.publicPath !== this.audioSource
      );

      if (nextSong) {
        this.audioSource = nextSong.publicPath;
        const audioElement = this.$refs.audio as HTMLAudioElement;
        audioElement.addEventListener(
          "canplay",
          () => {
            audioElement.currentTime = 0;
            audioElement.playbackRate = getPlaybackRate(
              nextSong.bpm,
              this.tempo
            );
            audioElement.play();
          },
          { once: true }
        );
      }
    },
  },
  computed: {
    knobColor() {
      return getBPMColor(this.tempo);
    },
    knobSize() {
      return Math.floor(Math.min(this.windowWidth, MAX_WINDOW_WIDTH) / 1.618);
    },
  },
  watch: {
    tempo(newTempo: number) {
      const audioElement = this.$refs.audio as HTMLAudioElement;
      audioElement.playbackRate = getPlaybackRate(songs[0].bpm, newTempo);
    },
  },
  mounted() {
    const audioElement = this.$refs.audio as HTMLAudioElement;
    audioElement.addEventListener("ended", this.playNextSong);
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    const audioElement = this.$refs.audio as HTMLAudioElement;
    audioElement.removeEventListener("ended", this.playNextSong);
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>

<template>
  <div class="h-full flex flex-col justify-around">
    <Knob
      v-model="tempo"
      :size="knobSize"
      :min="MIN_BPM"
      :max="MAX_BPM"
      :textColor="knobColor"
      :valueColor="knobColor"
      rangeColor="#E7B6DC"
      :strokeWidth="strokeWidth"
    />
    <div class="flex justify-center">
      <audio ref="audio" :src="audioSource"></audio>
      <Button
        @click="togglePlayback"
        data-testid="play_button"
        rounded
        raised
        severity="secondary"
        :aria-label="isPlaying ? 'Pause' : 'Play'"
      >
        <template v-if="isPlaying">
          <MaterialSymbolsPause class="text-6xl p2" />
        </template>
        <template v-else>
          <MaterialSymbolsPlayArrow class="text-6xl p2" />
        </template>
      </Button>
    </div>
  </div>
</template>
