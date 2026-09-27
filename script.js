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
        opt.textContent = "Select province first";
        citySelect.appendChild(opt);
        return;
      }
      citySelect.disabled = false;
      var anyOpt = document.createElement("option");
      anyOpt.textContent = "Any city/town";
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

// Renders real listings into the Featured Properties grid, fetched live from
// the backend (GET /api/listings?status=active). Shows a friendly empty
// state if there are no listings yet or the API isn't reachable.
function renderApprovedListings() {
  var grid = document.getElementById("propGrid");
  if (!grid) return;
  fetch("/api/listings?status=active")
    .then(function (r) { if (!r.ok) throw new Error("no api"); return r.json(); })
    .then(function (data) {
      var listings = data.listings || [];
      if (!listings.length) {
        grid.innerHTML = '<p class="prop-empty">No listings yet — be the first to <a href="dashboard/seller-dashboard.html">list a property</a>.</p>';
        return;
      }
      listings.forEach(function (item, i) {
        var photoClass = "p" + ((i % 3) + 1);
        var priceLabel = item.priceUnit === "month"
          ? "Rs. " + Number(item.price).toLocaleString() + "/mo"
          : "Rs. " + Number(item.price).toLocaleString();
        var card = document.createElement("div");
        card.className = "prop-card reveal";
        card.innerHTML =
          '<div class="prop-photo ' + photoClass + '"><span class="prop-tag">' + (item.priceUnit === "month" ? "For Rent" : "For Sale") + '</span></div>' +
          '<div class="prop-body">' +
            '<div class="prop-price">' + priceLabel + '</div>' +
            '<div class="prop-title">' + item.title + '</div>' +
            '<div class="prop-loc">' + (item.city || item.province || "Sri Lanka") + '</div>' +
            '<div class="prop-meta"><span>' + item.category + '</span></div>' +
          '</div>';
        grid.appendChild(card);
      });
    })
    .catch(function () {
      grid.innerHTML = '<p class="prop-empty">Couldn\'t load listings right now — please refresh.</p>';
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

