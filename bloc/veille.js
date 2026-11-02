/* Bloc « Veille informatique » du portfolio de Titouan Dumange.
 * Chargé par le petit code collé une seule fois dans Odoo (voir bloc/odoo.html).
 * Lit veille.json dans le même dépôt GitHub : comptes rendus, actualités et boîte à veille.
 * Modifier ce fichier suffit à changer le bloc sur le site (délai : quelques minutes).
 */
(function () {
  "use strict";

  var DATA_URL = "https://raw.githubusercontent.com/titouandmg-design/portfolio-veille/main/veille.json";
  var ROOT_ID = "veille-titouan";

  var root = document.getElementById(ROOT_ID);
  if (!root || root.getAttribute("data-veille-ready")) return;
  root.setAttribute("data-veille-ready", "1");

  var lang = (document.documentElement.lang || "fr").toLowerCase().indexOf("en") === 0 ? "en" : "fr";
  var T = {
    fr: {
      title: "Veille informatique",
      updated: "Mise à jour chaque lundi · dernière mise à jour le ",
      themes: "Thèmes de veille",
      report: "Compte rendu du ",
      previous: "Comptes rendus",
      analysis: "Analyse",
      impact: "Impacts",
      sources: "Sources",
      news: "Dernières actualités",
      read: "Lire l'article",
      box: "Boîte à veille",
      boxIntro: "Ma base de connaissances personnelle : les informations que j'ai jugées assez intéressantes pour les conserver.",
      all: "Tous les thèmes",
      cols: ["Date", "Sujet", "Source", "Ce que j'ai appris", "Pourquoi c'est intéressant ?", "Action éventuelle"],
      empty: "Aucune entrée pour ce thème.",
      error: "La veille ne peut pas être chargée pour le moment.",
      repo: "Voir les données sur GitHub"
    },
    en: {
      title: "Tech watch",
      updated: "Updated every Monday · last update on ",
      themes: "Watch topics",
      report: "Report of ",
      previous: "Reports",
      analysis: "Analysis",
      impact: "Impact",
      sources: "Sources",
      news: "Latest news",
      read: "Read the article",
      box: "Watch log",
      boxIntro: "My personal knowledge base: the information I found worth keeping.",
      all: "All topics",
      cols: ["Date", "Topic", "Source", "What I learned", "Why it matters", "Possible action"],
      empty: "No entry for this topic.",
      error: "The tech watch cannot be loaded right now.",
      repo: "See the data on GitHub"
    }
  }[lang];

  var CSS = [
    ".vt{--vt-accent:var(--o-color-1,#2f5bd3);--vt-line:color-mix(in srgb,currentColor 16%,transparent);",
    "--vt-soft:color-mix(in srgb,currentColor 5%,transparent);--vt-muted:color-mix(in srgb,currentColor 68%,transparent);",
    "font:inherit;color:inherit;line-height:1.55;max-width:1100px;margin:0 auto}",
    ".vt *{box-sizing:border-box}",
    ".vt h2{font-size:1.75rem;margin:0 0 .25rem}.vt h3{font-size:1.3rem;margin:.25rem 0 .75rem}",
    ".vt h4{font-size:1rem;margin:1.25rem 0 .4rem;text-transform:uppercase;letter-spacing:.04em;color:var(--vt-muted)}",
    ".vt-sub{color:var(--vt-muted);margin:0 0 1.25rem;font-size:.95rem}",
    ".vt-tabs{display:flex;flex-wrap:wrap;gap:.5rem;margin:0 0 1.25rem;padding:0;list-style:none}",
    ".vt-tab,.vt-chip{font:inherit;cursor:pointer;border:1px solid var(--vt-line);background:transparent;color:inherit;",
    "border-radius:999px;padding:.4rem 1rem;font-weight:600}",
    ".vt-chip{font-weight:500;padding:.3rem .85rem;font-size:.9rem}",
    ".vt-tab[aria-selected=true],.vt-chip[aria-pressed=true]{background:var(--vt-accent);border-color:var(--vt-accent);color:#fff}",
    ".vt-tab:focus-visible,.vt-chip:focus-visible,.vt select:focus-visible{outline:2px solid var(--vt-accent);outline-offset:2px}",
    ".vt-card{border:1px solid var(--vt-line);border-radius:14px;padding:1.25rem 1.4rem;background:var(--vt-soft)}",
    ".vt-rhead{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:.5rem}",
    ".vt-date{color:var(--vt-muted);font-size:.9rem;margin:0}",
    ".vt select{font:inherit;font-size:.9rem;color:inherit;background:transparent;border:1px solid var(--vt-line);border-radius:8px;padding:.3rem .5rem}",
    ".vt select option{color:#1d1d1b}",
    ".vt p{margin:0 0 .75rem}.vt ul{margin:0;padding-left:1.2rem}.vt li{margin:.3rem 0}",
    ".vt a{color:var(--vt-accent);overflow-wrap:break-word}.vt-srcs a{overflow-wrap:anywhere}",
    ".vt-srcs{display:flex;flex-direction:column;gap:.2rem;font-size:.9rem}",
    ".vt-news{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:.9rem;margin:.5rem 0 0}",
    ".vt-news article{border:1px solid var(--vt-line);border-radius:12px;padding:1rem}",
    ".vt-news h5{font-size:1rem;margin:.2rem 0 .4rem;line-height:1.35}",
    ".vt-news p{font-size:.92rem}",
    ".vt-box{margin-top:2.5rem}",
    ".vt-chips{display:flex;flex-wrap:wrap;gap:.4rem;margin:.75rem 0 1rem}",
    ".vt-tablewrap{overflow-x:auto;border:1px solid var(--vt-line);border-radius:12px}",
    ".vt table{width:100%;border-collapse:collapse;font-size:.92rem}",
    ".vt th,.vt td{text-align:left;vertical-align:top;padding:.65rem .75rem;border-top:1px solid var(--vt-line)}",
    ".vt thead th{border-top:0;background:var(--vt-soft);font-size:.85rem;white-space:nowrap}",
    ".vt td.vt-d{white-space:nowrap;font-variant-numeric:tabular-nums;color:var(--vt-muted)}",
    ".vt td.vt-s{font-weight:600;min-width:9rem}.vt td.vt-src{min-width:8.5rem}",
    ".vt-tag{display:inline-block;font-size:.75rem;font-weight:600;border:1px solid var(--vt-line);border-radius:999px;padding:0 .5rem;margin-top:.3rem;color:var(--vt-muted)}",
    "@media (max-width:760px){.vt-card{padding:1rem}.vt-tablewrap{border:0;overflow:visible}",
    ".vt table,.vt tbody,.vt tr,.vt td{display:block;width:100%}.vt thead{display:none}",
    ".vt tr{border:1px solid var(--vt-line);border-radius:12px;padding:.5rem .25rem;margin:0 0 .75rem}",
    ".vt td{border:0;padding:.3rem .75rem}.vt td::before{content:attr(data-label);display:block;font-size:.75rem;",
    "font-weight:600;text-transform:uppercase;letter-spacing:.03em;color:var(--vt-muted)}}"
  ].join("");

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "text") n.textContent = attrs[k];
      else if (k === "class") n.className = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  function tr(v) { return v && typeof v === "object" ? (v[lang] || v.fr || "") : (v || ""); }
  function link(url, text) { return el("a", { href: url, target: "_blank", rel: "noopener", text: text || url }); }

  var MONTHS = {
    fr: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  }[lang];
  function longDate(s) {
    var p = String(s || "").split("-");
    if (p.length === 3) return lang === "en" ? +p[2] + " " + MONTHS[+p[1] - 1] + " " + p[0] : (+p[2] === 1 ? "1er" : +p[2]) + " " + MONTHS[+p[1] - 1] + " " + p[0];
    if (p.length === 2) return MONTHS[+p[1] - 1] + " " + p[0];
    return p[0];
  }
  function shortDate(s) {
    var p = String(s || "").split("-");
    if (p.length === 3) return p[2] + "/" + p[1] + "/" + p[0];
    if (p.length === 2) return p[1] + "/" + p[0];
    return p[0];
  }
  function paragraphs(text) {
    return String(text || "").split(/\n\s*\n|\\n\\n/).filter(Boolean).map(function (t) { return el("p", { text: t.trim() }); });
  }

  function renderReport(box, r) {
    box.textContent = "";
    if (!r) return;
    box.appendChild(el("h3", { text: tr(r.title) }));
    paragraphs(tr(r.summary)).forEach(function (p) { box.appendChild(p); });
    if (r.analysis && r.analysis.length) {
      box.appendChild(el("h4", { text: T.analysis }));
      box.appendChild(el("ul", null, r.analysis.map(function (a) { return el("li", { text: tr(a) }); })));
    }
    if (tr(r.impact)) {
      box.appendChild(el("h4", { text: T.impact }));
      paragraphs(tr(r.impact)).forEach(function (p) { box.appendChild(p); });
    }
    if (r.sources && r.sources.length) {
      box.appendChild(el("h4", { text: T.sources }));
      box.appendChild(el("div", { class: "vt-srcs" }, r.sources.map(function (u) { return link(u); })));
    }
  }

  function renderTheme(panel, theme) {
    panel.textContent = "";
    var reports = theme.reports || [];
    var card = el("section", { class: "vt-card" });
    if (reports.length) {
      var head = el("div", { class: "vt-rhead" });
      var dateLine = el("p", { class: "vt-date", text: T.report + longDate(reports[0].date) });
      head.appendChild(dateLine);
      var body = el("div");
      if (reports.length > 1) {
        var sel = el("select", { "aria-label": T.previous });
        reports.forEach(function (r, i) { sel.appendChild(el("option", { value: String(i), text: longDate(r.date) })); });
        sel.addEventListener("change", function () {
          var r = reports[+sel.value];
          dateLine.textContent = T.report + longDate(r.date);
          renderReport(body, r);
        });
        head.appendChild(sel);
      }
      card.appendChild(head);
      card.appendChild(body);
      renderReport(body, reports[0]);
    }
    panel.appendChild(card);

    var news = (theme.news || []).slice().sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); }).slice(0, 3);
    if (news.length) {
      panel.appendChild(el("h4", { text: T.news }));
      panel.appendChild(el("div", { class: "vt-news" }, news.map(function (n) {
        return el("article", null, [
          el("p", { class: "vt-date", text: tr(n.label) || longDate(n.date) }),
          el("h5", { text: tr(n.title) }),
          el("p", { text: tr(n.text) }),
          el("p", { class: "vt-date" }, [document.createTextNode((n.source || "") + " · "), link(n.url, T.read)])
        ]);
      })));
    }
  }

  function renderBox(container, data) {
    var entries = (data.boite || []).slice().sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
    if (!entries.length) return;
    var names = {};
    Object.keys(data.themes || {}).forEach(function (k) { names[k] = data.themes[k].name || k; });
    var section = el("section", { class: "vt-box", "aria-labelledby": "vt-box-title" });
    section.appendChild(el("h2", { id: "vt-box-title", text: T.box }));
    section.appendChild(el("p", { class: "vt-sub", text: T.boxIntro }));
    var chips = el("div", { class: "vt-chips", role: "group", "aria-label": T.themes });
    var tbody = el("tbody");
    var current = "";
    function fill() {
      tbody.textContent = "";
      var rows = entries.filter(function (e) { return !current || e.theme === current; });
      if (!rows.length) {
        tbody.appendChild(el("tr", null, [el("td", { colspan: "6", text: T.empty })]));
        return;
      }
      rows.forEach(function (e) {
        tbody.appendChild(el("tr", null, [
          el("td", { class: "vt-d", "data-label": T.cols[0], text: shortDate(e.date) }),
          el("td", { class: "vt-s", "data-label": T.cols[1] }, [
            document.createTextNode(tr(e.sujet)), el("br"), el("span", { class: "vt-tag", text: names[e.theme] || e.theme })]),
          el("td", { class: "vt-src", "data-label": T.cols[2] }, [link(e.url, e.source || e.url)]),
          el("td", { "data-label": T.cols[3], text: tr(e.appris) }),
          el("td", { "data-label": T.cols[4], text: tr(e.interet) }),
          el("td", { "data-label": T.cols[5], text: tr(e.action) })
        ]));
      });
    }
    [""].concat(Object.keys(names)).forEach(function (k) {
      var b = el("button", { type: "button", class: "vt-chip", "aria-pressed": k === current ? "true" : "false", text: k ? names[k] : T.all });
      b.addEventListener("click", function () {
        current = k;
        Array.prototype.forEach.call(chips.children, function (c) { c.setAttribute("aria-pressed", c === b ? "true" : "false"); });
        fill();
      });
      chips.appendChild(b);
    });
    var table = el("table", null, [
      el("thead", null, [el("tr", null, T.cols.map(function (c) { return el("th", { scope: "col", text: c }); }))]),
      tbody
    ]);
    section.appendChild(chips);
    section.appendChild(el("div", { class: "vt-tablewrap" }, [table]));
    container.appendChild(section);
    fill();
  }

  function render(data) {
    root.textContent = "";
    var wrap = el("div", { class: "vt" });
    wrap.appendChild(el("h2", { text: T.title }));
    wrap.appendChild(el("p", { class: "vt-sub", text: T.updated + longDate(data.updated) }));
    var keys = Object.keys(data.themes || {});
    var tabs = el("div", { class: "vt-tabs", role: "tablist", "aria-label": T.themes });
    var panel = el("div", { role: "tabpanel", id: "vt-panel" });
    keys.forEach(function (k, i) {
      var b = el("button", { type: "button", class: "vt-tab", role: "tab", id: "vt-tab-" + k, "aria-controls": "vt-panel",
                             "aria-selected": i === 0 ? "true" : "false", text: data.themes[k].name || k });
      b.addEventListener("click", function () {
        Array.prototype.forEach.call(tabs.children, function (c) { c.setAttribute("aria-selected", c === b ? "true" : "false"); });
        panel.setAttribute("aria-labelledby", b.id);
        renderTheme(panel, data.themes[k]);
      });
      tabs.appendChild(b);
    });
    wrap.appendChild(tabs);
    wrap.appendChild(panel);
    if (keys.length) { panel.setAttribute("aria-labelledby", "vt-tab-" + keys[0]); renderTheme(panel, data.themes[keys[0]]); }
    renderBox(wrap, data);
    root.appendChild(wrap);
  }

  if (!document.getElementById("vt-style")) {
    var style = document.createElement("style");
    style.id = "vt-style";
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  fetch(DATA_URL, { cache: "no-cache" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(render)
    .catch(function () {
      root.textContent = "";
      var p = el("p", { text: T.error + " " });
      p.appendChild(link("https://github.com/titouandmg-design/portfolio-veille", T.repo));
      root.appendChild(p);
    });
})();
