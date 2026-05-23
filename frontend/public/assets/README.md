# Optional Asset Drop-In Folder

Do not place copyrighted game sprites, music, fonts, maps, or UI here unless you have explicit legal rights to use and publish them.

The current app does not require external assets. It draws an original monochrome character, room, objects, and lightbulb with Phaser primitives, and it generates simple ambient audio with Web Audio.

If you later obtain legal assets, use this structure:

```text
frontend/public/assets/
  sprites/
    player.png
    player-walk.png
  audio/
    quiet-white.mp3
    dream-hum.mp3
    memory-bell.mp3
  rooms/
    whitespace-background.png
```

Then update:

- `frontend/src/game/RoomScene.ts` for sprite/background loading.
- `frontend/src/hooks/useAudioSystem.ts` for audio file playback.

Recommended sources:

- Your own original art and music.
- Assets commissioned from an artist/composer with web usage rights.
- CC0/public-domain assets.
- Creative Commons assets only when the license allows commercial portfolio use and you follow attribution requirements.
