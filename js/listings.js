/* ============================================================
   LISTINGS ENGINE
   ------------------------------------------------------------
   Right now this reads from /data/listings.json (placeholder
   data marked "SAMPLE"). Once you have DDF/RESO Web API or RETS
   credentials from your board/brokerage, swap the fetch below
   for a real feed. Two common paths:

   1) SERVER-SIDE PULL (recommended): a small scheduled script
      (Node/Python) authenticates to the DDF feed, pulls your
      active listings, and writes them into this same
      data/listings.json shape on a timer (e.g. every 30 min).
      This file's rendering code below doesn't need to change.

   2) CLIENT-SIDE PULL: if your feed provider (e.g. Repliers,
      Realtyna, Spark API, etc.) offers a public read endpoint,
      replace the fetch('../data/listings.json') call below with
      a fetch() to that endpoint, then map their response fields
      onto the same {status, price, address, city, beds, baths,
      sqft, mlsNumber, url} shape used here.

   Either way, keep the field names in renderListingCard() the
   same so you don't have to touch the HTML/CSS.
   ============================================================ */

async function fetchListings(dataPath = "/api/listings") {
  try {
    const response = await fetch(dataPath, { headers: { accept: "application/json" } });
    if (!response.ok) throw new Error(`Listings request failed (${response.status})`);
    return await response.json();
  } catch (error) {
    if (dataPath !== "data/listings.json") {
      console.warn("Live DDF feed unavailable, using local fallback data.", error);
      const fallback = await fetch("data/listings.json");
      if (!fallback.ok) throw error;
      return await fallback.json();
    }
    throw error;
  }
}

async function loadListings(targetSelector, options = {}) {
  const { limit = null, dataPath = "/api/listings" } = options;
  const container = document.querySelector(targetSelector);
  if (!container) return;

  try {
    const data = await fetchListings(dataPath);
    let listings = data.listings || [];
    if (limit) listings = listings.slice(0, limit);

    container.innerHTML = listings.map(renderListingCard).join("");
  } catch (err) {
    container.innerHTML = `<p style="color:#6B6B6B;font-size:14px;">Listings couldn't be loaded right now.</p>`;
    console.error("Listings load error:", err);
  }
}

function renderListingCard(listing) {
  const image = listing.image
    ? `<img src="${escapeHtml(listing.image)}" alt="${escapeHtml(`${listing.address}, ${listing.city}`)}" loading="lazy">`
    : `<div class="photo-placeholder">Photo coming soon</div>`;
  return `
    <div class="listing-card">
      <div class="photo">
        <span class="tag">${escapeHtml(listing.status)}</span>
        ${image}
      </div>
      <div class="body">
        <div class="price">${escapeHtml(listing.price)}</div>
        <div class="addr">${escapeHtml(listing.address)}, ${escapeHtml(listing.city)}</div>
        <div class="meta">
          <span>${escapeHtml(listing.beds)} bd</span>
          <span>${escapeHtml(listing.baths)} ba</span>
          <span>${escapeHtml(listing.sqft)} sqft</span>
        </div>
        ${listing.mlsNumber ? `<div class="meta">MLS® ${escapeHtml(listing.mlsNumber)}</div>` : ""}
        ${listing.agent ? `<div class="meta" style="margin-top:4px;">Listed by ${escapeHtml(listing.agent)}</div>` : ""}
        <div class="listing-footer">
          <div class="cta"><a href="${escapeHtml(listing.url)}" target="_blank" rel="noopener">View details &rarr;</a></div>
          <a class="realtor-powered" href="${escapeHtml(listing.url || "https://www.realtor.ca/en")}" target="_blank" rel="noopener" aria-label="Powered by REALTOR.ca">
            <img width="125" src="https://www.realtor.ca/images/en-ca/powered_by_realtor.svg" alt="Powered by REALTOR.ca">
          </a>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* Mobile nav toggle, shared across pages */
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
  }
});
