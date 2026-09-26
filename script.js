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

// Renders any admin-approved listings (added via the Admin Panel) into the
// Featured Properties grid. Demo-only: uses localStorage, so it only works
// within this same browser/site (no real backend yet).
function renderApprovedListings() {
  var grid = document.querySelector(".prop-grid");
  if (!grid) return;
  var raw = localStorage.getItem("idama_approved_listings");
  var listings = raw ? JSON.parse(raw) : [];
  listings.forEach(function (item, i) {
    var photoClass = "p" + ((i % 3) + 1);
    var card = document.createElement("div");
    card.className = "prop-card reveal";
    card.innerHTML =
      '<div class="prop-photo ' + photoClass + '"><span class="prop-tag">' + item.tag + '</span></div>' +
      '<div class="prop-body">' +
        '<div class="prop-price">' + item.price + '</div>' +
        '<div class="prop-title">' + item.title + '</div>' +
        '<div class="prop-loc">' + item.location + '</div>' +
        '<div class="prop-meta"><span>' + item.category + '</span></div>' +
      '</div>';
    grid.appendChild(card);
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

