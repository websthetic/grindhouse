/*
 * Scroll reveal - fades and lifts content in as it scrolls into view.
 * Elements are tagged here (no extra markup needed); the styles live in root.less under "Scroll Reveal".
 *   data-reveal="up"   - fade in and rise
 *   data-reveal="clip" - photo wipes open from the bottom
 *   data-reveal="lines" - each .cs-line of a heading rises out of a mask
 * Items that share a parent are staggered. Skipped entirely for visitors who prefer reduced motion.
 */
(function () {
	if (!("IntersectionObserver" in window)) return;
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

	const TARGETS = [
		// Section headings - each line rises out of a mask (the hero title animates on its own)
		["main section:not(#hero-143) .cs-title:has(.cs-line), #cs-footer-275 .cs-cta-title", "lines"],
		// Brand statement
		["#brand-statement .cs-intro > *", "up"],
		["#brand-statement .cs-photo", "clip"],
		["#brand-statement .cs-feature", "up"],
		// Training
		["#training .cs-header > *", "up"],
		["#training .cs-card-group > .cs-item", "up"],
		// Experience
		["#experience .cs-header .cs-title", "up"],
		["#experience .cs-intro", "up"],
		["#experience .cs-steps > .cs-item", "up"],
		// Trainers
		["#trainers .cs-header > *", "up"],
		["#trainers .cs-card-group > .cs-item", "up"],
		// Stories
		["#featured-story .cs-viewport", "up"],
		["#featured-story .cs-controls", "up"],
		// Testimonials (the scrolling row reveals as one piece)
		["#testimonials .cs-header > *", "up"],
		["#testimonials .cs-card-group", "up"],
		["#testimonials .cs-arrows", "up"],
		// Instagram
		["#instagram .cs-header > *", "up"],
		["#instagram .cs-tile", "clip"],
		// Memberships
		["#memberships .cs-header > *", "up"],
		["#memberships .cs-plan", "up"],
		// FAQ
		["#faq .cs-content > *", "up"],
		["#faq .cs-faq-group > *", "up"],
		// Footer CTA
		["#cs-footer-275 .cs-cta > *", "up"],
	];

	const STAGGER_MS = 90;
	const MAX_STAGGER = 6;

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				entry.target.classList.add("is-revealed");
				observer.unobserve(entry.target);
			});
		},
		{ rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
	);

	TARGETS.forEach(([selector, type]) => {
		const counts = new Map();
		document.querySelectorAll(selector).forEach((el) => {
			if (el.hasAttribute("data-reveal")) return;
			// stagger siblings that share a parent
			const index = counts.get(el.parentElement) || 0;
			counts.set(el.parentElement, index + 1);
			el.setAttribute("data-reveal", type);
			el.style.setProperty("--reveal-delay", `${Math.min(index, MAX_STAGGER) * STAGGER_MS}ms`);
			observer.observe(el);
		});
	});

	// clear the will-change hint once each animation has finished
	document.addEventListener("transitionend", (event) => {
		const target = event.target;
		if (!target.matches) return;
		let el = null;
		if (target.matches('[data-reveal="up"]') && event.propertyName === "translate") {
			// "up" items finish on their own rise
			el = target;
		} else if (target.matches('[data-reveal="lines"] .cs-line:last-child') && event.propertyName === "translate") {
			// headings finish when their last line lands
			el = target.closest("[data-reveal]");
		} else if (event.propertyName === "clip-path" && target.closest('[data-reveal="clip"]')) {
			// photos finish on their image's wipe
			el = target.closest("[data-reveal]");
		}
		if (el && el.matches(".is-revealed")) el.classList.add("is-settled");
	});
})();
