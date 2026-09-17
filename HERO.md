# Hero section — build instructions

Replaces the existing hero only. Nothing else on the page changes: the canvas
background, the route, the work index, the contact section and the rail all stay
exactly as they are.

`hero-plotter.html` in this folder is a working build of the target. Open it in
a browser before writing anything.

## The idea

The headline acts out the sentence. Both lines are drafted as outlines by a
travelling nib; then ink floods only the first one and an extruded body builds
behind it. "Designs it." becomes a solid object. "Then ships it." stays on the
drawing board. The outline is not a style choice — it is the unbuilt half.

## Constraints

- The type is **real SVG text**, not HTML.
- No animation library. CSS keyframes, clip-path wipes, and one `requestAnimationFrame`.
- Animate `transform`, `opacity` and `filter` only.
- Tokens already in the project: `--paper:#EEF1F5`, `--mint:#5FD8A4`,
  `--cyan:#5FD3D8`, `--gold:#E9C58B`, `--ease:cubic-bezier(.16,1,.3,1)`.

## Build order

1. Markup and layout (§1, §2)
2. Legibility layers (§3) — stop and confirm the outline reads over the live canvas
3. Clip wipes and the nib (§4, §5)
4. The extrusion (§6)
5. Pointer-driven 3D (§7), then match the timeline (§10)

Read §13 before writing any React.

## The three things most likely to break it

1. **Missing `transform-box: fill-box`** on the wipe rects. The origin resolves
   against the SVG viewport instead of the rect and the wipe starts in the wrong
   place.
2. **Dropping `.outGlow`** as redundant. It is not decorative — it is what puts
   the stroke on light instead of fighting the background. Without it the
   outline washes out.
3. **`near` and `far` translating in the same direction.** The parallax vanishes
   and the whole thing reads flat even though the code technically works.

---
The headline acts out the sentence. Both lines are drafted as outlines by a
travelling nib; then ink floods only the first one and an extruded body builds
behind it. "Designs it." becomes a solid object. "Then ships it." stays on the
drawing board. The outline is not a style choice — it is the unbuilt half.

`reference/hero-plotter.html` is the working build. Open it before you start.

## 1 Markup

The type is **real SVG text**, not HTML. Each line is rendered two or three
times and revealed by clip rectangles.

```html
<section class="hero" id="hero">
  <div class="type" id="type">
    <div class="plate"></div>
    <div class="bloom"></div>

    <svg viewBox="0 0 1180 350" aria-label="Designs it. Then ships it.">
      <defs>
        <clipPath id="c1" clipPathUnits="userSpaceOnUse">
          <rect class="wipe w1" x="-20" y="0" width="1200" height="350"/></clipPath>
        <clipPath id="c2" clipPathUnits="userSpaceOnUse">
          <rect class="wipe w2" x="-20" y="0" width="1200" height="350"/></clipPath>
        <clipPath id="c3" clipPathUnits="userSpaceOnUse">
          <rect class="wipe w3" x="-20" y="0" width="1200" height="350"/></clipPath>
      </defs>

      <g id="far">                                   <!-- line 2, furthest back -->
        <text class="outGlow" clip-path="url(#c3)" x="0" y="300">Then ships it.</text>
        <text class="out2"    clip-path="url(#c3)" x="0" y="300">Then ships it.</text>
      </g>

      <g id="extrude" clip-path="url(#c2)"></g>       <!-- filled by JS -->

      <g id="near">                                   <!-- line 1, front face -->
        <text class="outGlow" clip-path="url(#c1)" x="0" y="134">Designs it.</text>
        <text class="out"     clip-path="url(#c1)" x="0" y="134">Designs it.</text>
        <text class="ink"     clip-path="url(#c2)" x="0" y="134">Designs it.</text>
      </g>
    </svg>

    <div class="pen"></div>
    <div class="glint"></div>
  </div>

  <p class="byline">Jay Harwani, product designer who writes the front end.</p>
  <div class="hem">
    <span class="live"><i></i>OPEN TO PRODUCT DESIGN ROLES</span>
    <span class="cue"><i></i>SCROLL</span>
  </div>
</section>
```

Paint order inside the SVG is deliberate: `far` → `extrude` → `near`. Do not
reorder; the extrusion has to sit behind the front face and in front of line 2.

The `<svg>` carries `aria-label` with the full sentence, so screen readers get
it once rather than reading four duplicated `<text>` nodes.

## 2 Layout

```css
.hero{position:relative;z-index:10;min-height:100svh;display:flex;
  flex-direction:column;justify-content:center;will-change:transform,opacity}

.type{position:relative;width:100%;max-width:1180px;
  perspective:1500px;transform-style:preserve-3d}
.type svg{display:block;width:100%;height:auto;overflow:visible;
  filter:drop-shadow(0 34px 90px rgba(0,0,0,.8))}
.type text{font-family:'Geist',sans-serif;font-weight:200;
  font-size:150px;letter-spacing:-7px}
```

Size comes from the viewBox scaling to the container — there is no `clamp()` on
the type. The SVG is fluid, so the headline scales with the viewport for free.

