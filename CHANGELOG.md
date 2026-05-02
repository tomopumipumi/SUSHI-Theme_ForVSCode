# Change Log

All notable changes to the "sushi-theme" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

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

