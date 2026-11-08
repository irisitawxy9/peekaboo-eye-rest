// Peekaboo Eye Rest — slides the card into a corner of the current page.
// The card itself is an extension page in an iframe, so websites can't
// restyle it or block the GIF from loading.

(() => {
  if (window.__peekabooShow) return; // already loaded in this tab

  const HOST_ID = "peekaboo-eye-rest-host";
  const W = 344, H = 440; // card 320 wide + room for its shadow

  function close() {
    const host = document.getElementById(HOST_ID);
    if (!host) return;
    host.style.transform = host.dataset.hidden;
    host.style.opacity = "0";
    setTimeout(() => host.remove(), 350);
  }

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg?.type === "peekaboo-close") close();
  });

  window.__peekabooShow = (corner = "bottom-right") => {
    document.getElementById(HOST_ID)?.remove();
    const [vert, horiz] = corner.split("-");
    const hidden = `translateY(${vert === "bottom" ? "110%" : "-110%"})`;

    const host = document.createElement("div");
    host.id = HOST_ID;
    host.dataset.hidden = hidden;
    host.style.cssText = [
      "all: initial", "position: fixed", "z-index: 2147483647",
      `${vert}: 8px`, `${horiz}: 8px`, `width: ${W}px`, `height: ${H}px`,
      `transform: ${hidden}`, "opacity: 0",
      "transition: transform .5s cubic-bezier(.2,1.3,.4,1), opacity .3s ease"
    ].join(";");

    const frame = document.createElement("iframe");
    frame.src = chrome.runtime.getURL(`card.html?v=${vert}`);
    frame.title = "Eye rest reminder";
    frame.setAttribute("allowtransparency", "true");
    frame.style.cssText = "all: initial; width: 100%; height: 100%; border: 0; background: transparent; color-scheme: normal;";

    host.appendChild(frame);
    document.documentElement.appendChild(host);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      host.style.transform = "none";
      host.style.opacity = "1";
    }));
  };
})();
