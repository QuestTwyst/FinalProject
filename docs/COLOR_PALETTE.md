# QuestTwyst Color Palette & Theme Audit

**Last verified:** July 2026
**Scope:** Every genre theme in the Story Reader (light + dark mode), plus every non-story page (Login, Create Account, Profile, About, Password Reset).

---

## 1. Audit Summary

All 7 genre themes were checked in both light and dark mode across: passage text, choice buttons, story titles, and metadata text (genre tag, author line, description).

| Genre | Light mode | Dark mode | Notes |
|---|---|---|---|
| Romance | ✅ Solid | ✅ Solid | Text relies on the shared dark-mode fallback rather than its own override — verified this is safe (no competing rule) |
| Mystery | ✅ Solid | ✅ Solid | Explicit light/dark card + text pair |
| Adventure | ✅ Solid | ✅ Solid | Explicit light/dark card + text pair |
| Sci-Fi | ✅ Solid | ✅ Solid | Card is intentionally dark in *both* site themes (HUD panel design) — one text color covers both |
| Western | ✅ Solid | ✅ Solid | Explicit light/dark card + text pair |
| Comedy | ✅ Solid | ✅ Solid | Explicit light/dark card + text pair |
| Horror | ✅ Solid | ✅ Solid | Card is intentionally dark in *both* site themes (weathered dark card design) — one text color covers both |

**On the original Sci-Fi/Horror concern:** the ticket's premise — that these two lack explicit dark-mode overrides — is technically true, but doesn't cause the readability problem it implies. Both genres deliberately keep their story card dark-toned regardless of the site's light/dark toggle (it's part of their visual identity: a terminal/HUD panel for Sci-Fi, a weathered dark panel for Horror), so their text color only needs to be set once, not duplicated per site-theme. This is a **different but equally valid pattern** from the other five genres, not a bug. No code changes were needed here.

**Non-story pages:**

| Page | Has dark mode? | Styling status |
|---|---|---|
| Profile | No | ✅ Fully styled, good contrast (navy text on light blue) |
| About | No | ✅ Fully styled, good contrast (navy text on light blue) |
| Login | No | ⚠️ **No CSS exists at all** — renders with plain browser defaults |
| Create Account | No | ⚠️ **No CSS exists at all** — renders with plain browser defaults |
| Password Reset | No | ⚠️ **No CSS exists at all** — renders with plain browser defaults |

None of the 5 non-story pages have a dark mode — there's no `isDark` state or `.themeDark` class anywhere in them. That satisfies the letter of "readable in both modes" (there's only one mode to check), but it's worth a team decision on whether that's acceptable scope or a real gap, given the rest of the site supports dark mode.

The bigger finding: **Login, Create Account, and Password Reset have no dedicated stylesheet at all.** Their `auth-page`/`auth-card` class names appear in the JSX but are never defined anywhere in the codebase. They currently render with unstyled browser defaults — not a contrast bug (default black-on-white reads fine), but a real branding/consistency gap separate from what this ticket set out to check.

---

## 2. Flagged for a separate issue: dark mode doesn't persist across pages

Each page (Home, Library, Story Reader) keeps its **own independent** `isDark` state — toggling dark mode on one page has no effect on any other page you navigate to next. This is the same category of bug that mute/volume had before being fixed with `usePersistedAudioSettings`.

**Recommendation:** handle this separately from the color/contrast work in this ticket. It's a state-management fix (mirror the audio-settings pattern: read/write a shared `localStorage` value instead of local `useState`), not a color change, and bundling it here risks scope creep on an already-large ticket. Flagging it explicitly so it doesn't get lost.

---

## 3. Documented Color Palette

### Shared / generic (used when a genre has no more specific override)

| Purpose | Light mode | Dark mode |
|---|---|---|
| Body text (passage, description, ending note) | `#16324f` (site default navy) | `#f4f4f8` |
| Metadata details (genre tag, author line) | `#16324f` / muted | `#b8c4d0` |
| Choice button background | `rgba(255,255,255,0.6)` | `rgba(255,255,255,0.12)`, text `#f4f4f8` |
| Choice label badge ("A"/"B") | bg `#16324f`, text `#ffffff` | bg `#f4f4f8`, text `#16324f` |

