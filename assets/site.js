/* ==========================================================================
   22 Remote Patient Monitoring — progressive enhancement for the masthead.

   Two jobs, both optional: flag the header once the page has scrolled so it
   can draw its layer edge, and collapse the navigation behind a button on
   narrow screens. Everything here degrades cleanly — without this file the
   header is still sticky and the nav is still visible and reachable, which
   is why the collapse is gated on the `js` class rather than applied by
   default in CSS.
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  var header = document.querySelector(".site-header");
  if (!header) return;

  /* ---- layer edge once scrolled ---------------------------------------
     A passive scroll listener doing one scrollY read and a classList.toggle,
     which is a no-op when the state has not changed. Deliberately not wrapped
     in requestAnimationFrame: rAF is paused in background tabs, and this is
     cheap enough that the throttle bought nothing. */
  function updateStuck() {
    header.classList.toggle("is-stuck", window.scrollY > 2);
  }

  window.addEventListener("scroll", updateStuck, { passive: true });
  updateStuck(); // reflect a restored scroll position on load

  /* ---- mobile navigation disclosure ----------------------------------- */
  var toggle = header.querySelector(".nav-toggle");
  var nav = header.querySelector(".site-nav");
  if (!toggle || !nav) return;

  var MOBILE = "(max-width: 39.99em)";

  function setOpen(open) {
    nav.setAttribute("data-open", open ? "true" : "false");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  setOpen(false);

  toggle.addEventListener("click", function () {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Escape closes and returns focus to the button.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });

  // Following a link should not leave the panel open behind the new page.
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setOpen(false);
  });

  // Widening past the breakpoint reveals the nav via CSS; make sure the
  // button's state does not survive as a stale "expanded".
  if (window.matchMedia) {
    var mq = window.matchMedia(MOBILE);
    var onChange = function (e) {
      if (!e.matches) setOpen(false);
    };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }
})();
