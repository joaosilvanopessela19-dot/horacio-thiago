(function () {
  "use strict";

  /* ===================================================
     CATÁLOGO DE SERVIÇOS
     Cada serviço corresponde a uma pasta do portfólio original.
     =================================================== */
  var CATALOG = [
    {
      id: "social-media",
      name: "Social Media",
      desc: "Feeds, carrosséis e destaques que mantêm a marca sempre presente e coerente nas redes sociais.",
      count: 8
    },
    {
      id: "restaurante",
      name: "Restaurantes & Gastronomia",
      desc: "Cardápios, promoções e campanhas visuais para restaurantes, rodízios e espaços gastronómicos.",
      count: 7
    },
    {
      id: "natal",
      name: "Campanhas de Natal",
      desc: "Artes sazonais de Natal e Ano Novo pensadas para vender mais nas épocas festivas.",
      count: 4
    },
    {
      id: "escola",
      name: "Educação & Escolas",
      desc: "Materiais de divulgação institucional: matrículas, eventos e comunicação para escolas.",
      count: 2
    },
    {
      id: "cartao-visita",
      name: "Cartões de Visita",
      desc: "Design de cartões de visita profissionais, prontos para impressão e apresentação digital.",
      count: 2
    },
    {
      id: "namorados",
      name: "Datas Especiais",
      desc: "Campanhas temáticas para datas comemorativas, como o Dia dos Namorados.",
      count: 1
    },
    {
      id: "electro",
      name: "Eletrodomésticos",
      desc: "Anúncios de produto para lojas de eletrodomésticos e eletrónica, focados em conversão.",
      count: 5
    },
    {
      id: "barbearia",
      name: "Barbearias",
      desc: "Identidade visual e artes promocionais para barbearias e espaços de grooming.",
      count: 4
    },
    {
      id: "passatempo",
      name: "Passatempos & Sorteios",
      desc: "Artes dinâmicas para sorteios e ações de engagement nas redes sociais.",
      count: 4
    }
  ];

  // gera a lista de imagens a partir do manifest conhecido (id-1..id-n)
  function buildGallery() {
    var items = [];
    CATALOG.forEach(function (cat) {
      for (var i = 1; i <= cat.count; i++) {
        items.push({
          catId: cat.id,
          catName: cat.name,
          id: cat.id + "-" + i,
          thumb: "images/thumbs/" + cat.id + "-" + i + ".jpg",
          full: "images/full/" + cat.id + "-" + i + ".jpg"
        });
      }
    });
    return items;
  }

  var GALLERY = buildGallery();

  /* ===================================================
     RENDER — cartões de serviço
     =================================================== */
  var servicesGrid = document.getElementById("servicesGrid");
  CATALOG.forEach(function (cat, idx) {
    var card = document.createElement("button");
    card.className = "service-card";
    card.setAttribute("data-jump", cat.id);
    card.innerHTML =
      '<span class="service-num">' + String(idx + 1).padStart(2, "0") + "</span>" +
      '<h3 class="service-name">' + cat.name + "</h3>" +
      '<p class="service-desc">' + cat.desc + "</p>" +
      '<span class="service-link">Ver projetos <span class="arrow">&#8594;</span></span>';
    servicesGrid.appendChild(card);
  });

  /* ===================================================
     RENDER — filtros
     =================================================== */
  var filterBar = document.getElementById("filterBar");
  CATALOG.forEach(function (cat) {
    var pill = document.createElement("button");
    pill.className = "filter-pill";
    pill.setAttribute("data-filter", cat.id);
    pill.textContent = cat.name;
    filterBar.appendChild(pill);
  });

  /* ===================================================
     RENDER — galeria
     =================================================== */
  var galleryGrid = document.getElementById("galleryGrid");
  GALLERY.forEach(function (item, idx) {
    var fig = document.createElement("figure");
    fig.className = "gallery-item";
    fig.setAttribute("data-cat", item.catId);
    fig.setAttribute("data-index", idx);
    fig.innerHTML =
      '<img src="' + item.thumb + '" alt="' + item.catName + ' — projeto de design" loading="lazy">' +
      '<figcaption class="gallery-caption">' + item.catName + "</figcaption>";
    galleryGrid.appendChild(fig);
  });

  /* ===================================================
     FILTRAGEM
     =================================================== */
  function applyFilter(filterId) {
    var pills = filterBar.querySelectorAll(".filter-pill");
    pills.forEach(function (p) {
      p.classList.toggle("is-active", p.getAttribute("data-filter") === filterId);
    });
    var items = galleryGrid.querySelectorAll(".gallery-item");
    items.forEach(function (it) {
      var show = filterId === "all" || it.getAttribute("data-cat") === filterId;
      it.classList.toggle("is-hidden", !show);
    });
  }

  filterBar.addEventListener("click", function (e) {
    var btn = e.target.closest(".filter-pill");
    if (!btn) return;
    applyFilter(btn.getAttribute("data-filter"));
  });

  // cliques nos cartões de serviço saltam para a galeria já filtrada
  servicesGrid.addEventListener("click", function (e) {
    var card = e.target.closest(".service-card");
    if (!card) return;
    var catId = card.getAttribute("data-jump");
    applyFilter(catId);
    document.getElementById("trabalhos").scrollIntoView({ behavior: "smooth" });
  });

  /* ===================================================
     LIGHTBOX
     =================================================== */
  var lightbox = document.getElementById("lightbox");
  var lbImage = document.getElementById("lbImage");
  var lbCaption = document.getElementById("lbCaption");
  var lbClose = document.getElementById("lbClose");
  var lbPrev = document.getElementById("lbPrev");
  var lbNext = document.getElementById("lbNext");
  var currentIndex = 0;
  var lastFocused = null;

  function visibleIndexes() {
    var items = Array.prototype.slice.call(galleryGrid.querySelectorAll(".gallery-item"));
    return items
      .filter(function (it) { return !it.classList.contains("is-hidden"); })
      .map(function (it) { return parseInt(it.getAttribute("data-index"), 10); });
  }

  function openLightbox(index) {
    currentIndex = index;
    var item = GALLERY[index];
    lbImage.src = item.full;
    lbImage.alt = item.catName + " — projeto de design";
    lbCaption.textContent = item.catName;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    lastFocused = document.activeElement;
    lbClose.focus();
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  function stepLightbox(dir) {
    var visible = visibleIndexes();
    var pos = visible.indexOf(currentIndex);
    if (pos === -1) pos = 0;
    var nextPos = (pos + dir + visible.length) % visible.length;
    openLightbox(visible[nextPos]);
  }

  galleryGrid.addEventListener("click", function (e) {
    var fig = e.target.closest(".gallery-item");
    if (!fig) return;
    openLightbox(parseInt(fig.getAttribute("data-index"), 10));
  });

  lbClose.addEventListener("click", closeLightbox);
  lbPrev.addEventListener("click", function () { stepLightbox(-1); });
  lbNext.addEventListener("click", function () { stepLightbox(1); });
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });

  /* ===================================================
     NAV — scroll state + mobile toggle
     =================================================== */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 30);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  navToggle.addEventListener("click", function () {
    var open = mainNav.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  mainNav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      mainNav.classList.remove("is-open");
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* footer year */
  document.getElementById("year").textContent = new Date().getFullYear();

})();
