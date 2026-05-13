# Change Log

All notable changes to the "sushi-theme" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

<!-- ## [1.7.2] - 2026-05-13

### Fixed
- Physics: Fixed an issue where sushi particles would jitter endlessly on the floor. Particles now come to a natural resting state.
- Physics: Improved collision resolution by adding tangential friction, making sushi interactions look more realistic.
- Physics Accuracy: Fixed a "phantom collision" bug where sushi pieces would bounce off each other in mid-air. The physics engine now accurately calculates distances using absolute global coordinates instead of relative text-anchor coordinates.
- Tracking Accuracy: Fixed a bug where chopsticks would fly off the screen instead of tracking flying sushi.
- Sensor Logic: Tracking items (chopsticks) now properly act as physics "sensors". They will no longer bounce off sushi pieces, ensuring they catch their targets reliably.

### Performance
- ECS Engine: Slightly optimized the component querying order in rendering and collision systems to prevent unnecessary operations.

### Changed
- Increased the tracking capture distance to ensure explosion animations trigger exactly when the chopsticks touch the sushi. -->

## [1.7.1] - 2026-05-13

### Refactored
- ECS Architecture: Extracted collision logic into a dedicated `CollisionSystem` and introduced a `ColliderComponent` with mass and restitution properties for more accurate, impulse-based physics resolution.
- Architecture: Decoupled the particle spawning logic and `ParticleProfile` definitions from the ECS core package. The core is now strictly a data-driven entity manager, while the VS Code extension securely handles its own visual spawning logic and configurations.
- Tooling: Added an `install:core` script to simplify local workspace setup and dependency linking.
- ECS Architecture: Overhauled the Entity Component System. The Registry now supports dynamic component registration, and systems are completely decoupled, making the architecture much cleaner and highly scalable.
- Physics Pipeline: Decoupled the tracking logic from the physics engine. Tracking now cleanly applies directional "Forces" rather than overriding velocities, resolving potential state conflicts and making movement more natural.
- Type Safety: Replaced magic strings with a centralized component mapping for safer and more robust component queries.
- Spatial Hash Grid: Completely overhauled the collision detection engine. By utilizing a zero-allocation Spatial Hash Grid, the physics calculation complexity has been reduced from $O(N^2)$ to $O(N)$. This guarantees buttery-smooth 60 FPS even when hundreds of sushi pieces are bouncing on the screen during Fever Mode.
- Physics Stability: Introduced a multi-iteration physics solver to prevent high-speed particles from clipping through each other or getting stuck in clumps.
- Line Highlight Optimization: Implemented line-caching for the Fever Mode highlight. This eliminates redundant object allocations during horizontal cursor movement, significantly reducing Garbage Collection (GC) spikes.

### Fixed
- Real-time Collision Toggle: Fixed a bug where toggling the `Enable Particle Collision` setting required an editor reload. You can now turn physics on and off seamlessly on the fly.
- Ghost Particles: Fixed a visual glitch where closing a file tab would sometimes leave frozen particles permanently stuck on the screen.

### Changed
- Monorepo Structure: Reorganized internal packages under the `packages/typing-fx/` namespace to strictly separate the engine's core, physics, and tracking modules.
- Increased the maximum value of the `Particle Lifespan Multiplier` setting from `10.0` to `50.0` for users who want to build massive mountains of sushi.
- Updated README to include new interactive physics showcases and a friendly "Chef's Warning".
- Internal code cleanups and naming convention standardization across particle profile factories.

### Performance
- Render Optimization: Extracted static CSS properties to drastically reduce dynamic string allocations per frame. This significantly mitigates Garbage Collection (GC) spikes, ensuring buttery-smooth 60+ FPS even during intense typing and Fever Mode.

## [1.7.0] - 2026-05-10

### Added
- Particle Collision: Introduce physics-based particle collisions! Sushi pieces can now interact and bounce off each other mid-air.
- Add `Enable Particle Collision` setting to toggle the new physics effect (default: `false`).
- Add `Particle Restitution` setting to adjust how bouncy the sushi particles are when they collide with each other.

### Changed
- Internal Architecture: Renamed particle definition objects from `Config` to `Profile` (e.g., `ParticleProfile`) to better align with standard Game Engine and ECS terminology, distinguishing them from global extension settings.