### Romance
| Element | Light | Dark |
|---|---|---|
| Title | `#b3123f` | `#ffd9e3` |
| Card background | `rgba(255,255,255,0.65)` | `rgba(58,13,31,0.65)` |
| Body text | *(shared fallback)* `#16324f` | *(shared fallback)* `#f4f4f8` |
| Choice button | `rgba(255,255,255,0.92)`, border `rgba(232,56,94,0.4)` | `rgba(58,22,74,0.88)`, text `#f4f4f8`, border `rgba(199,125,255,0.5)` |
| Choice label | bg `#e8385e` | *(same)* |
| Accent | `#e8385e` (pink/red) |

### Mystery
| Element | Light | Dark |
|---|---|---|
| Title | `#f0e2c2` |
| Card background | `rgba(245,232,205,0.94)` | `rgba(30,22,15,0.92)` |
| Body text | `#2b1d12` | `#f0e2c2` |
| Choice button | `rgba(255,250,240,0.85)`, text `#2b1d12` | `rgba(30,22,15,0.85)`, text `#f0e2c2` |
| Choice label | bg `#a3241c`, text `#f0e2c2` |
| Accent | `#a3241c` (deep red) |

### Adventure
| Element | Light | Dark |
|---|---|---|
| Title | `#ff6b35` with white stroke |
| Card background | `rgba(255,255,255,0.93)`, border `#00b4be` | `rgba(20,35,37,0.93)`, border `#ffb703` |
| Body text | `#1f3a3d` | `#eafafb` |
| Choice button | bg `#00b4be`, text `#ffffff` | bg `#ff6b35`, text `#ffffff` |
| Choice label | bg `#ff6b35`, text `#ffffff` | bg `#ffb703`, text `#1f3a3d` |
| Accent | `#00b4be` (teal) / `#ff6b35` (orange) |

### Sci-Fi
| Element | Value (same in both site themes) |
|---|---|
| Title | `#00e5ff` with cyan glow |
| Card background | `rgba(8,16,26,0.88)` (light) / `rgba(4,10,18,0.92)` (dark) — both near-black |
| Body text | `#dff6fb` (theme-agnostic) |
| Accent | `#00e5ff` (cyan) |

### Western
| Element | Light | Dark |
|---|---|---|
| Title | `#ffe0b0` |
| Card background | `rgba(250,235,210,0.93)` | `rgba(40,26,16,0.93)` |
| Body text | `#3a2313` | `#f2ddc0` |
| Choice button | `rgba(255,246,230,0.85)`, text `#3a2313` | `rgba(40,26,16,0.85)`, text `#f2ddc0` |
| Choice label | bg `#8a4220`, text `#ffe8cc` |
| Accent | `#8a4220` (leather brown) |

### Comedy
| Element | Light | Dark |
|---|---|---|
| Title | `#ffd60a` with black stroke |
| Card background | `rgba(255,255,255,0.95)`, border `#1a1a1a` | `rgba(35,30,25,0.96)`, border `#ffd60a` |
| Body text | `#1a1a1a` | `#fdf6e3` |
| Choice button | bg `#ffd60a`, text `#1a1a1a` | bg `#2a2420`, text `#fdf6e3`, border `#ffd60a` |
| Choice label | bg `#1a1a1a`, text `#ffd60a` |
| Accent | `#ffd60a` (yellow) / `#ff2f6e` (hot pink, hover) |

### Horror
| Element | Value (same in both site themes) |
|---|---|
| Title | `#8a1f1f` with red glow |
| Card background | `rgba(15,17,20,0.55)` (light) / `rgba(8,9,11,0.6)` (dark) — both near-black |
| Body text | `#d8d4cc` (theme-agnostic) |
| Choice button | `rgba(30,20,20,0.7)`, text `#d8d4cc`, border `rgba(140,30,30,0.5)` |
| Accent | `#8a1f1f` / `#6b1414` (blood red) |

### Non-story pages (single theme, no dark mode)
| Page | Text | Background |
|---|---|---|
| Profile | `#102a49` | light blue gradient, white translucent cards |
| About | `#16324f` | light blue gradient, white translucent cards |
| Login / Create Account / Password Reset | *(browser default — no custom styling exists)* |

---

## 4. Open items for the team to decide

1. Should Login/Create Account/Password Reset get real styling matching the rest of the site? (Currently zero custom CSS.)
2. Should these 3 pages, plus Profile and About, get dark mode support to match the rest of the site?
3. Separate ticket: make the dark/light toggle persist across page navigation (same pattern already used for mute/volume).
