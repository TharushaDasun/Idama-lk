// --- Language (English / Sinhala) ---
// Only static UI text is translated — the search form's dropdown OPTIONS
// (province/city/type names) stay in English because they're also used as
// the actual filter values sent to the backend; translating them would
// silently break search.
var I18N = {
  en: {
    "nav.buy": "Buy", "nav.rent": "Rent", "nav.land": "Land", "nav.commercial": "Commercial",
    "nav.sellerLogin": "Seller Login",
    "hero.title": "Find land and property, anywhere in Sri Lanka.",
    "hero.subtitle": "Search by province, property type and budget. Verified listings from owners and agents — for sale or for rent.",
    "hero.trust1": "Verified listings", "hero.trust2": "No agent fees", "hero.trust3": "All 9 provinces",
    "search.province": "Province", "search.city": "City / Town", "search.type": "Property type",
    "search.budget": "Budget", "search.perches": "Extent (perches)", "search.btn": "Search",
    "search.selectProvinceFirst": "Select province first", "search.anyCityTown": "Any city/town",
    "featured.kicker": "Just listed", "featured.title": "Featured properties",
    "featured.subtitle": "The latest verified listings on Idama.lk.",
    "cat.kicker": "Explore", "cat.title": "Browse by category",
    "cat.subtitle": "Every listing on Idama.lk falls into one of these — pick where to start.",
    "cat.houses.title": "Houses", "cat.houses.desc": "Family homes and new builds, for sale or long-term rent.",
    "cat.apartments.title": "Apartments", "cat.apartments.desc": "City and suburban apartments, from studios to penthouses.",
    "cat.land.title": "Land", "cat.land.desc": "Residential blocks, paddy, and agricultural land by extent.",
    "cat.commercial.title": "Commercial", "cat.commercial.desc": "Shops, offices and warehouse space for lease or sale.",
    "how.kicker": "Process", "how.title": "How Idama.lk works", "how.subtitle": "Three steps between browsing and moving in.",
    "how.step1.title": "Search by province and budget",
    "how.step1.desc": "Narrow thousands of listings down to what actually fits where you want to live and what you can spend.",
    "how.step2.title": "Compare verified listings",
    "how.step2.desc": "Every listing shows real photos, extent or floor area, and a price — no guessing.",
    "how.step3.title": "Contact the seller directly",
    "how.step3.desc": "Message the owner or agent through Idama.lk and arrange a viewing, no middleman fee.",
    "cta.title": "Have a property to sell or rent out?", "cta.link": "List it on Idama.lk",
    "footer.tagline": "Sri Lanka's property marketplace.", "footer.explore": "Explore",
    "footer.list": "List your property", "footer.how": "How it works", "footer.contact": "Contact",
    "footer.copyright": "© 2026 Idama.lk. All rights reserved."
  },
  si: {
    "nav.buy": "මිලදී ගන්න", "nav.rent": "කුලියට", "nav.land": "ඉඩම්", "nav.commercial": "වාණිජ",
    "nav.sellerLogin": "වික්‍රේතා පිවිසුම",
    "hero.title": "ශ්‍රී ලංකාවේ ඕනෑම තැනක ඉඩම් සහ දේපළ සොයාගන්න.",
    "hero.subtitle": "පළාත, දේපළ වර්ගය සහ අයවැය අනුව සොයන්න. හිමිකරුවන් සහ නියෝජිතයන්ගෙන් සත්‍යාපිත දැන්වීම් — විකිණීමට හෝ කුලියට.",
    "hero.trust1": "සත්‍යාපිත දැන්වීම්", "hero.trust2": "නියෝජිත ගාස්තු නැත", "hero.trust3": "පළාත් 9 ම",
    "search.province": "පළාත", "search.city": "නගරය / ගම", "search.type": "දේපළ වර්ගය",
    "search.budget": "අයවැය", "search.perches": "ප්‍රමාණය (පර්චස්)", "search.btn": "සොයන්න",
    "search.selectProvinceFirst": "මුලින් පළාත තෝරන්න", "search.anyCityTown": "ඕනෑම නගරයක්/ගමක්",
    "featured.kicker": "අලුත්ම", "featured.title": "විශේෂිත දේපළ",
    "featured.subtitle": "Idama.lk හි නවතම සත්‍යාපිත දැන්වීම්.",
    "cat.kicker": "ගවේෂණය කරන්න", "cat.title": "වර්ගය අනුව සොයන්න",
    "cat.subtitle": "Idama.lk හි සෑම දැන්වීමක්ම මේවායින් එකකට අයත් වේ — පටන් ගන්න තැනක් තෝරන්න.",
    "cat.houses.title": "නිවාස", "cat.houses.desc": "විකිණීමට හෝ දිගුකාලීන කුලියට ගෙවල් සහ අලුත් නිවාස.",
    "cat.apartments.title": "මහල් නිවාස", "cat.apartments.desc": "නගර හා තදාසන්න මහල් නිවාස, studio සිට penthouse දක්වා.",
    "cat.land.title": "ඉඩම්", "cat.land.desc": "නివාස සහ කෘෂිකාර්මික ඉඩම්, ප්‍රමාණය අනුව.",
    "cat.commercial.title": "වාණිජ", "cat.commercial.desc": "වෙළඳසැල්, කාර්යාල සහ ගබඩා — කුලියට හෝ විකිණීමට.",
    "how.kicker": "ක්‍රියාවලිය", "how.title": "Idama.lk වැඩ කරන ආකාරය", "how.subtitle": "බැලීමේ සිට move-in වෙනකම් step 3ක්.",
    "how.step1.title": "පළාත සහ අයවැය අනුව සොයන්න",
    "how.step1.desc": "දහස් ගණන් දැන්වීම් අතරින්, ඔයාට ජීවත් වෙන්න ඕන තැනට සහ ඔයාට වියදම් කරන්න පුළුවන් මුදලට ගැලපෙන ඒවා විතරක් තෝරගන්න.",
    "how.step2.title": "සත්‍යාපිත දැන්වීම් සසඳන්න",
    "how.step2.desc": "හැම දැන්වීමකම සත්‍ය photos, ප්‍රමාණය හෝ floor area, සහ මිලක් තියෙනවා — guess කරන්න ඕන නෑ.",
    "how.step3.title": "වික්‍රේතා සමඟ කෙලින්ම සම්බන්ධ වෙන්න",
    "how.step3.desc": "Idama.lk හරහා හිමිකරු හෝ නියෝජිතයා සම්බන්ධ කරගෙන බැලීමක් සංවිධානය කරගන්න, middleman ගාස්තුවක් නැතුව.",
    "cta.title": "විකිණීමට හෝ කුලියට දෙන්න දේපළක් තියෙනවද?", "cta.link": "Idama.lk හි list කරන්න",
    "footer.tagline": "ශ්‍රී ලංකාවේ දේපළ වෙළඳපොළ.", "footer.explore": "ගවේෂණය",
    "footer.list": "ඔයාගේ දේපළ list කරන්න", "footer.how": "වැඩ කරන ආකාරය", "footer.contact": "සම්බන්ධ වෙන්න",
    "footer.copyright": "© 2026 Idama.lk. සියලු හිමිකම් ඇවිරිණි."
  }
};
var currentLang = localStorage.getItem("idama_lang") || "en";

