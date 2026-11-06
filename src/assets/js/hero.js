/*
 * Hero scroll - while the hero's tall scroll track passes, the pinned stage plays out:
 *   1. the headline and buttons fade away
 *   2. the full-screen video shrinks into a portrait card on the paper background
 *   3. the intro copy appears beside the card, one paragraph after the other
 * Then the stage scrolls away and the brand statement follows on the same background,
 * its photos drifting in opposite directions as it passes.
 *
 * Progress is written to CSS custom properties - on #hero-143 (--progress, --fade, --shrink, --lead,
 * --follow) and on #brand-statement (--drift); all the movement is in critical.less / local.less.
 * Visitors who prefer reduced motion keep the plain full-screen hero and still photos.
 */
(function () {
	const hero = document.getElementById("hero-143");
	if (!hero) return;
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

	const statement = document.getElementById("brand-statement");

	// [start, end] of each hero phase, as a share of the scroll track (0 - 1)
	const FADE = [0, 0.2];
	const SHRINK = [0.05, 0.6];
	const LEAD = [0.45, 0.68];
	const FOLLOW = [0.58, 0.8];

	const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
	const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
	const phase = (progress, [start, end]) => easeInOut(clamp((progress - start) / (end - start)));

	hero.classList.add("cs-scroll-hero");

	function updateHero() {
		const rect = hero.getBoundingClientRect();
		const track = rect.height - window.innerHeight;
		const progress = track > 0 ? clamp(-rect.top / track) : 0;
		const fade = phase(progress, FADE);

		hero.style.setProperty("--progress", progress.toFixed(4));
		hero.style.setProperty("--fade", fade.toFixed(4));
		hero.style.setProperty("--shrink", phase(progress, SHRINK).toFixed(4));
		hero.style.setProperty("--lead", phase(progress, LEAD).toFixed(4));
		hero.style.setProperty("--follow", phase(progress, FOLLOW).toFixed(4));
		// headline buttons stop being clickable once mostly gone
		hero.classList.toggle("cs-faded", fade > 0.9);
	}

	// --drift runs from -1 (section entering at the bottom of the screen) through 0 (centred)
	// to 1 (leaving at the top)
	function updateStatement() {
		if (!statement) return;
		const rect = statement.getBoundingClientRect();
		const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
		const range = (rect.height + window.innerHeight) / 2;
		statement.style.setProperty("--drift", clamp(-offset / range, -1, 1).toFixed(4));
	}

	let ticking = false;

	function update() {
		ticking = false;
		updateHero();
		updateStatement();
	}

	function requestUpdate() {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(update);
	}

	update();
	window.addEventListener("scroll", requestUpdate, { passive: true });
	window.addEventListener("resize", requestUpdate);
})();
