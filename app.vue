<script setup lang="ts">
useHead({
  title: "Autoplayer",
});
</script>

<template>
  <div class="w-screen h-screen flex justify-center items-center bg-gray-950">
    <ClientOnly fallback-tag="span" fallback="Loading...">
      <AudioPlayer />
    </ClientOnly>
  </div>
</template>
