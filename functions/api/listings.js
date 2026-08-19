const TOKEN_URL = "https://identity.crea.ca/connect/token";
const PROPERTY_URL = "https://ddfapi.realtor.ca/odata/v1/Property";

const json = (body, status = 200, extraHeaders = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": status === 200 ? "public, max-age=300, s-maxage=900" : "no-store",
      ...extraHeaders,
    },
  });

const first = (...values) => values.find((value) => value !== undefined && value !== null && value !== "");

const getMediaUrl = (media = []) => {
  const items = Array.isArray(media) ? media : [];
  const preferred = items.find((item) =>
    /large|photo|image/i.test(String(first(item.MediaCategory, item.MediaType, item.MediaObjectID, "")))
  );
  const selected = preferred || items[0] || {};
  return first(selected.MediaURL, selected.MediaUrl, selected.Uri, selected.URL, selected.Url, null);
};

const formatPrice = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount)
    ? new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(amount)
    : "Contact for price";
};

const normalizeUrl = (value, fallback = "https://www.realtor.ca/") => {
  const url = String(first(value, fallback));
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url.replace(/^\/+/, "")}`;
};

const mapProperty = (property) => ({
  id: String(first(property.ListingKey, property.ListingId, property.ListingID, "")),
  listingKey: String(first(property.ListingKey, "")),
  status: first(property.StandardStatus, property.MlsStatus, "Active"),
  price: formatPrice(first(property.ListPrice, property.OriginalListPrice)),
  address: first(property.UnparsedAddress, property.StreetAddress, property.PublicRemarks && "Address available on request", "Address available on request"),
  city: [first(property.City, property.CityRegion, ""), first(property.StateOrProvince, "ON")].filter(Boolean).join(", "),
  beds: first(property.BedroomsTotal, property.BedroomsAboveGrade, "—"),
  baths: first(property.BathroomsTotalInteger, property.BathroomsTotal, "—"),
  sqft: first(property.LivingArea, property.BuildingAreaTotal, "—"),
  mlsNumber: String(first(property.ListingId, property.ListingID, property.ListingKey, "")),
  image: getMediaUrl(property.Media),
  url: normalizeUrl(first(property.ListingURL, property.ListingUrl)),
  agent: first(property.ListAgentFullName, property.ListAgentFullName2, null),
});

async function getAccessToken(env) {
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: env.DDF_CLIENT_ID,
    client_secret: env.DDF_CLIENT_SECRET,
    scope: "DDFApi_Read",
  });

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) throw new Error(`DDF authentication failed (${response.status})`);
  const result = await response.json();
  if (!result.access_token) throw new Error("DDF authentication returned no access token");
  return result.access_token;
}

export async function handleListingsRequest(env) {
  if (!env.DDF_CLIENT_ID || !env.DDF_CLIENT_SECRET) {
    return json({ error: "DDF credentials are not configured" }, 503);
  }

  try {
    const token = await getAccessToken(env);
    const params = new URLSearchParams({
      "$top": "100",
      "$orderby": "ModificationTimestamp desc",
    });
    const response = await fetch(`${PROPERTY_URL}?${params}`, {
      headers: { authorization: `Bearer ${token}`, accept: "application/json" },
    });

    if (!response.ok) throw new Error(`DDF property request failed (${response.status})`);
    const payload = await response.json();
    const listings = (payload.value || []).map(mapProperty).filter((listing) => listing.id);
    return json({ listings, updatedAt: new Date().toISOString(), source: "REALTOR.ca DDF" });
  } catch (error) {
    console.error("DDF listings error", error);
    return json({ error: "Live listings are temporarily unavailable" }, 502);
  }
}

export async function onRequestGet({ env }) {
  return handleListingsRequest(env);
}