**Wait for fonts.** SVG text does not reflow gracefully on a late font swap.
Gate the whole opening on `document.fonts.ready` before adding the class that
starts the animations, or the wipes will run against fallback metrics.

## 3 Legibility layers

Three things make the outline readable against a live background. All are
required; dropping any one of them is what made the earlier version look washed
out.

```css
/* 1 · darken the field directly behind the type */
.plate{position:absolute;left:-8%;top:-6%;width:86%;height:112%;z-index:-2;
  pointer-events:none;filter:blur(24px);
  background:radial-gradient(closest-side,rgba(2,4,8,.85),rgba(2,4,8,.5) 55%,transparent 78%)}

/* 2 · a warm bloom that fades in late and breathes */
.bloom{position:absolute;left:-6%;top:4%;width:66%;height:84%;z-index:-1;
  pointer-events:none;filter:blur(30px);opacity:0;
  background:radial-gradient(closest-side,rgba(233,197,139,.18),
             rgba(95,211,216,.08) 52%,transparent 74%);
  animation:bloomIn 2.4s var(--ease) 2.9s forwards,
            breathe 8s ease-in-out 5.4s infinite}
@keyframes bloomIn{to{opacity:1}}
@keyframes breathe{0%,100%{opacity:.72;transform:scale(1)}
                   50%{opacity:1;transform:scale(1.06)}}

/* 3 · stroke weights that actually read */
.out    {fill:rgba(238,241,245,.10); stroke:rgba(238,241,245,.88);
         stroke-width:2.8;paint-order:stroke fill}
.out2   {fill:rgba(238,241,245,.085);stroke:rgba(238,241,245,.80);
         stroke-width:2.8;paint-order:stroke fill}
.outGlow{fill:none;stroke:rgba(95,216,164,.55);stroke-width:5;filter:blur(7px)}
.ink    {fill:var(--paper);stroke:none}
```

`paint-order:stroke fill` puts the stroke underneath the fill so the letterform
does not thin. `.outGlow` is a blurred duplicate sitting behind each outline —
the outline reads as sitting on light rather than fighting the background.

Do not drop `stroke-width` below 2.5 or `stroke` opacity below 0.75.

## 4 The draw — clip wipes

Every reveal is a clip rectangle scaling on X. Transform only, so it is
GPU-composited and costs nothing.

```css
.wipe{transform:scaleX(0);transform-origin:left center;transform-box:fill-box}
.w1{animation:wipe 2.4s var(--ease) .50s forwards}   /* line 1 outline draws */
.w3{animation:wipe 2.7s var(--ease) 1.00s forwards}  /* line 2 outline draws */
.w2{animation:wipe 1.9s var(--ease) 2.80s forwards}  /* line 1 floods with ink */
@keyframes wipe{to{transform:scaleX(1)}}
```

`transform-box:fill-box` is required — without it the origin resolves against
the SVG viewport, not the rect, and the wipe starts in the wrong place.

The clip rects extend to `x="-20" width="1200"` so the wipe clears the glyph
overhang at both ends.

## 5 The nib

A gradient bar that travels with the drawing edge and sells it as plotting.

```css
.pen{position:absolute;top:-2%;bottom:10%;width:2.5px;left:0;pointer-events:none;
  background:linear-gradient(to bottom,transparent,var(--mint),var(--cyan),transparent);
  box-shadow:0 0 26px rgba(95,216,164,.9),0 0 70px rgba(95,211,216,.5);
  opacity:0;animation:pen 3.4s var(--ease) .5s forwards}
@keyframes pen{0%{opacity:0;transform:translateX(0)}6%{opacity:1}
               88%{opacity:1}100%{opacity:0;transform:translateX(97%)}}
```

It runs on the same easing and start time as `.w1`, so it stays on the edge of
the line being drawn.

## 6 The extrusion

Sixteen stacked copies of the first line behind its front face, each darker
than the last. This is what makes it read as a solid object rather than flat
type. Built in JS, not markup.

```js
const STEPS = 16;
const ex = document.getElementById('extrude');
const NS = 'http://www.w3.org/2000/svg';
const layers = [];

for (let i = STEPS; i >= 1; i--) {                 // far layer first
  const t = document.createElementNS(NS, 'text');
  t.setAttribute('x', 0);
  t.setAttribute('y', 134);
  t.style.fill = `rgb(${10 + i*1.1 | 0},${16 + i*1.4 | 0},${23 + i*1.8 | 0})`;
  t.textContent = 'Designs it.';
  ex.appendChild(t);
  layers.push({ el: t, d: i });
}
```

```css
#extrude{opacity:0;animation:fade 1.6s var(--ease) 3.6s forwards}
```

Layers are appended far-to-near so the nearest sits on top. Each is fractionally
lighter than the one behind it, which gives the body a graded side face rather
than a flat slab.

## 7 Pointer-driven 3D

Three depth planes that separate as the pointer moves. One rAF loop, all values
lerped at 0.05.