### Refactored
- Separation of Concerns: Extracted the complex particle spawning and explosion logic out of the effect manager into a dedicated `particle-effect` module.
- Event Routing: Streamlined `effect-manager` to act purely as a lifecycle and event router, drastically improving code readability and making future visual effects much easier to implement.
- Dependency Injection: Resolved circular dependencies between the ECS collision system and the visual effect spawners using delayed binding.

## [1.6.3] - 2026-05-07

### Changed
- Internal Improvements: Upgraded the internal animation engine to be more robust and flexible. This under-the-hood change improves stability and lays the groundwork for richer visual effects in the future.

### Fixed
- Settings Update: Fixed an issue where changing certain configurations (especially "Bounce Top Distance", "Bounce Bottom Distance", and FPS) did not take effect until VS Code was reloaded. All settings now apply instantly!
- Explosion Animation: Fixed a visual bug where chopsticks catching a flying sushi would incorrectly drop a "Maguro" at the text cursor. It now correctly displays a proper explosion animation exactly where the mid-air collision happens.

## [1.6.2] - 2026-05-06

### Performance
- Implemented a centralized configuration caching system to drastically reduce overhead from querying the VS Code API every frame.
- Mitigated GC (Garbage Collection) spikes by reusing array instances and optimizing loop iterations in the rendering system.

### Fixed
- Fixed a critical memory leak caused by uncleared timeouts during particle spawning.
- Fixed an ECS logic bug where tracking particles were immediately destroyed, causing potential visual glitches.
- Fixed a visual bug where fever line highlights would incorrectly persist when switching between editor tabs.
- Restored the particle level scaling logic so particle sizes correctly increase based on the combo count.
- Added strict validation and clamping to user settings to prevent crashes caused by invalid `settings.json` values.

## [1.6.1] - 2026-05-05
- Add a new "Chopsticks" interaction: chopsticks will occasionally spawn, track flying sushi, and trigger a multi-frame explosion animation upon impact
- Add `Bounce Bottom Distance` setting to simulate a floor collision and bouncing effect
- Add `Particle Lifespan Multiplier` setting to allow users to scale the display duration of particles
- Refactor the ECS (Entity Component System) to use a Generational ID management architecture for safer and more robust entity lifecycle tracking
- Update localization files (i18n) to support the newly added settings

## [1.5.1] - 2026-05-04
- Fixed the description property to correctly handle the placeholder for sushiTheme.desc.

## [1.5.0] - 2026-05-02
- Add internationalization (i18n) support ([#6](https://github.com/tomopumipumi/SUSHI-Theme_ForVSCode/pull/6#issue-4367232946))
- Add localized translations for Simplified Chinese, Korean, Spanish, French, and Vietnamese ([#6](https://github.com/tomopumipumi/SUSHI-Theme_ForVSCode/pull/6#issue-4367232946))
- Added a new `sushiTheme.fps` setting. You can now choose between 15, 30 (default), and 60 FPS to prioritize either editor performance or smooth animations.([#7](https://github.com/tomopumipumi/SUSHI-Theme_ForVSCode/pull/7#issue-4367507005))

## [1.4.0] - 2026-05-01
- Add `Particle Speed Multiplier` setting to allow users to adjust the flying speed of sushi particles
- Add `Bounce Top Distance` setting to enable a ceiling bounce effect for flying sushi
- Update the physics system to handle velocity reversal and simulate natural bouncing

## [1.3.0] - 2026-05-01
- Add `Throttle Ms` setting to allow users to adjust the effect rendering interval
- Improve rendering performance by throttling continuous effect updates to prevent editor lag during key holds

## [1.2.0] - 2026-04-30
- Enhance syntax highlighting with refined colors and new semantic tokens support
- Optimize typing effect rendering to eliminate stuttering during continuous keystrokes
- Implement object pooling and Delta Time (dt) to reduce GC spikes and smooth out particle animations

## [1.1.1] - 2026-04-29
- Display system memory usage and add web fallback

## [1.0.1] - 2026-04-29
- Add README Images

## [1.0.0] - 2026-04-29
- Initial release

