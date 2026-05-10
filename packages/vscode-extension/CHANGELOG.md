# Change Log

All notable changes to the "sushi-theme" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

<!-- ## [1.7.1] - 2026-05-10

### Refactored
- ECS Architecture: Extracted collision logic into a dedicated `CollisionSystem` and introduced a `ColliderComponent` with mass and restitution properties for more accurate, impulse-based physics resolution.
- Architecture: Decoupled the particle spawning logic and `ParticleProfile` definitions from the ECS core package. The core is now strictly a data-driven entity manager, while the VS Code extension securely handles its own visual spawning logic and configurations.
- Tooling: Added an `install:core` script to simplify local workspace setup and dependency linking. -->

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

