/*
 * Scroll drift - every element with a data-drift attribute gets a --drift custom property that runs
 * from -1 (element entering at the bottom of the screen) through 0 (centred) to 1 (leaving at the top).
 * What actually moves, and by how much, is set per element in the stylesheets ("Scroll Drift" in
 * root.less and each section in local.less / global.less), so the same script drives card offsets,
 * photo parallax and the big outlined background words.
 * Skipped for visitors who prefer reduced motion, so everything simply sits still.
 */
(function () {
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

	const elements = Array.from(document.querySelectorAll("[data-drift]"));
	if (!elements.length) return;

	let ticking = false;

	function update() {
		ticking = false;
		const viewport = window.innerHeight;

		elements.forEach((el) => {
			const rect = el.getBoundingClientRect();
			// only work on elements on or near the screen
			if (rect.bottom < -viewport || rect.top > viewport * 2) return;
			const offset = rect.top + rect.height / 2 - viewport / 2;
			const range = (rect.height + viewport) / 2;
			const drift = Math.min(Math.max(-offset / range, -1), 1);
			el.style.setProperty("--drift", drift.toFixed(4));
		});
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
