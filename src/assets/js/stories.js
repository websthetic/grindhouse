// ─────────────────────────────────────────────────────────────────────────────
// STORY SLIDER
// Slides through the featured stories every 5 seconds. Each story has a
// progress segment that fills over that time (a CSS animation); when it
// finishes the next story slides in. Pauses on keyboard focus and
// while the tab is hidden. No auto-advance for reduced-motion users.
// ─────────────────────────────────────────────────────────────────────────────

(function () {
	const section = document.getElementById("featured-story");
	if (!section) return;

	const track = section.querySelector(".cs-track");
	const slides = Array.from(section.querySelectorAll(".cs-slide"));
	const segments = Array.from(section.querySelectorAll(".cs-segment"));
	const prev = section.querySelector(".cs-prev");
	const next = section.querySelector(".cs-next");
	if (!track || slides.length < 2) return;

	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	let current = 0;

	const goTo = (index) => {
		current = (index + slides.length) % slides.length;
		// one slide width plus the gap between slides (set in CSS as --slide-gap)
		track.style.transform = `translate3d(calc(${-current} * (100% + var(--slide-gap, 0px))), 0, 0)`;

		slides.forEach((slide, i) => {
			const active = i === current;
			slide.inert = !active;
			slide.setAttribute("aria-hidden", active ? "false" : "true");
		});

		segments.forEach((segment, i) => {
			segment.classList.toggle("is-done", i < current);
			segment.classList.remove("is-active");
			segment.setAttribute("aria-current", i === current ? "true" : "false");
		});

		// restart the fill animation on the active segment
		const active = segments[current];
		if (active) {
			void active.offsetWidth;
			active.classList.add("is-active");
		}
	};

	// when the active segment finishes filling, move on
	segments.forEach((segment, i) => {
		const fill = segment.querySelector(".cs-fill");
		if (fill) {
			fill.addEventListener("animationend", () => {
				if (i === current) goTo(current + 1);
			});
		}
		segment.addEventListener("click", () => goTo(i));
	});

	if (prev) prev.addEventListener("click", () => goTo(current - 1));
	if (next) next.addEventListener("click", () => goTo(current + 1));

	// pause while keyboard focus is inside the slider, or the tab is hidden
	const setPaused = () => {
		// :focus-visible = keyboard focus only, so mouse clicks on the arrows / segments don't pause it
		const paused = reduceMotion || !!section.querySelector(":focus-visible") || document.hidden;
		section.classList.toggle("is-paused", paused);
	};
	section.addEventListener("focusin", setPaused);
	section.addEventListener("focusout", () => setTimeout(setPaused, 0));
	document.addEventListener("visibilitychange", setPaused);

	if (reduceMotion) section.classList.add("is-static");
	section.classList.add("is-ready");
	goTo(0);
	setPaused();
})();