function t(key) {
  return (I18N[currentLang] && I18N[currentLang][key]) || (I18N.en[key] || key);
}

function applyLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang === "si" ? "si" : "en";
  document.body.classList.toggle("lang-si", lang === "si");
  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
}
function toggleLang() {
  var next = currentLang === "en" ? "si" : "en";
  localStorage.setItem("idama_lang", next);
  applyLang(next);
}

// --- Theme (light / dark) ---
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}
function toggleTheme() {
  var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  localStorage.setItem("idama_theme", next);
  applyTheme(next);
}
(function initThemeAndLang() {
  var savedTheme = localStorage.getItem("idama_theme");
  if (!savedTheme) {
    savedTheme = (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
  }
  applyTheme(savedTheme);
  applyLang(currentLang);
})();

// Mobile hamburger menu. Driven by JS rather than the usual
// ":checked ~ .mobile-panel" CSS trick, because that trick only works when
// the panel is a direct sibling of the checkbox — here it isn't (the panel
// sits one level up, as a sibling of the header-right wrapper), so the pure
// CSS version never actually matched.
(function () {
  var navToggle = document.getElementById("nav-toggle");
  var panel = document.querySelector(".mobile-panel");
  if (navToggle && panel) {
    navToggle.addEventListener("change", function () {
      panel.classList.toggle("is-open", navToggle.checked);
    });
  }
})();

// Province -> City/Town cascading select, and the Land-only perches field.
(function () {
  var townsByProvince = {
    "Western": ["Colombo", "Negombo", "Gampaha", "Kalutara", "Moratuwa", "Kelaniya"],
    "Central": ["Kandy", "Matale", "Nuwara Eliya", "Gampola"],
    "Southern": ["Galle", "Matara", "Hambantota", "Tangalle"],
    "Northern": ["Jaffna", "Vavuniya", "Kilinochchi", "Mannar"],
    "Eastern": ["Batticaloa", "Trincomalee", "Ampara", "Kalmunai"],
    "North Western": ["Kurunegala", "Puttalam", "Chilaw"],
    "North Central": ["Anuradhapura", "Polonnaruwa"],
    "Uva": ["Badulla", "Bandarawela", "Monaragala"],
    "Sabaragamuwa": ["Ratnapura", "Kegalle", "Embilipitiya"]
  };

  var provinceSelect = document.getElementById("province");
  var citySelect = document.getElementById("city");
  var typeSelect = document.getElementById("type");
  var perchesField = document.getElementById("perchesField");

  if (provinceSelect && citySelect) {
    provinceSelect.addEventListener("change", function () {
      var towns = townsByProvince[provinceSelect.value];
      citySelect.innerHTML = "";
      if (!towns) {
        citySelect.disabled = true;
        var opt = document.createElement("option");
        opt.textContent = t("search.selectProvinceFirst");
        citySelect.appendChild(opt);
        return;
      }
      citySelect.disabled = false;
      var anyOpt = document.createElement("option");
      anyOpt.textContent = t("search.anyCityTown");
      citySelect.appendChild(anyOpt);
      towns.forEach(function (town) {
        var o = document.createElement("option");
        o.textContent = town;
        citySelect.appendChild(o);
      });
    });
  }

  if (typeSelect && perchesField) {
    typeSelect.addEventListener("change", function () {
      perchesField.classList.toggle("is-open", typeSelect.value === "Land");
    });
  }
})();

// Lets a visitor flag a listing as problematic — the reason is sent to the
// backend and shows up in the Admin Panel's Reported Listings tab.
function reportListing(id) {
  var reason = prompt("Why are you reporting this listing?");
  if (reason === null) return;
  fetch("/api/listings/report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: id, reason: reason || "No reason given" })
  })
    .then(function () { alert("Thanks — this listing has been reported."); })
    .catch(function () { alert("Couldn't submit the report right now."); });
}

