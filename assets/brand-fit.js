(function () {
  var CAP = 1.6;

  function track(el, natural, target) {
    if (natural >= target - 0.5) return;
    var chars = el.textContent.trim().length;
    if (chars < 2) return;
    var spacing = (target - natural) / (chars - 1);
    el.style.letterSpacing = spacing + "px";
    el.style.marginRight = -spacing + "px";
  }

  function fitOne(name) {
    var top = name.querySelector(".brand-line--top");
    var bottom = name.querySelector(".brand-line--bottom");
    if (!top || !bottom) return;

    var brand = name.closest(".brand");
    var mark = brand ? brand.querySelector(".brand-mark") : null;
    var markH = mark ? mark.getBoundingClientRect().height : 0;

    top.style.fontSize = "1em";
    bottom.style.fontSize = "1em";
    top.style.letterSpacing = "0";
    bottom.style.letterSpacing = "0";
    top.style.marginRight = "0";
    bottom.style.marginRight = "0";

    var wt = top.getBoundingClientRect().width;
    var wb = bottom.getBoundingClientRect().width;
    var target = Math.max(wt, wb);
    if (!target) return;

    var ft = wt ? Math.min(target / wt, CAP) : 1;
    var fb = wb ? Math.min(target / wb, CAP) : 1;

    top.style.fontSize = ft + "em";
    bottom.style.fontSize = fb + "em";

    // Keep the whole two-line block inside the height of the symbol square.
    if (markH) {
      for (var i = 0; i < 4; i++) {
        var blockH = name.getBoundingClientRect().height;
        if (blockH <= markH + 0.5) break;
        var k = markH / blockH;
        ft *= k;
        fb *= k;
        top.style.fontSize = ft + "em";
        bottom.style.fontSize = fb + "em";
      }
    }

    wt = top.getBoundingClientRect().width;
    wb = bottom.getBoundingClientRect().width;
    target = Math.max(wt, wb);
    track(top, wt, target);
    track(bottom, wb, target);
  }

  function fit() {
    var names = document.querySelectorAll(".brand-name");
    for (var i = 0; i < names.length; i++) fitOne(names[i]);
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fit);
  }
  window.addEventListener("load", fit);
  window.addEventListener("resize", fit);
})();
