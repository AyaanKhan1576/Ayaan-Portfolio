import Phaser from "phaser";
import { ambientParticles } from "./assets/ambientAnimationConfig";
import { mainRoomConfig } from "./assets/roomConfig";
import { playerSprite } from "./assets/playerConfig";
import { croppedFrames, objectSpriteMap, sourceImages } from "./assets/spriteConfig";
import type { ObjectSpriteKey } from "./assets/spriteConfig";
import type { RoomObject } from "../types";

export interface RoomSceneCallbacks {
  onNearbyChange: (object: RoomObject | null) => void;
  onHoverChange: (object: RoomObject | null) => void;
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
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys?: Record<string, Phaser.Input.Keyboard.Key>;
  private nearbyObject: RoomObject | null = null;
  private hoveredObject: RoomObject | null = null;
  private mobileInput: MobileInputState = { up: false, down: false, left: false, right: false };
  private mobileSelectedObjectId: string | null = null;
  private objectPointerDownAt = 0;
  private lastInteractAt = 0;
  private lastDirection: PlayerDirection = "down";
  private interactionLocked = false;

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

    if (!this.textures.exists("lightbulb")) {
      this.load.image("lightbulb", "/assets/sprites/lightbulb.png");
    }

    if (!this.textures.exists("honors")) {
      this.load.image("honors", "/assets/sprites/honors.png");
    }

