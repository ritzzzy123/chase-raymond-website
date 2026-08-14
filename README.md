# Chase Raymond, Website

Static site, no build step, no server required to run it. Brand system matches `Chase-Raymond-Brand-Guidelines.html`.

## File structure
```
index.html               Home
listings.html            Full listings grid with filters
buying.html               Buyer tips, process outline, buyer's guide download
selling.html               Seller tips, process outline, seller's guide download
about.html                Bio page
contact.html               Contact form + info
css/style.css              Shared brand styles
js/listings.js             Renders listing cards from data/listings.json + office-listings.json
js/animations.js           Scroll-in animations (fade/slide as you scroll)
js/lead-form.js            Handles the buyer's/seller's guide email capture + download
data/listings.json         Your listings data (currently SAMPLE/placeholder)
data/office-listings.json  Office listings data (currently SAMPLE/placeholder)
assets/                    Logo, photos, guide downloads
```

## 1. Before you go live, swap in real assets
- **Logo:** save `kw-logo-white.png` (the file Claude sent you in chat) into the `/assets/` folder in this project, that exact filename, that exact folder. It's currently being color-inverted via CSS to show black on the white nav bar; if your office has a proper black or red KW logo file, use that instead and remove the `filter:` style on the `<img>` tags in each HTML file for a cleaner result.
- **Photos:** every "HEADSHOT PHOTO" / "PHOTO PLACEHOLDER" block is a stand-in. Replace with real photography, drop files in `/assets/` and swap the placeholder `<div>` for an `<img>` tag, or send real photos in chat and Claude will wire them in.
- **About page copy:** the bio text is bracketed placeholder copy, replace with your actual background before publishing.

## 2. Hosting (pick one, all free or near-free)
- **Netlify** (easiest): drag this whole folder onto app.netlify.com/drop, done. Connect `chasinghomesinldn.ca` in Site Settings → Domain Management.
- **Vercel**: similar drag-and-drop or `vercel deploy` via their CLI.
- **GitHub Pages**: push this folder to a GitHub repo, enable Pages in repo settings.
- Any basic web host (GoDaddy, Bluehost, etc.) also works, just upload the whole folder via FTP/file manager, `index.html` needs to sit at the root.

## 3. Contact form
The form on `contact.html` doesn't send anywhere yet, it's just markup. Fastest fix: sign up free at [formspree.io](https://formspree.io), get a form endpoint, paste it into the `action="..."` attribute on the `<form>` tag in `contact.html`. No backend needed.

## 3b. Buyer's / Seller's guide lead capture (buying.html + selling.html)
Same idea as the contact form. Right now, submitting your email on either page triggers an instant download of the guide (works today, no setup needed), but the email itself isn't being captured anywhere yet. To actually collect those emails:
- Set up a Formspree endpoint (same as the contact form, can even be the same one).
- On `buying.html` and `selling.html`, find `<form class="lead-form" data-endpoint="#" ...>` and replace `data-endpoint="#"` with your real Formspree URL, e.g. `data-endpoint="https://formspree.io/f/yourFormId"`.
- The download still fires immediately either way, this just adds email capture on top.

The seller's guide (`assets/sellers-guide.html`) has real drafted content. The buyer's guide (`assets/buyers-guide.html`) is placeholder content marked clearly at the top, upload your existing buyer's guide and it'll get rebranded into the same layout.

## 4. Listings, DDF / live MLS data
This site can't legally pull live MLS data until your real estate board issues you DDF (Data Distribution Facility) access, usually via a signed agreement plus RESO Web API or RETS credentials, or through a paid feed provider (Repliers, Realtyna, Spark API, etc.) who resells access under your license. That's on your end to request through your board/brokerage, not something built into this site.

Once you have credentials:
- Open `js/listings.js`, read the comment block at the top, it explains the two ways to wire it in (a scheduled script that refreshes `data/listings.json`, or a direct client-side fetch to your feed provider's endpoint).
- Keep the field names (`status`, `price`, `address`, `city`, `beds`, `baths`, `sqft`, `mlsNumber`, `url`) consistent and nothing else on the site needs to change.

Until then, edit `data/listings.json` directly to update what shows on the site, just follow the same structure as the sample entries.

## 5. SEO, what's built in vs. what you still have to do

**Built into the code already:**
- Unique, keyword-real title + meta description per page (name + "REALTOR®" + "London, Ontario" on every one, that combo is what people actually search)
- Canonical URLs, Open Graph + Twitter card tags (controls how the site looks when shared/linked)
- `RealEstateAgent` structured data (JSON-LD) on the homepage, this is what helps Google connect "Chase Raymond" the person to this website and your Google Business Profile in search results
- `sitemap.xml` and `robots.txt` at the root, ready to submit to Google
- Single clean heading hierarchy per page (one H1), fast-loading static HTML (no bloated site builder JS)

**Before any of that actually works, you need to do this (in order):**

1. **Get it hosted at chasinghomesinldn.ca.** SEO can't do anything for a site that isn't live at your real domain.
2. **Claim/optimize your Google Business Profile** (business.google.com) if you haven't. Use the exact same name, address, and phone number as this site's footer (509 Commissioners Rd W, London, ON N6J 1Y5 / 519.854.8179), that consistency is what ties your GBP and website together in Google's eyes. Add your category ("Real Estate Agent"), photos, hours, and get a handful of client reviews, reviews are one of the biggest local ranking factors there is.
3. **Set up a realtor.ca profile** if you don't have one, it's mandatory for Ontario agents anyway and it's a high-authority site, it'll likely outrank random results for your name and you want it working for you, not against you.
4. **Submit the site to Google Search Console and Bing Webmaster Tools**, verify domain ownership, submit `sitemap.xml` in both. This is what actually gets you crawled and indexed, none of the code above matters if Google doesn't know the site exists.
5. **Fill in the `sameAs` links** in the JSON-LD on `index.html` (currently placeholders) with your real Instagram, Facebook, realtor.ca profile, and Google Business Profile URLs. This is the actual technical link between "Chase Raymond" search results and all your profiles.
6. **Get one backlink from your brokerage's site** (an agent directory listing linking to chasinghomesinldn.ca), brokerage sites usually have solid domain authority and that link matters more than almost anything else on this list.
7. **Replace the placeholder `assets/og-image.jpg`** with a real 1200×630px image (your headshot or a branded card), that's what shows up when the site gets shared or linked anywhere.

None of this is optional if the goal is showing up on page one for your own name, structured data and meta tags help, but claimed GBP + realtor.ca + real backlinks + indexing is what actually moves the needle.

## 6. Office listings
The "Office Listings" tab on the homepage pulls from `data/office-listings.json`, currently sample data for other agents at your office. There's no automatic feed for this (no board grants that kind of cross-agent access), so this needs to be manually updated, or check with your office admin about a shared internal listing export you could pull from periodically.

## 7. Social links
Icon links (IG / FB / TT / LI) are in place in every page footer, but all point to `#` placeholders right now, and the same placeholders sit in the `sameAs` array of the JSON-LD on `index.html`. Send over your actual Instagram, Facebook, TikTok, and LinkedIn URLs and they'll get wired in everywhere at once.

## 8. What's next
Social media template kit (New Listing, Just Sold, Open House, Coming Soon, Price Drop, Testimonial) is the next phase per the brand roadmap.
