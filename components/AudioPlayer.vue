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

function getVolumeColor(volume: number) {
  const minColor = 50;
  const maxColor = 100;

  const interpolatedColor = Math.round(
    minColor - (volume / 100) * (minColor - maxColor)
  );

  return `rgb(${interpolatedColor},${interpolatedColor},${interpolatedColor})`;
}

const songs = [
  {
    name: "Track 1",
    publicPath: "audio/Track_1.mp3",
    bpm: 117,
  },
  {
    name: "Track 2",
    publicPath: "audio/Track_2.mp3",
    bpm: 120,
  },
  {
    name: "Track 3",
    publicPath: "audio/Track_3.mp3",
    bpm: 120,
  },
  {
    name: "Track 4",
    publicPath: "audio/Track_4.mp3",
    bpm: 102,
  },
];

export default {
  data() {
    return {
      isPlaying: false,
      currentSong: songs[0],
      tempo: INITIAL_BPM,
      volume: INITIAL_VOLUME,
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
        audioElement.playbackRate = getPlaybackRate(
          this.currentSong.bpm,
          this.tempo
        );
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
        (song) => song.publicPath !== this.currentSong.publicPath
      );

      if (nextSong) {
        this.currentSong = nextSong;
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
    tempoColor() {
      return getBPMColor(this.tempo);
    },
    volumeColor() {
      return getVolumeColor(this.volume);
    },
    knobSize() {
      return Math.floor(Math.min(this.windowWidth, MAX_WINDOW_WIDTH) / 1.618);
    },
  },
  watch: {
    tempo(newTempo: number) {
      const audioElement = this.$refs.audio as HTMLAudioElement;
      audioElement.playbackRate = getPlaybackRate(
        this.currentSong.bpm,
        newTempo
      );
    },
    volume(newVolume: number) {
      const audioElement = this.$refs.audio as HTMLAudioElement;
      audioElement.volume = newVolume / 100;
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
      :textColor="tempoColor"
      :valueColor="tempoColor"
      rangeColor="#E7B6DC"
      :strokeWidth="strokeWidth"
    />
    <div class="flex justify-center">
      <Knob
        v-model="volume"
        :size="knobSize * 0.8"
        :min="0"
        :max="100"
        :textColor="volumeColor"
        :valueColor="volumeColor"
        rangeColor="#262626"
        :strokeWidth="strokeWidth * 0.8"
      />
    </div>
    <div class="flex flex-col justify-center items-center">
      <p>{{ currentSong.name }}</p>
      <audio ref="audio" :src="currentSong.publicPath"></audio>
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