```js
const lerp = (a,b,k) => a + (b-a)*k;
let tx=0, ty=0, ax=0, ay=0;

addEventListener('pointermove', e => {
  tx = e.clientX / innerWidth  - .5;
  ty = e.clientY / innerHeight - .5;
}, { passive:true });

(function tilt(){
  ax = lerp(ax, tx, .05);
  ay = lerp(ay, ty, .05);

  // the whole block rotates
  type.style.transform = `rotateY(${ax*9}deg) rotateX(${-ay*6}deg)`;

  // the two lines sit at different depths, so they separate as you move
  near.setAttribute('transform', `translate(${ax*26},${ay*17})`);
  far .setAttribute('transform', `translate(${-ax*20},${-ay*13})`);

  // the extruded body always throws away from the light
  const dx = -ax*2.6 - 1.1;
  const dy =  ay*2.2 + 1.6;
  layers.forEach(k => {
    k.el.setAttribute('transform',
      `translate(${ax*26 + k.d*dx},${ay*17 + k.d*dy})`);
  });

  requestAnimationFrame(tilt);
})();
```

`far` moves **against** the rotation while `near` moves with it. That opposition
is what produces the parallax; matching their signs flattens the whole effect.

The extrusion offset tracks the pointer, so moving left throws the body right as
though you are walking around a lit solid. This is the detail that sells the
dimension — do not replace it with a fixed offset.

Cancel this rAF on unmount.

## 8 One glint, then stillness

```css
.glint{position:absolute;inset:-14% -32%;pointer-events:none;
  mix-blend-mode:overlay;transform:translateX(-120%);
  background:linear-gradient(105deg,transparent 41%,
             rgba(255,255,255,.32) 50%,transparent 59%);
  animation:glint 2.1s var(--ease) 4.6s both}
@keyframes glint{to{transform:translateX(120%)}}
```

## 9 Supporting copy

```css
.byline{margin-top:42px;font-size:clamp(14px,1.4vw,16.5px);
  color:rgba(238,241,245,.52);max-width:44ch;
  animation:fade 1.1s var(--ease) 4.3s both}
@keyframes fade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}

.hem{position:absolute;left:0;right:0;bottom:clamp(26px,5vh,44px);
  display:flex;justify-content:space-between;gap:20px;
  font-size:10.5px;letter-spacing:.11em;color:rgba(238,241,245,.36);
  animation:fade 1.1s var(--ease) 4.6s both}
.live{display:flex;align-items:center;gap:9px}
.live i{width:5px;height:5px;border-radius:50%;background:var(--mint);
  box-shadow:0 0 12px var(--mint);animation:pulse 2.6s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:.35;transform:scale(.8)}
                 50%{opacity:1;transform:scale(1)}}
.cue{display:flex;align-items:center;gap:10px}
.cue i{display:block;width:1px;height:30px;
  background:linear-gradient(to bottom,rgba(238,241,245,.36),transparent);
  animation:trickle 2.6s ease-in-out infinite}
@keyframes trickle{0%,100%{opacity:.3;transform:translateY(-4px)}
                   50%{opacity:1;transform:translateY(4px)}}
```

## 10 Full opening timeline

| t | Event | Duration |
|---|---|---|
| 0.50s | nib appears and begins travelling | 3.4s |
| 0.50s | line 1 outline draws | 2.4s |
| 1.00s | line 2 outline draws | 2.7s |
| 2.80s | ink floods line 1 | 1.9s |
| 2.90s | bloom fades in behind the type | 2.4s |
| 3.60s | extruded body fades in | 1.6s |
| 4.30s | byline fades up | 1.1s |
| 4.60s | glint passes once | 2.1s |
| 4.60s | hemline fades up | 1.1s |
| 5.40s | bloom begins its 8s breathing loop | ∞ |

Total ≈ 5.5s. This is deliberately slow — it is drafting, and rushing it loses
the idea. If you must shorten, cut the two outline wipes to 1.8s and 2.0s and
pull everything after 2.8s forward by 600ms. Do not drop below 4s.

## 11 Hero exit

Written from the field's smoothed scroll value every frame:

```js
const p = Math.min(smooth / innerHeight, 1);
hero.style.transform = `translate3d(0,${smooth * 0.2}px,0) scale(${1 - p * 0.06})`;
hero.style.opacity   = String(1 - p * 0.85);
hero.style.filter    = `blur(${p * 7}px)`;
```

## 12 Reduced motion

```css
@media (prefers-reduced-motion:reduce){
  .wipe{transform:scaleX(1);animation:none}
  .pen,.glint,.bloom{display:none}
  #extrude{opacity:1;animation:none}
  .byline,.hem{animation:none}
}
```

In JS: still build the extrusion layers and still apply their static offsets, but
never start the tilt loop. The headline ends up in its finished state
immediately, fully readable.

## 13 React notes

- Build the extrusion in a `useEffect` with `[]` deps, and clear
  `ex.innerHTML` first so a re-render cannot stack a second set of layers.
- Keep one rAF for the tilt and cancel it in the cleanup.
- Gate the animation start on `document.fonts.ready` inside the same effect.
- Do not put the extrusion layers in JSX. Sixteen duplicated `<text>` nodes in
  the tree make the component unreadable and React will diff them on every
  render for no reason.