// Sri Lankan numbers are usually typed as 07XXXXXXXX; wa.me needs 947XXXXXXXX.
function waNumber(raw) {
  var d = String(raw || "").replace(/[^0-9]/g, "");
  if (d.indexOf("0") === 0) d = "94" + d.slice(1);
  return d;
}

// Escapes user-submitted text before it goes into innerHTML (listing titles,
// cities etc. come from sellers, so they must never be inserted raw).
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

// Renders a list of listings into the Featured Properties grid.
function renderListings(listings, emptyMessage) {
  var grid = document.getElementById("propGrid");
  if (!grid) return;
  grid.innerHTML = "";
  if (!listings.length) {
    grid.innerHTML = '<p class="prop-empty">' + emptyMessage + '</p>';
    return;
  }
  listings.forEach(function (item, i) {
    var photoClass = "p" + ((i % 3) + 1);
    var firstImg = (item.images || []).filter(function (u) { return /^https?:\/\//.test(u); })[0];
    var photoStyle = firstImg ? ' style="background-image:url(\'' + firstImg + '\');background-size:cover;background-position:center;"' : "";
    var priceLabel = item.priceUnit === "month"
      ? "Rs. " + Number(item.price).toLocaleString() + "/mo"
      : "Rs. " + Number(item.price).toLocaleString();
    var card = document.createElement("div");
    card.className = "prop-card reveal is-visible prop-card-link";
    card.setAttribute("data-id", item.id);
    var waLink = item.sellerContact
      ? '<a class="prop-whatsapp" target="_blank" href="https://wa.me/' + waNumber(item.sellerContact) + '?text=' + encodeURIComponent("Hi, I'm interested in " + item.title + " on Idama.lk") + '"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.5.1-.3-.1-1.2-.4-2.2-1.3-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.4.1-.6l.4-.5c.1-.1.2-.3.2-.4.1-.1 0-.3 0-.4-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.3-.8.8-.8 1.9s.8 2.2 1 2.4c.1.1 1.6 2.5 3.9 3.5.5.2 1 .4 1.3.5.5.2 1 .1 1.4.1.4-.1 1.3-.5 1.5-1 .2-.5.2-1 .1-1.1-.1-.1-.2-.1-.5-.3z"/><path d="M12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.5A10 10 0 1012 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .9.9-2.9-.2-.3A8.2 8.2 0 1112 20.2z"/></svg></a>'
      : '';
    card.innerHTML =
      '<div class="prop-photo ' + photoClass + '"' + photoStyle + '><span class="prop-tag">' + (item.priceUnit === "month" ? "For Rent" : "For Sale") + '</span>' + waLink + '</div>' +
      '<div class="prop-body">' +
        '<div class="prop-price">' + priceLabel + '</div>' +
        '<div class="prop-title">' + esc(item.title) + '</div>' +
        '<div class="prop-loc">' + esc(item.city || item.province || "Sri Lanka") + '</div>' +
        '<div class="prop-meta"><span>' + esc(item.category) + '</span></div>' +
        '<a href="#" class="prop-report" onclick="reportListing(\'' + esc(item.id) + '\');return false;">Report this listing</a>' +
      '</div>';
    card.addEventListener("click", function (e) {
      if (e.target.closest(".prop-whatsapp") || e.target.closest(".prop-report")) return;
      window.location.href = "detail.html?id=" + encodeURIComponent(item.id);
    });
    grid.appendChild(card);
  });
}

// Loads all active listings on page load.
function renderApprovedListings() {
  fetch("/api/listings?status=active")
    .then(function (r) { if (!r.ok) throw new Error("no api"); return r.json(); })
    .then(function (data) {
      renderListings(data.listings || [], 'No listings yet — be the first to <a href="dashboard/seller-dashboard.html">list a property</a>.');
    })
    .catch(function () {
      renderListings([], "Couldn't load listings right now — please refresh.");
    });
}

// Maps the search form's Budget dropdown text to a min/max price range.
var BUDGET_RANGES = {
  "Under Rs. 5M": { max: 5000000 },
  "Rs. 5M – 15M": { min: 5000000, max: 15000000 },
  "Rs. 15M – 30M": { min: 15000000, max: 30000000 },
  "Rs. 30M – 60M": { min: 30000000, max: 60000000 },
  "Above Rs. 60M": { min: 60000000 }
};

// Runs the hero search form against the real backend and shows results
// in the Featured Properties grid.
function performSearch(event) {
  event.preventDefault();
  var provinceEl = document.getElementById("province");
  var cityEl = document.getElementById("city");
  var typeEl = document.getElementById("type");
  var province = provinceEl.value;
  var city = cityEl.value;
  var type = typeEl.value;
  var budget = document.getElementById("price").value;
  var perches = document.getElementById("perches") ? document.getElementById("perches").value : "";

  var params = new URLSearchParams();
  params.set("status", "active");
  // Each select's first option is always its "no filter" placeholder, so we
  // check selectedIndex rather than matching English placeholder text —
  // that text is translated to Sinhala when the language is toggled.
  if (provinceEl.selectedIndex > 0) params.set("province", province);
  if (cityEl.selectedIndex > 0 && !cityEl.disabled) params.set("city", city);
  if (typeEl.selectedIndex > 0) params.set("category", type.toLowerCase());
  var range = BUDGET_RANGES[budget];
  if (range) {
    if (range.min) params.set("minPrice", range.min);
    if (range.max) params.set("maxPrice", range.max);
  }

  var sectionHead = document.querySelector("#propGrid").previousElementSibling;
  if (sectionHead) {
    var h2 = sectionHead.querySelector("h2");
    if (h2) h2.textContent = currentLang === "si" ? "සෙවුම් ප්‍රතිඵල" : "Search results";
  }

  fetch("/api/listings?" + params.toString())
    .then(function (r) { if (!r.ok) throw new Error("no api"); return r.json(); })
    .then(function (data) {
      var results = data.listings || [];
      if (type.toLowerCase() === "land" && perches) {
        var minPerches = Number(perches);
        if (!isNaN(minPerches)) {
          results = results.filter(function (l) { return l.perches && l.perches >= minPerches; });
        }
      }
      renderListings(results, 'No properties matched your search. Try widening the filters, or <a href="dashboard/seller-dashboard.html">list a property</a> if you\'re a seller.');
      var grid = document.getElementById("propGrid");
      if (grid) grid.scrollIntoView({ behavior: "smooth", block: "start" });
    })
    .catch(function () {
      renderListings([], "Couldn't search right now — please try again.");
    });
}

// Fades and lifts each .reveal element into place as it enters the viewport.
document.addEventListener("DOMContentLoaded", function () {
  renderApprovedListings();
  var items = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          setTimeout(function () {
            entry.target.classList.add("is-visible");
          }, i * 60);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach(function (el) { observer.observe(el); });
});

