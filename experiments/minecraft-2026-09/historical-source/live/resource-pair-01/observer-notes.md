# Operator observations (not supplied to workers)

## Control, live notes

- Opening: all three performed the same requested material searches. No stone/coal/iron was returned. This is bounded observation, not a proof about arbitrary world extent.
- New message 48: A announces correction of an earlier leaves/no-drops belief, reports saplings/logs. The claim is retained; validate actual pickups independently.
- New message 50: A reports an apple and more saplings, shifts toward leaf clearing/tree renewal.
- New message 51: B explicitly corrects growth-stagnation concern based on changed wheat ages.
- New message 52: B places a composter. Actual `interact` changed level0 to level1 and consumed bread. Later message53 says cost is unattractive and stops using bread. This was not a prescribed workflow.
- C builds farm fencing, relying on nearby tree trunks as part of the boundary. Later B harvests trees at (7,-6)/(8,-6); check whether this opens C's assumed boundary. Do not assume intentional disagreement.
- A sees slabs/fences and says it will replenish construction stock. Trace subsequent deposits and actual use before calling this a dependency chain.
- 16:02:22Z A actually retrieves charcoal smelted from a log with planks as fuel; no coal ore was needed. Both arms have the furnace interface, so this cannot be attributed to the resource intervention.
- Furnace slot data works, but returned progress/fuelRemaining can be null on immediate open (unknown metadata). No mid-pair patch; report limitation. Inventory/output observations remain separately recorded.
- New actions can change reality while old beliefs remain stale. Message sent is not evidence of message read.

## Control final checks

- All three reached segment12, 456 runtime model turns, 47,475,661 cumulative tokens (cache included), 269,533 output tokens. 243 action calls,31 action errors,404 observations. Nine new messages48–56 and36 checkpoints. No worker read any new message48–56: A/C read41–47 at entry, B paged1–47 at entry; no later inbox reads. Therefore do not attribute adaptations to new messages.
- One C assistant event at16:04:21.489Z has stopReason=error, empty content, zero usage; exact provider cause unavailable. Later neutral continuation yielded useful work; final service Run error retains this. All new worker exit codes0. Operator stops interactive workers at end, so ended/interrupted is not task completion.
- C observed (3,-60,-4) age7 at16:06:23.733Z, dig action call_00_26x4mAGqXgQjodbVpIeZ5321 completed16:06:26.259Z. B inventory was empty of wheat/seeds at16:06:33.750Z, then wheat1/seeds3 at16:06:45.226Z. B planted seeds at (6,-4),(7,-4),(6,-3), deposited wheat16:07:25.506Z. C never acquired wheat/seeds in this interval. No other wheat dig by A/B in the interval. This supports cross-worker use of C's harvest, without a recorded per-item UUID provenance chain.
- B's final summary still names A as harvester, while C correctly names itself. A had no actions after16:04:51.656Z. Practical harvest/replant/store success coexists with persistent incorrect attribution.
- Final world: wheat12→15, farmland35→32, chest2→3,24 fences+1 gate+1 composter+1 placedtorch. Public wheat2, charcoal1,storedtorches3. Counts include natural growth/decay and cannot all be credited to intentional work.
