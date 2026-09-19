# Media inventory and clocks

All video assets are silent. No interior cuts were needed in the retained work windows; original audio and leading/trailing non-work material are excluded. The short desktop-only clip is omitted entirely. Original 2560×1600/120fps files remain private; game viewing copies are upright 1600×1000/30fps, with no speed-up or event rearrangement.

| Arm | Original filename | Source seconds retained | Published duration | Source offset |
|---|---|---|---|---|
| S03 | Minecraft 2026.09.18 - 19.18.19.06.mp4 | 48–771 | 12:03 | +48s |
| S05 | Minecraft 2026.09.18 - 22.25.57.07.mp4 | 1–939 | 15:38 | +1s |
| RC | Minecraft 2026.09.18 - 23.53.19.08.mp4 | 14–869 | 14:15 | +14s |
| RI | Minecraft 2026.09.19 - 00.10.54.09.mp4 | 26–892 | 14:26 | +26s |
| H0 | Minecraft 2026.09.19 - 02.16.15.10.mp4 | 25–986 | 16:01 | +25s |
| H1 | Minecraft 2026.09.19 - 02.34.51.11.mp4 | 36–992 | 15:56 | +36s |
| G2 | Minecraft 2026.09.19 - 03.17.52.12.mp4 | 9–749 | 12:20 | +9s |

For these files: **source seconds = published seconds + offset**. UTC = filename-estimated start UTC + source seconds. Filename timestamps were local UTC+8; container creation timestamps correspond approximately to the END of recording. The two start estimates differ by less than a second, but frame-accurate event synchronization has not been established. See [media-index.json](media-index.json) for Run identities, UTC and the exact CLI frame map.

CLI MP4 frame/snapshot index i starts at i×3 seconds. Adjacent snapshots were ordinarily collected about 15 real seconds apart. The original cast preserves capture-relative timing; the MP4 does not. Never line up equal game/CLI playback seconds and assume they depict the same instant. CLI samples near an episode may show status or board rather than its text; use the timestamped trace for quotations.

## Historical path aliases

Reports and trace sources preserve historical paths as provenance, not expected installation locations. Map any path under the following roots to the named extracted ZIP directory.

- `E:\Minecraft\Threshold-Experiment\live\session-02` → `S02/`
- `E:\Minecraft\Threshold-Experiment\live\session-03` → `S03/`
- `E:\Minecraft\Threshold-Experiment\live\session-05` → `S05/`
- `E:\Minecraft\Threshold-Experiment\live\resource-pair-01\control` → `RC/`
- `E:\Minecraft\Threshold-Experiment\live\resource-pair-01\intervention` → `RI/`
- `E:\Minecraft\Threshold-Experiment\live\run-06\r17` → `H0/`
- `E:\Minecraft\Threshold-Experiment\live\run-06\r42` → `H1/`
- `E:\Minecraft\Threshold-Experiment\live\run-07\r01` → `G2/`

The root historical scripts are mirrored under `historical-source/live/`. They contain local assumptions; use REPRODUCE.md rather than running them blindly. S02 game video is missing; no later footage is substituted.
