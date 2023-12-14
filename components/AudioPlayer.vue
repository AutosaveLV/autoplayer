<script lang="ts">
export default {
  data() {
    return {
      isPlaying: false,
      currentTrack: tracks[0],
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
          this.currentTrack.bpm,
          this.tempo
        );
      }

      this.isPlaying = !this.isPlaying;
    },
    playNextTrack() {
      const sortedTracks = [...tracks].sort(
        (a, b) => Math.abs(a.bpm - this.tempo) - Math.abs(b.bpm - this.tempo)
      );
      const nextTrack = sortedTracks.find(
        (track) => track.publicPath !== this.currentTrack.publicPath
      );

      if (nextTrack) {
        this.currentTrack = nextTrack;
        const audioElement = this.$refs.audio as HTMLAudioElement;
        audioElement.addEventListener(
          "canplay",
          () => {
            audioElement.currentTime = 0;
            audioElement.playbackRate = getPlaybackRate(
              nextTrack.bpm,
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
        this.currentTrack.bpm,
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
    audioElement.addEventListener("ended", this.playNextTrack);
  },
  beforeDestroy() {
    const audioElement = this.$refs.audio as HTMLAudioElement;
    audioElement.removeEventListener("ended", this.playNextTrack);
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
      <p>{{ currentTrack.name }}</p>
      <audio ref="audio" :src="currentTrack.publicPath"></audio>
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
