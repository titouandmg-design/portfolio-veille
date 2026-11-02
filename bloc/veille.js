/* Bloc « Veille informatique » du portfolio de Titouan Dumange (titouandumange.fr).
 * Chargé par le petit code collé une seule fois dans Odoo (voir bloc/odoo.html).
 * Lit veille.json dans le même dépôt GitHub : comptes rendus, actualités et boîte à veille.
 * Reprend le socle commun des autres blocs du site (fond #0f1316, IBM Plex Sans, cartes td-card,
 * pastilles td-pill, étiquettes td-tag et td-bloc). Modifier ce fichier suffit à changer le bloc
 * sur le site (délai : quelques minutes).
 */
(function () {
  "use strict";

  var DATA_URL = "https://raw.githubusercontent.com/titouandmg-design/portfolio-veille/main/veille.json";
  var ROOT_ID = "veille-titouan";
  var FONT_URL = "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap";

  var root = document.getElementById(ROOT_ID);
  if (!root || root.getAttribute("data-veille-ready")) return;
  root.setAttribute("data-veille-ready", "1");

  var lang = (document.documentElement.lang || "fr").toLowerCase().indexOf("en") === 0 ? "en" : "fr";
  var T = {
    fr: {
      title: "Veille informatique",
      lead: "Trois sujets que je suis chaque semaine pour mon option SISR : un compte rendu par thème, les actualités qui l'appuient, et ma boîte à veille.",
      updated: "Mise à jour le ",
      themes: "Thèmes de veille",
      report: "Compte rendu du ",
      previous: "Choisir un compte rendu",
      analysis: "Analyse",
      impact: "Impacts",
      sources: "Sources",
      news: "Dernières actualités",
      read: "Lire l'article",
      box: "Boîte à veille",
      boxIntro: "Ma base de connaissances personnelle : les informations que j'ai jugées assez intéressantes pour les conserver.",
      all: "Tous les thèmes",
      cols: ["Date", "Sujet", "Source", "Ce que j'ai appris", "Pourquoi c'est intéressant ?", "Action éventuelle"],
      count: function (n) { return n + (n > 1 ? " entrées" : " entrée"); },
      empty: "Aucune entrée pour ce thème.",
      error: "La veille ne peut pas être chargée pour le moment.",
      repo: "Voir les données sur GitHub"
    },
    en: {
      title: "Tech watch",
      lead: "Three topics I follow every week for my network and systems option: one report per topic, the news behind it, and my watch log.",
      updated: "Updated on ",
      themes: "Watch topics",
      report: "Report of ",
      previous: "Choose a report",
      analysis: "Analysis",
      impact: "Impact",
      sources: "Sources",
      news: "Latest news",
      read: "Read the article",
      box: "Watch log",
      boxIntro: "My personal knowledge base: the information I found worth keeping.",
      all: "All topics",
      cols: ["Date", "Topic", "Source", "What I learned", "Why it matters", "Possible action"],
      count: function (n) { return n + (n > 1 ? " entries" : " entry"); },
      empty: "No entry for this topic.",
      error: "The tech watch cannot be loaded right now.",
      repo: "See the data on GitHub"
    }
  }[lang];

  var S = "#td-veille";
  var CSS = [
    /* Odoo : fond sombre de la page, et neutralisation de la section « Code intégré » (comme les autres blocs) */
    "html:has(#td-veille),body:has(#td-veille),#wrapwrap:has(#td-veille){background-color:#0f1316}",
    ".s_embed_code:has(> .s_embed_code_embedded > #veille-titouan > #td-veille){padding-top:0!important;padding-bottom:0!important;background:transparent!important;text-align:left}",
    ".s_embed_code_embedded:has(> #veille-titouan > #td-veille){max-width:none!important;width:100%;padding-left:0!important;padding-right:0!important}",
    /* Socle commun Titouan Dumange */
    S + "{--td-bg:#0f1316;--td-surface:rgba(21,27,30,.88);--td-surface-2:rgba(28,36,40,.92);--td-line:rgba(205,218,225,.13);",
    "--td-line-strong:rgba(205,218,225,.26);--td-text:#eef2f4;--td-muted:#b4c0c6;--td-faint:#8e9ba1;--td-accent:#86c1e0;",
    "--td-accent-soft:rgba(134,193,224,.12);--td-on-accent:#0b1419;--td-b1:#7ab8f0;--td-b2:#5dcaa5;--td-b3:#f09770;--td-radius:14px;",
    "position:relative;z-index:1;text-align:left;letter-spacing:normal;word-spacing:normal;",
    "font-family:'IBM Plex Sans',system-ui,-apple-system,'Segoe UI',sans-serif;font-size:16px;line-height:1.65;color:var(--td-text);",
    "-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}",
    S + " *," + S + " *::before," + S + " *::after{box-sizing:border-box}",
    S + " h2," + S + " h3," + S + " h4," + S + " h5," + S + " p," + S + " ul," + S + " ol{margin:0;padding:0}",
    S + " h2," + S + " h3," + S + " h4," + S + " h5{font-family:inherit;font-size:1rem;font-weight:600;line-height:1.3;color:var(--td-text);text-transform:none;letter-spacing:normal}",
    S + " p," + S + " li," + S + " span," + S + " td," + S + " th{color:inherit;font-family:inherit}",
    S + " ul," + S + " ol{list-style:none}",
    S + " a{color:var(--td-accent);text-decoration-thickness:1px;text-underline-offset:3px}",
    S + " button," + S + " select{font:inherit;color:inherit;margin:0}",
    S + " :focus-visible{outline:2px solid var(--td-accent);outline-offset:3px}",
    S + " .td-wrap{max-width:1120px;margin:0 auto;padding:96px 20px}",
    S + " .td-head{max-width:720px;margin-bottom:40px}",
    S + " .td-title{font-size:clamp(2rem,1.45rem + 1.9vw,2.75rem);font-weight:600;letter-spacing:-.022em;line-height:1.12}",
    S + " .td-lead{margin-top:14px;font-size:1.0625rem;color:var(--td-muted);max-width:64ch}",
    S + " .td-card{background:var(--td-surface);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);border:1px solid var(--td-line);border-radius:var(--td-radius)}",
    S + " .td-tag{display:inline-flex;align-items:center;padding:4px 10px;border-radius:6px;background:rgba(255,255,255,.045);border:1px solid var(--td-line);font-size:.8125rem;line-height:1.35;color:#d9e1e5;font-weight:500}",
    S + " .td-pill{display:inline-flex;align-items:center;gap:7px;padding:3px 10px 3px 9px;border-radius:999px;font-size:.78rem;font-weight:500;line-height:1.5;color:var(--td-muted);border:1px solid var(--td-line-strong);width:fit-content}",
    S + " .td-pill::before{content:'';width:6px;height:6px;border-radius:50%;background:currentColor;opacity:.8}",
    S + " .td-pill--accent{color:var(--td-accent);border-color:rgba(134,193,224,.4);background:var(--td-accent-soft)}",
    S + " .td-bloc{display:inline-block;font-size:.72rem;font-weight:600;padding:2px 8px;border-radius:5px;letter-spacing:.01em;white-space:nowrap;border:1px solid}",
    S + " .td-bloc--1{color:var(--td-b1);background:rgba(122,184,240,.12);border-color:rgba(122,184,240,.3)}",
    S + " .td-bloc--2{color:var(--td-b2);background:rgba(93,202,165,.12);border-color:rgba(93,202,165,.3)}",
    S + " .td-bloc--3{color:var(--td-b3);background:rgba(240,151,112,.12);border-color:rgba(240,151,112,.3)}",
    /* Bloc veille */
    S + " .vl-tabbar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px 16px;margin-bottom:24px}",
    S + " .vl-tabs{display:flex;flex-wrap:wrap;gap:8px}",
    S + " .vl-tab," + S + " .vl-chip{display:inline-flex;align-items:center;gap:8px;padding:8px 16px;border-radius:10px;border:1px solid var(--td-line-strong);",
    "background:transparent;color:var(--td-muted);font-weight:600;font-size:.95rem;line-height:1.2;cursor:pointer;transition:background-color .2s,border-color .2s,color .2s}",
    S + " .vl-chip{padding:5px 12px;border-radius:8px;font-size:.85rem;font-weight:500}",
    S + " .vl-tab:hover," + S + " .vl-chip:hover{background:var(--td-surface-2);color:var(--td-text)}",
    S + " .vl-tab[aria-selected=true]," + S + " .vl-chip[aria-pressed=true]{color:var(--td-accent);border-color:rgba(134,193,224,.45);background:var(--td-accent-soft)}",
    S + " .vl-layout{display:grid;grid-template-columns:1.55fr 1fr;gap:24px;align-items:start}",
    S + " .vl-report{padding:28px 30px}",
    S + " .vl-rhead{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px 16px;margin-bottom:16px}",
    S + " .vl-date{font-size:.85rem;color:var(--td-faint)}",
    S + " .vl-select{appearance:none;-webkit-appearance:none;background:var(--td-surface-2) url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23b4c0c6' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\") no-repeat right 10px center;",
    "border:1px solid var(--td-line-strong);border-radius:8px;padding:6px 32px 6px 12px;font-size:.85rem;color:var(--td-text);cursor:pointer}",
    S + " .vl-select option{background:#161b1e;color:var(--td-text)}",
    S + " .vl-report h3{font-size:1.35rem;letter-spacing:-.01em;line-height:1.3;margin-bottom:14px}",
    S + " .vl-report p{color:#d3dce0;margin-bottom:12px}",
    S + " .vl-report h4{font-size:.95rem;margin:22px 0 10px;display:flex;align-items:center;gap:8px}",
    S + " .vl-report h4::before{content:'';width:3px;height:14px;border-radius:2px;background:var(--td-accent)}",
    S + " .vl-points{display:grid;gap:8px}",
    S + " .vl-points li{position:relative;padding-left:18px;color:#d3dce0}",
    S + " .vl-points li::before{content:'';position:absolute;left:2px;top:.68em;width:6px;height:6px;border-radius:50%;background:var(--td-accent);opacity:.85}",
    S + " .vl-sources{display:flex;flex-wrap:wrap;gap:8px}",
    S + " .vl-sources a{text-decoration:none}",
    S + " .vl-sources a:hover{border-color:rgba(134,193,224,.45);color:var(--td-accent)}",
    S + " .vl-col-title{display:flex;align-items:center;gap:10px;font-size:1.1rem;font-weight:600;margin-bottom:4px}",
    S + " .vl-col-title svg{width:20px;height:20px;color:var(--td-accent)}",
    S + " .vl-news{display:grid;gap:16px}",
    S + " .vl-item{padding:20px 22px;display:grid;gap:8px}",
    S + " .vl-item h5{font-size:.975rem;line-height:1.4}",
    S + " .vl-item p{font-size:.9rem;color:var(--td-muted);line-height:1.6}",
    S + " .vl-item .vl-meta{font-size:.82rem;color:var(--td-faint)}",
    S + " .vl-box{margin-top:72px}",
    S + " .vl-box h3{font-size:1.35rem;font-weight:600;letter-spacing:-.01em}",
    S + " .vl-box > p{margin-top:6px;color:var(--td-muted);font-size:.975rem}",
    S + " .vl-boxbar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;margin:22px 0 16px}",
    S + " .vl-chips{display:flex;flex-wrap:wrap;gap:8px}",
    S + " .vl-count{font-size:.85rem;color:var(--td-faint)}",
    S + " .vl-table-card{overflow-x:auto}",
    S + " table.vl-table{width:100%;border-collapse:collapse;font-size:.9rem;line-height:1.55}",
    S + " .vl-table th{text-align:left;font-size:.72rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--td-faint);padding:14px 16px;border-bottom:1px solid var(--td-line-strong);white-space:nowrap;background:rgba(255,255,255,.02)}",
    S + " .vl-table td{vertical-align:top;padding:16px;border-top:1px solid var(--td-line);color:var(--td-muted)}",
    S + " .vl-table tbody tr:first-child td{border-top:0}",
    S + " .vl-table tbody tr:hover td{background:rgba(255,255,255,.018)}",
    S + " .vl-table .vl-d{white-space:nowrap;font-variant-numeric:tabular-nums;color:var(--td-faint)}",
    S + " .vl-table .vl-s{min-width:10rem;color:var(--td-text);font-weight:600}",
    S + " .vl-table .vl-s .td-bloc{margin-top:6px}",
    S + " .vl-table .vl-src{min-width:8.5rem}",
    S + " .vl-table .vl-act{min-width:9rem;color:#d9e1e5}",
    "@media (max-width:860px){" + S + " .vl-layout{grid-template-columns:1fr}}",
    "@media (max-width:760px){" + S + " .vl-table-card{background:transparent;border:0;-webkit-backdrop-filter:none;backdrop-filter:none;overflow:visible}",
    S + " .vl-table," + S + " .vl-table tbody," + S + " .vl-table tr," + S + " .vl-table td{display:block;width:100%}" + S + " .vl-table thead{display:none}",
    S + " .vl-table tr{background:var(--td-surface);border:1px solid var(--td-line);border-radius:var(--td-radius);padding:10px 4px;margin-bottom:12px}",
    S + " .vl-table td{border:0;padding:6px 16px}" + S + " .vl-table tbody tr:hover td{background:transparent}",
    S + " .vl-table td::before{content:attr(data-label);display:block;font-size:.7rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--td-faint);margin-bottom:2px}}",
    "@media (max-width:640px){" + S + " .td-wrap{padding:64px 16px}" + S + " .td-head{margin-bottom:32px}" + S + " .vl-report{padding:22px 20px}" + S + " .vl-box{margin-top:56px}}",
    "@media (prefers-reduced-motion:reduce){" + S + " *{transition:none!important}}"
  ].join("");

  var THEME_BADGE = { aiops: "td-bloc--1", nis2: "td-bloc--2", sdwan: "td-bloc--3" };

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "text") n.textContent = attrs[k];
      else if (k === "class") n.className = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }
  function tr(v) { return v && typeof v === "object" ? (v[lang] || v.fr || "") : (v || ""); }
  function link(url, text, cls) {
    var a = el("a", { href: url, target: "_blank", rel: "noopener", text: text || url });
    if (cls) a.className = cls;
    return a;
  }
  function host(url) {
    try { return new URL(url).hostname.replace(/^www\./, ""); } catch (e) { return url; }
  }
  function icon(path) {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("fill", "none"); svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.8"); svg.setAttribute("stroke-linecap", "round"); svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    path.split("|").forEach(function (d) { var p = document.createElementNS(ns, "path"); p.setAttribute("d", d); svg.appendChild(p); });
    return svg;
  }
  var ICON_NEWS = "M4 5h12v14H6a2 2 0 0 1-2-2V5Z|M16 9h4v8a2 2 0 0 1-2 2h-2|M8 9h4|M8 13h4";

  var MONTHS = {
    fr: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  }[lang];
  function longDate(s) {
    var p = String(s || "").split("-");
    if (p.length === 3) return (lang === "fr" && +p[2] === 1 ? "1er" : String(+p[2])) + " " + MONTHS[+p[1] - 1] + " " + p[0];
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
    return String(text || "").split(/\n\s*\n|\\n\\n/).filter(function (t) { return t.trim(); })
      .map(function (t) { return el("p", { text: t.trim() }); });
  }

  function renderReport(body, r) {
    body.textContent = "";
    if (!r) return;
    body.appendChild(el("h3", { text: tr(r.title) }));
    paragraphs(tr(r.summary)).forEach(function (p) { body.appendChild(p); });
    if (r.analysis && r.analysis.length) {
      body.appendChild(el("h4", { text: T.analysis }));
      body.appendChild(el("ul", { class: "vl-points" }, r.analysis.map(function (a) { return el("li", { text: tr(a) }); })));
    }
    if (tr(r.impact)) {
      body.appendChild(el("h4", { text: T.impact }));
      paragraphs(tr(r.impact)).forEach(function (p) { body.appendChild(p); });
    }
    if (r.sources && r.sources.length) {
      body.appendChild(el("h4", { text: T.sources }));
      body.appendChild(el("div", { class: "vl-sources" }, r.sources.map(function (u) { return link(u, host(u), "td-tag"); })));
    }
  }

  function renderTheme(panel, theme) {
    panel.textContent = "";
    var layout = el("div", { class: "vl-layout" });
    var reports = theme.reports || [];
    var card = el("article", { class: "td-card vl-report" });
    if (reports.length) {
      var head = el("div", { class: "vl-rhead" });
      var dateLine = el("p", { class: "vl-date", text: T.report + longDate(reports[0].date) });
      head.appendChild(dateLine);
      var body = el("div");
      if (reports.length > 1) {
        var sel = el("select", { class: "vl-select", "aria-label": T.previous });
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
    layout.appendChild(card);

    var news = (theme.news || []).slice().sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); }).slice(0, 3);
    var col = el("div", { class: "vl-news" });
    col.appendChild(el("h3", { class: "vl-col-title" }, [icon(ICON_NEWS), T.news]));
    news.forEach(function (n) {
      col.appendChild(el("article", { class: "td-card vl-item" }, [
        el("span", { class: "vl-date", text: tr(n.label) || longDate(n.date) }),
        el("h5", { text: tr(n.title) }),
        el("p", { text: tr(n.text) }),
        el("span", { class: "vl-meta" }, [(n.source || "") + " · ", link(n.url, T.read)])
      ]));
    });
    layout.appendChild(col);
    panel.appendChild(layout);
  }

  function renderBox(container, data) {
    var entries = (data.boite || []).slice().sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
    if (!entries.length) return;
    var names = {};
    Object.keys(data.themes || {}).forEach(function (k) { names[k] = data.themes[k].name || k; });
    var section = el("section", { class: "vl-box", "aria-labelledby": "vl-box-title" });
    section.appendChild(el("h3", { id: "vl-box-title", text: T.box }));
    section.appendChild(el("p", { text: T.boxIntro }));
    var bar = el("div", { class: "vl-boxbar" });
    var chips = el("div", { class: "vl-chips", role: "group", "aria-label": T.themes });
    var count = el("span", { class: "vl-count" });
    bar.appendChild(chips); bar.appendChild(count);
    var tbody = el("tbody");
    var current = "";
    function fill() {
      tbody.textContent = "";
      var rows = entries.filter(function (e) { return !current || e.theme === current; });
      count.textContent = T.count(rows.length);
      if (!rows.length) {
        tbody.appendChild(el("tr", null, [el("td", { colspan: "6", text: T.empty })]));
        return;
      }
      rows.forEach(function (e) {
        tbody.appendChild(el("tr", null, [
          el("td", { class: "vl-d", "data-label": T.cols[0], text: shortDate(e.date) }),
          el("td", { class: "vl-s", "data-label": T.cols[1] }, [
            tr(e.sujet), el("br"), el("span", { class: "td-bloc " + (THEME_BADGE[e.theme] || "td-bloc--1"), text: names[e.theme] || e.theme })]),
          el("td", { class: "vl-src", "data-label": T.cols[2] }, [link(e.url, e.source || host(e.url))]),
          el("td", { "data-label": T.cols[3], text: tr(e.appris) }),
          el("td", { "data-label": T.cols[4], text: tr(e.interet) }),
          el("td", { class: "vl-act", "data-label": T.cols[5], text: tr(e.action) })
        ]));
      });
    }
    [""].concat(Object.keys(names)).forEach(function (k) {
      var b = el("button", { type: "button", class: "vl-chip", "aria-pressed": k === current ? "true" : "false", text: k ? names[k] : T.all });
      b.addEventListener("click", function () {
        current = k;
        Array.prototype.forEach.call(chips.children, function (c) { c.setAttribute("aria-pressed", c === b ? "true" : "false"); });
        fill();
      });
      chips.appendChild(b);
    });
    section.appendChild(bar);
    section.appendChild(el("div", { class: "td-card vl-table-card" }, [
      el("table", { class: "vl-table" }, [
        el("thead", null, [el("tr", null, T.cols.map(function (c) { return el("th", { scope: "col", text: c }); }))]),
        tbody
      ])
    ]));
    container.appendChild(section);
    fill();
  }

  function shell() {
    root.textContent = "";
    var veille = el("div", { id: "td-veille", class: "td td-veille" });
    var wrap = el("div", { class: "td-wrap" });
    veille.appendChild(wrap);
    root.appendChild(veille);
    return wrap;
  }

  function render(data) {
    var wrap = shell();
    var head = el("header", { class: "td-head" }, [
      el("h2", { class: "td-title", text: T.title }),
      el("p", { class: "td-lead", text: T.lead })
    ]);
    wrap.appendChild(head);
    var keys = Object.keys(data.themes || {});
    var tabs = el("div", { class: "vl-tabs", role: "tablist", "aria-label": T.themes });
    var panel = el("div", { role: "tabpanel", id: "vl-panel" });
    keys.forEach(function (k, i) {
      var b = el("button", { type: "button", class: "vl-tab", role: "tab", id: "vl-tab-" + k, "aria-controls": "vl-panel",
                             "aria-selected": i === 0 ? "true" : "false", text: data.themes[k].name || k });
      b.addEventListener("click", function () {
        Array.prototype.forEach.call(tabs.children, function (c) { c.setAttribute("aria-selected", c === b ? "true" : "false"); });
        panel.setAttribute("aria-labelledby", b.id);
        renderTheme(panel, data.themes[k]);
      });
      tabs.appendChild(b);
    });
    wrap.appendChild(el("div", { class: "vl-tabbar" }, [
      tabs, el("span", { class: "td-pill td-pill--accent", text: T.updated + longDate(data.updated) })]));
    wrap.appendChild(panel);
    if (keys.length) { panel.setAttribute("aria-labelledby", "vl-tab-" + keys[0]); renderTheme(panel, data.themes[keys[0]]); }
    renderBox(wrap, data);
  }

  if (!document.getElementById("vl-style")) {
    var style = document.createElement("style");
    style.id = "vl-style";
    style.textContent = CSS;
    document.head.appendChild(style);
  }
  if (!document.querySelector('link[href*="IBM+Plex+Sans"]')) {
    document.head.appendChild(el("link", { rel: "stylesheet", href: FONT_URL }));
  }

  fetch(DATA_URL, { cache: "no-cache" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(render)
    .catch(function () {
      var wrap = shell();
      wrap.appendChild(el("p", { class: "td-lead" }, [T.error + " ", link("https://github.com/titouandmg-design/portfolio-veille", T.repo)]));
    });
})();
