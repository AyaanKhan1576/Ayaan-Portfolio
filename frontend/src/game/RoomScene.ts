import Phaser from "phaser";
import { mainRoomConfig } from "./assets/roomConfig";
import { playerSprite } from "./assets/playerConfig";
import { croppedFrames, objectSpriteMap, sourceImages } from "./assets/spriteConfig";
import type { ObjectSpriteKey } from "./assets/spriteConfig";
import type { RoomObject } from "../types";

export interface RoomSceneCallbacks {
  onNearbyChange: (object: RoomObject | null) => void;
  onInteract: (object: RoomObject) => void;
}

export interface MobileInputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

type PlayerDirection = "down" | "up" | "left" | "right";

export class RoomScene extends Phaser.Scene {
  private player?: Phaser.GameObjects.Sprite;
  private playerShadow?: Phaser.GameObjects.Ellipse;
  private objectFeedback = new Map<string, { target: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite; baseX: number; baseY: number; scaleX: number; scaleY: number }>();
  private promptContainer?: Phaser.GameObjects.Container;
  private promptText?: Phaser.GameObjects.Text;
  private promptFullText = "";
  private promptTypeEvent?: Phaser.Time.TimerEvent;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys?: Record<string, Phaser.Input.Keyboard.Key>;
  private nearbyObject: RoomObject | null = null;
  private mobileInput: MobileInputState = { up: false, down: false, left: false, right: false };
  private lastInteractAt = 0;
  private lastDirection: PlayerDirection = "down";

  constructor(
    private readonly objects: RoomObject[],
    private readonly callbacks: RoomSceneCallbacks,
  ) {
    super("room");
  }

  preload() {
    for (const image of sourceImages) {
      if (!this.textures.exists(image.key)) {
        this.load.image(image.key, image.path);
      }
    }

    this.load.on("loaderror", (file: { key?: string; src?: string }) => {
      console.warn(`Asset failed to load: ${file.key ?? file.src ?? "unknown"}`);
    });
  }

  create() {
    this.cameras.main.setBackgroundColor("#ffffff");
    this.cameras.main.roundPixels = true;
    this.registerCroppedFrames();
    this.registerMonochromeFrames();
    this.createPlayerAnimations();
    this.drawRoom();
    this.drawObjects();

    this.playerShadow = this.add.ellipse(mainRoomConfig.playerStart.x, mainRoomConfig.playerStart.y + 5, 25, 7, 0x111111, 0.08);
    this.player = this.createPlayer(mainRoomConfig.playerStart.x, mainRoomConfig.playerStart.y);

    this.cursors = this.input.keyboard?.createCursorKeys();
    this.keys = this.input.keyboard?.addKeys("W,A,S,D,E,SPACE") as Record<string, Phaser.Input.Keyboard.Key>;
  }

  update(time: number, delta: number) {
    if (!this.player) return;

    const dx = this.axis("left", "right");
    const dy = this.axis("up", "down");
    const isMoving = dx !== 0 || dy !== 0;
    const length = Math.hypot(dx, dy) || 1;
    const speed = 0.072 * delta;

    if (isMoving) {
      this.player.x += (dx / length) * speed;
      this.player.y += (dy / length) * speed;
      this.wrapPlayer();
    }

    if (this.playerShadow) {
      this.playerShadow.x = Math.round(this.player.x);
      this.playerShadow.y = Math.round(this.player.y + 4);
    }

    this.updatePlayerAnimation(dx, dy);
    this.updateNearbyObject();

    const interactPressed =
      Boolean(this.keys?.E && Phaser.Input.Keyboard.JustDown(this.keys.E)) ||
      Boolean(this.keys?.SPACE && Phaser.Input.Keyboard.JustDown(this.keys.SPACE));

    if (interactPressed) {
      this.tryInteract(this.nearbyObject, time);
    }
  }

  setMobileInput(input: MobileInputState) {
    this.mobileInput = input;
  }

