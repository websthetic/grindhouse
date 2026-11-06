// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIALS
// The cards sit in a horizontally scrolling row (two in view on desktop).
// The arrows scroll it by one card and disable themselves at either end.
// ─────────────────────────────────────────────────────────────────────────────

(function () {
	const section = document.getElementById("testimonials");
	if (!section) return;

	const row = section.querySelector(".cs-card-group");
	const prev = section.querySelector(".cs-prev");
	const next = section.querySelector(".cs-next");
	if (!row || !prev || !next) return;

	const step = () => {
		const card = row.querySelector(".cs-item");
		const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
		return card ? card.getBoundingClientRect().width + gap : row.clientWidth;
	};

	const update = () => {
		const max = row.scrollWidth - row.clientWidth - 2;
		prev.disabled = row.scrollLeft <= 2;
		next.disabled = row.scrollLeft >= max;
	};

	prev.addEventListener("click", () => row.scrollBy({ left: -step(), behavior: "smooth" }));
	next.addEventListener("click", () => row.scrollBy({ left: step(), behavior: "smooth" }));
	row.addEventListener("scroll", update, { passive: true });
	window.addEventListener("resize", update);
	update();
})();