    if (!this.textures.exists("education")) {
      this.load.image("education", "/assets/sprites/education.png");
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
    this.createAmbientAnimationFrames();
    this.drawRoom();
    this.drawObjects();
    this.drawAmbientElements();

    this.playerShadow = this.add.ellipse(mainRoomConfig.playerStart.x, this.sceneY(mainRoomConfig.playerStart.y) + 5, 25, 7, 0x111111, 0.08);
    this.player = this.createPlayer(mainRoomConfig.playerStart.x, this.sceneY(mainRoomConfig.playerStart.y));

    this.cursors = this.input.keyboard?.createCursorKeys();
    this.keys = this.input.keyboard?.addKeys("W,A,S,D,E,SPACE") as Record<string, Phaser.Input.Keyboard.Key>;
    this.registerMobileBackgroundDismissal();
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

  setInteractionLocked(locked: boolean) {
    this.interactionLocked = locked;
    if (locked) {
      this.nearbyObject = null;
      this.hoveredObject = null;
      this.mobileSelectedObjectId = null;
      this.callbacks.onNearbyChange(null);
      this.callbacks.onHoverChange(null);
      this.updateObjectFeedback(null);
    }
  }

  interactWithNearby() {
    if (this.interactionLocked) return;
    const mobileSelection = this.mobileSelectedObjectId
      ? this.objects.find((object) => object.object_id === this.mobileSelectedObjectId) ?? null
      : null;
    this.tryInteract(mobileSelection ?? this.nearbyObject, this.time.now);
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
      if (!config.frameKey) {
        console.warn(`Could not create monochrome crop for ${config.id}: missing frameKey`);
        continue;
      }
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

    this.registerCatCutoutFrames();
  }

  private catCutoutTextureKey(frameKey: string) {
    return `${frameKey}_cutout`;
  }

  private registerCatCutoutFrames() {
    const catFrames = croppedFrames.filter((frame) => frame.key === "obj_cat_0" || frame.key === "obj_cat_1");
    for (const frame of catFrames) {
      const textureKey = this.catCutoutTextureKey(frame.key);
      if (this.textures.exists(textureKey)) continue;

      const source = this.textures.get(frame.sourceKey)?.getSourceImage();
      if (!(source instanceof HTMLImageElement || source instanceof HTMLCanvasElement)) continue;

      const canvasTexture = this.textures.createCanvas(textureKey, frame.width, frame.height);
      const context = canvasTexture?.getContext();
      if (!canvasTexture || !context) continue;

      context.clearRect(0, 0, frame.width, frame.height);
      context.drawImage(source, frame.x, frame.y, frame.width, frame.height, 0, 0, frame.width, frame.height);
      const imageData = context.getImageData(0, 0, frame.width, frame.height);
      const pixels = imageData.data;

      for (let index = 0; index < pixels.length; index += 4) {
        const luminance = (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3;
        if (luminance > 240) {
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
    if (this.interactionLocked) {
      this.clearSelection();
      return;
    }

    const nextNearby = this.findNearbyObject();
    if (nextNearby?.object_id === this.nearbyObject?.object_id) return;
    this.nearbyObject = nextNearby;
    this.callbacks.onNearbyChange(nextNearby);
    this.updateObjectFeedback(nextNearby);
  }

  private setHoveredObject(object: RoomObject | null) {
    if (this.interactionLocked) {
      object = null;
    }
    if (object?.object_id === this.hoveredObject?.object_id) return;
    this.hoveredObject = object;
    this.callbacks.onHoverChange(object);
  }

  private tryInteract(object: RoomObject | null, time: number) {
    if (this.interactionLocked) return;
    if (!object) return;
    if (time - this.lastInteractAt < 420) return;
    this.lastInteractAt = time;
    this.callbacks.onInteract(object);
  }

  private clearSelection() {
    this.nearbyObject = null;
    this.hoveredObject = null;
    this.mobileSelectedObjectId = null;
    this.callbacks.onNearbyChange(null);
    this.callbacks.onHoverChange(null);
    this.updateObjectFeedback(null);
  }

  private findNearbyObject(): RoomObject | null {
    if (!this.player) return null;
    let closest: RoomObject | null = null;
    let closestDistance = Number.POSITIVE_INFINITY;

    for (const object of this.objects) {
      const centerX = object.position.x + object.size.width / 2;
      const centerY = this.sceneY(object.position.y + object.size.height / 2);
      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, centerX, centerY);
      const interactionRadius = this.effectiveInteractionRadius(object);
      if (distance <= interactionRadius && distance < closestDistance) {
        closest = object;
        closestDistance = distance;
      }
    }

    return closest;
  }

  private isMobileViewport() {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 680px), (pointer: coarse)").matches;
  }

  private mobileObjectScale() {
    return this.isMobileViewport() ? 1.35 : 1;
  }

  private effectiveInteractionRadius(object: RoomObject) {
    if (!this.isMobileViewport()) return object.interaction_radius;
    return Math.max(object.interaction_radius * 1.45, 76);
  }

  private mobileWorldOffsetY() {
    return this.isMobileViewport() ? -48 : 0;
  }

  private sceneY(y: number) {
    return y + this.mobileWorldOffsetY();
  }

  private registerMobileBackgroundDismissal() {
    this.input.on("pointerdown", () => {
      if (!this.isMobileViewport() || this.interactionLocked) return;
      this.time.delayedCall(0, () => {
        if (this.time.now - this.objectPointerDownAt > 60) {
          this.clearSelection();
        }
      });
    });
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
    const offsetY = this.mobileWorldOffsetY();
    const graphics = this.add.graphics();
    graphics.fillStyle(0xffffff, 1).fillRect(0, 0, 800, 450);
    graphics.fillStyle(0xffffff, 1).fillRect(mainRoomConfig.bounds.x, mainRoomConfig.bounds.y + offsetY, mainRoomConfig.bounds.width, mainRoomConfig.bounds.height);
    graphics.lineStyle(2, 0x111111, 0.72).strokeRect(mainRoomConfig.bounds.x, mainRoomConfig.bounds.y + offsetY, mainRoomConfig.bounds.width, mainRoomConfig.bounds.height);
    graphics.lineStyle(1, 0x111111, 0.18).strokeRect(
      mainRoomConfig.bounds.x + 3,
      mainRoomConfig.bounds.y + 2 + offsetY,
      mainRoomConfig.bounds.width - 5,
      mainRoomConfig.bounds.height - 4,
    );
    graphics.lineStyle(2, 0x111111, 1).lineBetween(398, 0, 398, mainRoomConfig.bounds.y - 50 + offsetY);

    const bulb = this.add.image(400, mainRoomConfig.bounds.y - 8 + offsetY, "lightbulb");
    bulb.setOrigin(0.5, 1.3);
    bulb.setScale(1.4);
    bulb.setDepth(2);
  }

  private createAmbientAnimationFrames() {
    if (!this.anims.exists("fluff_breathe")) {
      this.anims.create({
        key: "fluff_breathe",
        frames: [
          { key: this.catCutoutTextureKey("obj_cat_0") },
          { key: this.catCutoutTextureKey("obj_cat_1") },
        ],
        frameRate: 1,
        repeat: -1,
      });
    }
  }

  private drawAmbientElements() {
    for (const particle of ambientParticles) {
      const dot = this.add.circle(particle.x, this.sceneY(particle.y), particle.size, 0x111111, particle.alpha);
      this.tweens.add({
        targets: dot,
        x: dot.x + particle.driftX,
        y: dot.y + particle.driftY,
        alpha: { from: particle.alpha, to: particle.alpha * 1.7 },
        duration: particle.duration,
        delay: particle.delay,
        repeat: -1,
        yoyo: true,
        ease: "Sine.inOut",
      });
    }
  }

  private drawObjects() {
    for (const object of this.objects) {
      const { x, y } = object.position;
      const { width, height } = object.size;
      const renderY = this.sceneY(y);
      const assetKey = object.assetKey as ObjectSpriteKey | undefined;
      const config = assetKey ? objectSpriteMap[assetKey] : undefined;
      const mobile = this.isMobileViewport();
      const mobileScale = this.mobileObjectScale();
      const visibleWidth = (config?.displayWidth ?? width) * mobileScale;
      const visibleHeight = (config?.displayHeight ?? height) * mobileScale;
      const hitboxPadding = mobile ? 42 : 18;
      const baseHitboxWidth = config?.hitboxWidth ?? visibleWidth + hitboxPadding;
      const baseHitboxHeight = config?.hitboxHeight ?? visibleHeight + hitboxPadding;
      const hitboxWidth = Math.max(baseHitboxWidth * (mobile ? 1.3 : 1), mobile ? 58 : 0);
      const hitboxHeight = Math.max(baseHitboxHeight * (mobile ? 1.3 : 1), mobile ? 58 : 0);
      const zone = this.add.zone(x + width / 2, renderY + height / 2, hitboxWidth, hitboxHeight).setInteractive({ useHandCursor: true });
      zone.on("pointerover", () => {
        if (this.isMobileViewport()) return;
        if (!this.interactionLocked) this.setHoveredObject(object);
      });
      zone.on("pointerout", () => {
        if (this.isMobileViewport()) return;
        if (this.hoveredObject?.object_id === object.object_id) this.setHoveredObject(null);
      });
      zone.on("pointerdown", () => {
        this.objectPointerDownAt = this.time.now;
        if (this.interactionLocked) return;
        if (this.isMobileViewport()) {
          const alreadySelected = this.mobileSelectedObjectId === object.object_id;
          if (!alreadySelected) {
            this.mobileSelectedObjectId = object.object_id;
            this.nearbyObject = object;
            this.hoveredObject = object;
            this.callbacks.onNearbyChange(object);
            this.callbacks.onHoverChange(object);
            this.updateObjectFeedback(object);
            return;
          }
        }
        this.tryInteract(object, this.time.now);
      });

      this.add.ellipse(x + width / 2 + 3, renderY + height + 4, width * 0.68, 8, 0x111111, 0.055);
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
              { key: this.catCutoutTextureKey("obj_cat_0") },
              { key: this.catCutoutTextureKey("obj_cat_1") },
            ],
            frameRate: 1,
            repeat: -1,
          });
        }
        sprite.play("cat_idle");
      }
    }
  }

  private drawAssetObject(object: RoomObject) {
    const assetKey = object.assetKey as ObjectSpriteKey | undefined;
    const config = assetKey ? objectSpriteMap[assetKey] : undefined;
    const centerX = object.position.x + object.size.width / 2;
    const centerY = this.sceneY(object.position.y + object.size.height / 2);

    if (!config) {
      return this.drawMissingAssetPlaceholder(centerX, centerY, object.size.width, object.size.height);
    }

    const blendConfig = config as { blendMode?: "normal" | "difference"; directImage?: boolean };
    const textureKey = blendConfig.blendMode === "difference" && config.frameKey ? this.monochromeTextureKey(config.frameKey) : config.sourceKey;
    const frameKey = blendConfig.blendMode === "difference" || blendConfig.directImage ? undefined : config.frameKey;
    const hasTexture = blendConfig.blendMode === "difference"
      ? this.textures.exists(textureKey)
      : blendConfig.directImage
        ? this.textures.exists(config.sourceKey)
        : Boolean(config.frameKey && this.textures.getFrame(config.sourceKey, config.frameKey));
    if (!hasTexture) {
      return this.drawMissingAssetPlaceholder(centerX, centerY, object.size.width, object.size.height);
    }

    const image = object.object_id === "cat" && config.frameKey
      ? this.add.sprite(centerX, centerY, this.catCutoutTextureKey(config.frameKey))
      : blendConfig.directImage
        ? this.add.image(centerX, centerY, config.sourceKey)
        : this.add.image(centerX, centerY, textureKey, frameKey);

    const originConfig = config as { originX?: number; originY?: number };
    image.setOrigin(originConfig.originX ?? 0.5, originConfig.originY ?? 0.5);
    if (blendConfig.directImage && config.sourceCrop) {
      image.setCrop(config.sourceCrop.x, config.sourceCrop.y, config.sourceCrop.width, config.sourceCrop.height);
    }
    const mobileScale = this.mobileObjectScale();
    image.setDisplaySize(config.displayWidth * mobileScale, config.displayHeight * mobileScale);
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