  interactWithNearby() {
    this.tryInteract(this.nearbyObject, this.time.now);
  }

  private registerCroppedFrames() {
    for (const frame of croppedFrames) {
      const texture = this.textures.get(frame.sourceKey);
      if (!texture || texture.key === "__MISSING") continue;
      if (texture.has(frame.key)) continue;
      texture.add(frame.key, 0, frame.x, frame.y, frame.width, frame.height);
    }
  }

  private registerMonochromeFrames() {
    for (const config of Object.values(objectSpriteMap)) {
      const blendConfig = config as { blendMode?: "normal" | "difference" };
      if (blendConfig.blendMode !== "difference") continue;
      const textureKey = this.monochromeTextureKey(config.frameKey);
      if (this.textures.exists(textureKey)) continue;

      const frame = croppedFrames.find((item) => item.key === config.frameKey);
      const source = frame ? this.textures.get(frame.sourceKey)?.getSourceImage() : undefined;
      if (!frame || !(source instanceof HTMLImageElement || source instanceof HTMLCanvasElement)) {
        console.warn(`Could not create monochrome crop for ${config.frameKey}`);
        continue;
      }

      const canvasTexture = this.textures.createCanvas(textureKey, frame.width, frame.height);
      const context = canvasTexture?.getContext();
      if (!canvasTexture || !context) continue;

      context.clearRect(0, 0, frame.width, frame.height);
      context.drawImage(source, frame.x, frame.y, frame.width, frame.height, 0, 0, frame.width, frame.height);
      const imageData = context.getImageData(0, 0, frame.width, frame.height);
      const pixels = imageData.data;

      for (let index = 0; index < pixels.length; index += 4) {
        const luminance = (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3;
        if (luminance > 34) {
          pixels[index] = 17;
          pixels[index + 1] = 17;
          pixels[index + 2] = 17;
          pixels[index + 3] = Math.min(255, Math.max(80, luminance * 1.2));
        } else {
          pixels[index + 3] = 0;
        }
      }

      context.putImageData(imageData, 0, 0);
      canvasTexture.refresh();
    }
  }

  private monochromeTextureKey(frameKey: string) {
    return `${frameKey}_mono`;
  }

  private axis(negative: keyof MobileInputState, positive: keyof MobileInputState) {
    const keyboardNegative =
      negative === "left" ? this.cursors?.left.isDown || this.keys?.A.isDown : this.cursors?.up.isDown || this.keys?.W.isDown;
    const keyboardPositive =
      positive === "right" ? this.cursors?.right.isDown || this.keys?.D.isDown : this.cursors?.down.isDown || this.keys?.S.isDown;
    return Number(Boolean(keyboardPositive || this.mobileInput[positive])) - Number(Boolean(keyboardNegative || this.mobileInput[negative]));
  }

  private updateNearbyObject() {
    const nextNearby = this.findNearbyObject();
    if (nextNearby?.object_id === this.nearbyObject?.object_id) return;
    this.nearbyObject = nextNearby;
    this.callbacks.onNearbyChange(nextNearby);
    this.updateObjectFeedback(nextNearby);
    this.updatePrompt(nextNearby);
  }

  private tryInteract(object: RoomObject | null, time: number) {
    if (!object) return;
    if (time - this.lastInteractAt < 420) return;
    this.lastInteractAt = time;
    this.callbacks.onInteract(object);
  }

  private findNearbyObject(): RoomObject | null {
    if (!this.player) return null;
    let closest: RoomObject | null = null;
    let closestDistance = Number.POSITIVE_INFINITY;

    for (const object of this.objects) {
      const centerX = object.position.x + object.size.width / 2;
      const centerY = object.position.y + object.size.height / 2;
      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, centerX, centerY);
      if (distance <= object.interaction_radius && distance < closestDistance) {
        closest = object;
        closestDistance = distance;
      }
    }

    return closest;
  }

