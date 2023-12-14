<script lang="ts">
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
  },
  beforeDestroy() {
    const audioElement = this.$refs.audio as HTMLAudioElement;
    audioElement.removeEventListener("ended", this.playNextSong);
  },
};
</script>

<template>
  <div class="h-full flex flex-col justify-around">
    <TempoKnob v-model="tempo" />
    <div class="flex justify-center">
      <VolumeKnob v-model="volume" />
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
