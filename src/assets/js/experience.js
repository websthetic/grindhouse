// ─────────────────────────────────────────────────────────────────────────────
// EXPERIENCE STEPS
// One step is open at a time. Hovering a row opens it (mouse), tapping a row
// opens it (touch), and tabbing to its title opens it (keyboard).
// Every open row is the same height, so swapping rows on hover keeps the
// cursor inside the row it is over.
// ─────────────────────────────────────────────────────────────────────────────

(function () {
	const section = document.getElementById("experience");
	if (!section) return;

	const items = Array.from(section.querySelectorAll(".cs-item"));
	if (!items.length) return;

	const open = (item) => {
		items.forEach((el) => {
			const active = el === item;
			el.classList.toggle("is-active", active);
			const toggle = el.querySelector(".cs-toggle");
			if (toggle) toggle.setAttribute("aria-expanded", active ? "true" : "false");
		});
	};

	const canHover = window.matchMedia("(hover: hover)").matches;
	let hoverTimer;

	items.forEach((item) => {
		if (canHover) {
			// short delay so sweeping the mouse across rows doesn't flicker through every one
			item.addEventListener("mouseenter", () => {
				clearTimeout(hoverTimer);
				hoverTimer = setTimeout(() => open(item), 60);
			});
			item.addEventListener("mouseleave", () => clearTimeout(hoverTimer));
		}
		item.addEventListener("click", () => open(item));
		const toggle = item.querySelector(".cs-toggle");
		if (toggle) toggle.addEventListener("focus", () => open(item));
	});
})();
