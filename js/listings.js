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

async function loadListings(targetSelector, options = {}) {
  const { limit = null, dataPath = "data/listings.json" } = options;
  const container = document.querySelector(targetSelector);
  if (!container) return;

  try {
    const res = await fetch(dataPath);
    const data = await res.json();
    let listings = data.listings || [];
    if (limit) listings = listings.slice(0, limit);

    container.innerHTML = listings.map(renderListingCard).join("");
  } catch (err) {
    container.innerHTML = `<p style="color:#6B6B6B;font-size:14px;">Listings couldn't be loaded right now.</p>`;
    console.error("Listings load error:", err);
  }
}

function renderListingCard(listing) {
  return `
    <div class="listing-card">
      <div class="photo">
        <span class="tag">${listing.status}</span>
        PHOTO PLACEHOLDER
      </div>
      <div class="body">
        <div class="price">${listing.price}</div>
        <div class="addr">${listing.address}, ${listing.city}</div>
        <div class="meta">
          <span>${listing.beds} bd</span>
          <span>${listing.baths} ba</span>
          <span>${listing.sqft} sqft</span>
        </div>
        <div class="cta"><a href="${listing.url}">View details &rarr;</a></div>
      </div>
    </div>
  `;
}

/* Mobile nav toggle, shared across pages */
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
  }
});