  private wrapPlayer() {
    if (!this.player) return;
    const { wrapBounds, wrapPadding } = mainRoomConfig;
    const left = wrapBounds.x - wrapPadding;
    const right = wrapBounds.x + wrapBounds.width + wrapPadding;
    const top = wrapBounds.y - wrapPadding;
    const bottom = wrapBounds.y + wrapBounds.height + wrapPadding;

    if (this.player.x < left) this.player.x = right;
    if (this.player.x > right) this.player.x = left;
    if (this.player.y < top) this.player.y = bottom;
    if (this.player.y > bottom) this.player.y = top;
  }

  private drawRoom() {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xffffff, 1).fillRect(0, 0, 800, 450);
    graphics.fillStyle(0xffffff, 1).fillRect(mainRoomConfig.bounds.x, mainRoomConfig.bounds.y, mainRoomConfig.bounds.width, mainRoomConfig.bounds.height);
    graphics.lineStyle(2, 0x111111, 0.72).strokeRect(mainRoomConfig.bounds.x, mainRoomConfig.bounds.y, mainRoomConfig.bounds.width, mainRoomConfig.bounds.height);
    graphics.lineStyle(1, 0x111111, 0.18).strokeRect(
      mainRoomConfig.bounds.x + 3,
      mainRoomConfig.bounds.y + 2,
      mainRoomConfig.bounds.width - 5,
      mainRoomConfig.bounds.height - 4,
    );

    const bulbConfig = objectSpriteMap.lightbulbSprite;
    const bulb = this.add.container(400, 0);
    const cord = this.add.rectangle(0, 48, 2, 94, 0x111111, 0.88);
    const bulbImage = this.createCroppedImage(0, 96, bulbConfig);
    bulb.add([cord, bulbImage]);
    this.tweens.add({ targets: bulb, angle: { from: -1.1, to: 1.1 }, duration: 4200, yoyo: true, repeat: -1, ease: "Sine.inOut" });
    this.tweens.add({ targets: bulbImage, alpha: { from: 0.82, to: 1 }, duration: 2600, yoyo: true, repeat: -1, ease: "Sine.inOut" });

    for (let i = 0; i < 7; i += 1) {
      const dust = this.add.circle(180 + i * 72, 154 + (i % 3) * 38, 1, 0x111111, 0.08);
      this.tweens.add({ targets: dust, y: dust.y - 6, alpha: { from: 0.03, to: 0.13 }, duration: 6000 + i * 400, repeat: -1, yoyo: true });
    }
  }

  private drawObjects() {
    for (const object of this.objects) {
      const { x, y } = object.position;
      const { width, height } = object.size;
      const zone = this.add.zone(x + width / 2, y + height / 2, width + 18, height + 18).setInteractive({ useHandCursor: true });
      zone.on("pointerdown", () => this.tryInteract(object, this.time.now));

      this.add.ellipse(x + width / 2 + 3, y + height + 4, width * 0.68, 8, 0x111111, 0.055);
      const sprite = this.drawAssetObject(object);
      if (sprite instanceof Phaser.GameObjects.Image || sprite instanceof Phaser.GameObjects.Sprite) {
        this.objectFeedback.set(object.object_id, {
          target: sprite,
          baseX: sprite.x,
          baseY: sprite.y,
          scaleX: sprite.scaleX,
          scaleY: sprite.scaleY,
        });
      }
      if (object.object_id === "cat" && sprite instanceof Phaser.GameObjects.Sprite) {
        if (!this.anims.exists("cat_idle")) {
          this.anims.create({
            key: "cat_idle",
            frames: [
              { key: objectSpriteMap.catSprite.sourceKey, frame: "obj_cat_0" },
              { key: objectSpriteMap.catSprite.sourceKey, frame: "obj_cat_1" },
            ],
            frameRate: 1,
            repeat: -1,
          });
        }
        sprite.play("cat_idle");
      }
    }
    this.createPrompt();
  }

  private drawAssetObject(object: RoomObject) {
    const assetKey = object.assetKey as ObjectSpriteKey | undefined;
    const config = assetKey ? objectSpriteMap[assetKey] : undefined;
    const centerX = object.position.x + object.size.width / 2;
    const centerY = object.position.y + object.size.height / 2;

    if (!config) {
      return this.drawMissingAssetPlaceholder(centerX, centerY, object.size.width, object.size.height);
    }

    const blendConfig = config as { blendMode?: "normal" | "difference" };
    const textureKey = blendConfig.blendMode === "difference" ? this.monochromeTextureKey(config.frameKey) : config.sourceKey;
    const frameKey = blendConfig.blendMode === "difference" ? undefined : config.frameKey;
    const hasTexture = blendConfig.blendMode === "difference" ? this.textures.exists(textureKey) : Boolean(this.textures.getFrame(config.sourceKey, config.frameKey));
    if (!hasTexture) {
      return this.drawMissingAssetPlaceholder(centerX, centerY, object.size.width, object.size.height);
    }

    const image = object.object_id === "cat" ? this.add.sprite(centerX, centerY, textureKey, frameKey) : this.add.image(centerX, centerY, textureKey, frameKey);

    const originConfig = config as { originX?: number; originY?: number };
    image.setOrigin(originConfig.originX ?? 0.5, originConfig.originY ?? 0.5);
    image.setDisplaySize(config.displayWidth, config.displayHeight);
    image.setDepth(centerY);
    return image;
  }

  private createCroppedImage(x: number, y: number, config: { sourceKey: string; frameKey: string; displayWidth: number; displayHeight: number; originX?: number; originY?: number }) {
    const image = this.add.image(x, y, config.sourceKey, config.frameKey);
    if (!this.textures.getFrame(config.sourceKey, config.frameKey)) {
      image.destroy();
      return this.drawMissingAssetPlaceholder(x, y, config.displayWidth, config.displayHeight);
    }
    image.setOrigin(config.originX ?? 0.5, config.originY ?? 0.5);
    image.setDisplaySize(config.displayWidth, config.displayHeight);
    if ("blendMode" in config && config.blendMode === "difference") {
      image.setBlendMode(Phaser.BlendModes.DIFFERENCE);
    }
    return image;
  }

  private drawMissingAssetPlaceholder(x: number, y: number, width: number, height: number) {
    // Last-resort safety only: normal objects must come from downloaded assets.
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x111111, 0.32).strokeRect(x - width / 2, y - height / 2, width, height);
    return graphics;
  }

  private updateObjectFeedback(active: RoomObject | null) {
    for (const [id, feedback] of this.objectFeedback) {
      const enabled = active?.object_id === id;
      this.tweens.killTweensOf(feedback.target);
      feedback.target.setPosition(feedback.baseX, feedback.baseY);
      feedback.target.setScale(feedback.scaleX, feedback.scaleY);
      if (enabled) {
        this.tweens.add({
          targets: feedback.target,
          y: feedback.baseY - 4,
          scaleX: feedback.scaleX * 1.045,
          scaleY: feedback.scaleY * 1.045,
          duration: 780,
          yoyo: true,
          repeat: -1,
          ease: "Sine.inOut",
        });
        this.spawnSparkle(feedback.baseX, feedback.baseY);
      }
    }
  }

  private createPrompt() {
    const config = objectSpriteMap.promptBoxSprite;
    const box = this.createCroppedImage(0, 0, config);
    box.setDepth(2000);
    const text = this.add
      .text(0, 0, "", {
        fontFamily: '"Courier New", monospace',
        fontSize: "13px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: 360 },
      })
      .setOrigin(0.5)
      .setDepth(2001);
    this.promptText = text;
    this.promptContainer = this.add.container(400, 400, [box, text]).setDepth(2000).setVisible(false);
  }

  private updatePrompt(active: RoomObject | null) {
    if (!this.promptContainer || !this.promptText) return;
    if (!active) {
      this.promptTypeEvent?.remove(false);
      this.promptFullText = "";
      this.promptText.setText("");
      this.promptContainer.setVisible(false);
      return;
    }

    const nextText = active.interactionPrompt ?? `${active.display_name} - press E`;
    this.promptContainer.setPosition(400, 400);
    this.promptContainer.setVisible(true);
    if (nextText === this.promptFullText) return;
    this.startPromptTypewriter(nextText);
  }

  private startPromptTypewriter(text: string) {
    if (!this.promptText) return;
    this.promptTypeEvent?.remove(false);
    this.promptFullText = text;
    this.promptText.setText("");
    let index = 0;
    this.promptTypeEvent = this.time.addEvent({
      delay: 24,
      repeat: text.length - 1,
      callback: () => {
        index += 1;
        this.promptText?.setText(text.slice(0, index));
      },
    });
  }

  private spawnSparkle(x: number, y: number) {
    const sparkle = this.add.text(x + 18, y - 18, "*", {
      fontFamily: '"Courier New", monospace',
      fontSize: "14px",
      color: "#111111",
    });
    sparkle.setOrigin(0.5).setDepth(1999).setAlpha(0.75);
    this.tweens.add({
      targets: sparkle,
      y: sparkle.y - 12,
      alpha: 0,
      duration: 700,
      ease: "Sine.out",
      onComplete: () => sparkle.destroy(),
    });
  }

  private createPlayer(x: number, y: number) {
    const textureExists = this.textures.exists(playerSprite.sourceKey) && this.textures.getFrame(playerSprite.sourceKey, playerSprite.animations.idleDown[0]);
    if (!textureExists) {
      return this.drawMissingPlayer(x, y);
    }

    const sprite = this.add.sprite(x, y, playerSprite.sourceKey, playerSprite.animations.idleDown[0]);
    sprite.setOrigin(playerSprite.originX, playerSprite.originY);
    sprite.setScale(playerSprite.scale);
    sprite.setDepth(y + 2);
    sprite.play("idleDown");
    return sprite;
  }

  private drawMissingPlayer(x: number, y: number) {
    // Last-resort fallback for a missing downloaded character sheet.
    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0x111111, 1).strokeRect(x - 10, y - 32, 20, 30);
    const sprite = this.add.sprite(x, y, "__MISSING");
    sprite.setOrigin(0.5, 1);
    sprite.setVisible(false);
    return sprite;
  }

  private createPlayerAnimations() {
    for (const [name, frames] of Object.entries(playerSprite.animations)) {
      if (!frames.length || this.anims.exists(name)) continue;
      this.anims.create({
        key: name,
        frames: frames.map((frame) => ({ key: playerSprite.sourceKey, frame })),
        frameRate: name.startsWith("walk") ? 5 : 2,
        repeat: name.startsWith("walk") ? -1 : 0,
      });
    }
  }

  private updatePlayerAnimation(dx: number, dy: number) {
    if (!this.player) return;

    if (dx === 0 && dy === 0) {
      const idleKey = `idle${this.lastDirection[0].toUpperCase()}${this.lastDirection.slice(1)}`;
      if (this.anims.exists(idleKey)) this.player.play(idleKey, true);
      this.player.setDepth(this.player.y + 2);
      return;
    }

    if (Math.abs(dx) > Math.abs(dy)) {
      this.lastDirection = dx < 0 ? "left" : "right";
    } else {
      this.lastDirection = dy < 0 ? "up" : "down";
    }

    const walkKey = `walk${this.lastDirection[0].toUpperCase()}${this.lastDirection.slice(1)}`;
    if (this.anims.exists(walkKey)) this.player.play(walkKey, true);
    this.player.setDepth(this.player.y + 2);
  }
}
