/* Siklus — interaksi halaman */
(function () {
  "use strict";

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ============ Nav: mobile + scrollspy ============ */
  var nav = $("#mainNav");
  var navToggle = $("#navToggle");

  function closeNav() {
    if (!nav) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Buka menu");
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  var navLinks = $$(".main-nav a");
  var spySections = navLinks
    .map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && spySections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    spySections.forEach(function (s) { spy.observe(s); });
  }

  /* ============ Prinsip 5R: tab ============ */
  var tabs = $$(".r-tab");
  var panels = $$(".r-panel");

  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute("aria-controls"));
      if (panel) {
        panel.classList.toggle("is-active", on);
        if (on) { panel.removeAttribute("hidden"); } else { panel.setAttribute("hidden", ""); }
      }
    });
    if (focus) tab.focus();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { selectTab(tab, false); });
    tab.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = tabs[(i + 1) % tabs.length];
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === "Home") next = tabs[0];
      if (e.key === "End") next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); selectTab(next, true); }
    });
  });

  /* ============ Data panduan memilah ============ */
  var GUIDE = [
    { name: "Botol plastik PET", cat: "plastik", status: "recycle", bin: "Bank sampah", tip: "Bilas singkat dan jaga bentuknya. Tutup serta label seringkali masuk jalur berbeda." },
    { name: "Botol susu / deterjen HDPE", cat: "plastik", status: "recycle", bin: "Bank sampah", tip: "Cukup dibilas, lalu remas agar ringkas." },
    { name: "Kantong plastik (LDPE)", cat: "plastik", status: "special", bin: "Drop point khusus", tip: "Tidak semua bank sampah menerima. Membawa tas sendiri tetap lebih baik." },
    { name: "Sachet berlapis", cat: "plastik", status: "avoid", bin: "Lebih baik dihindari", tip: "Lapisan campurannya nyaris mustahil dipisahkan. Pilih kemasan besar atau isi ulang." },
    { name: "Styrofoam", cat: "plastik", status: "avoid", bin: "Lebih baik dihindari", tip: "Ringan, mudah kotor, dan tidak ekonomis untuk didaur ulang." },
    { name: "Sedotan plastik", cat: "plastik", status: "avoid", bin: "Lebih baik dihindari", tip: "Terlalu kecil untuk disortir. Tolak, atau pakai sedotan yang bisa dipakai ulang." },
    { name: "Kaleng aluminium", cat: "logam", status: "recycle", bin: "Bank sampah", tip: "Cuci singkat. Aluminium paling hemat energi saat didaur ulang." },
    { name: "Kaleng besi makanan", cat: "logam", status: "recycle", bin: "Bank sampah", tip: "Lepas label kertas bila mudah terlepas." },
    { name: "Kaleng cat", cat: "b3", status: "special", bin: "Drop point B3", tip: "Sisa cat termasuk bahan berbahaya. Jangan dibuang ke saluran air." },
    { name: "Kardus", cat: "kertas", status: "recycle", bin: "Pemulung / bank sampah", tip: "Lipat agar ringkas. Buka bagian lakban bila memungkinkan." },
    { name: "Koran & kertas buram", cat: "kertas", status: "recycle", bin: "Bank sampah", tip: "Jaga agar kering. Kertas basah tidak bisa disortir." },
    { name: "Kertas tisu bekas", cat: "kertas", status: "avoid", bin: "Kompos / TPA", tip: "Seratnya terlalu pendek untuk daur ulang. Lebih cocok masuk kompos." },
    { name: "Buku & majalah bekas", cat: "kertas", status: "recycle", bin: "Bank sampah", tip: "Jilid dan sampul keras kadang dipisahkan lebih dulu." },
    { name: "Botol kaca", cat: "kaca", status: "recycle", bin: "Bank sampah", tip: "Pisahkan tutup logam. Kaca bisa didaur ulang tanpa batas." },
    { name: "Gelas / piring kaca", cat: "kaca", status: "avoid", bin: "Lebih baik dihindari", tip: "Kaca borosilikat punya titik leleh berbeda dan mengotori daur ulang kaca." },
    { name: "Baterai bekas", cat: "b3", status: "special", bin: "Drop point e-waste", tip: "Jangan dibuang sembarangan; kandungan logam beratnya berbahaya." },
    { name: "Ponsel & laptop rusak", cat: "elektronik", status: "special", bin: "Drop point e-waste", tip: "Hapus data pribadi dulu, lalu serahkan ke program take-back." },
    { name: "Lampu neon / bohlam CFL", cat: "b3", status: "special", bin: "Drop point B3", tip: "Mengandung merkuri. Jangan dipatahkan atau dibuang ke TPA." },
    { name: "Sisa makanan", cat: "organik", status: "compost", bin: "Kompos", tip: "Pisahkan dari plastik. Metana dari TPA bisa dihindari dengan kompos." },
    { name: "Daun & ranting", cat: "organik", status: "compost", bin: "Kompos", tip: "Potong kecil agar lebih cepat terurai." },
    { name: "Kain perca / baju sobek", cat: "tekstil", status: "special", bin: "Bank kain / donasi", tip: "Jadikan lap atau sumbangkan. Serat sintetis tetap jadi mikroplastik." },
    { name: "Popok & pembalut", cat: "b3", status: "special", bin: "Jalur khusus", tip: "Tidak bisa dicampur sampah kering; cari tempat sampah khusus." },
    { name: "Ban bekas", cat: "b3", status: "special", bin: "Drop point khusus", tip: "Pemulung umumnya menolak. Cari program retread atau drop point ban." },
    { name: "Botol minyak bekas", cat: "b3", status: "special", bin: "Drop point B3", tip: "Sisa minyak termasuk limbah berbahaya. Simpan tertutup sampai ketemu drop point." }
  ];

  var STATUS = {
    recycle: { label: "Daur ulang", cls: "status-recycle" },
    compost: { label: "Kompos", cls: "status-compost" },
    special: { label: "Jalur khusus", cls: "status-special" },
    avoid: { label: "Dihindari", cls: "status-avoid" }
  };

  var guideList = $("#guideList");
  var guideCount = $("#guideCount");
  var guideEmpty = $("#guideEmpty");
  var guideSearch = $("#guideSearch");
  var guideChips = $$("#guideChips .chip");
  var activeCat = "semua";
  var query = "";

  function renderGuide() {
    if (!guideList) return;
    var q = query.trim().toLowerCase();
    var items = GUIDE.filter(function (item) {
      var catOk = activeCat === "semua" || item.cat === activeCat;
      var qOk = !q || item.name.toLowerCase().indexOf(q) !== -1 || item.tip.toLowerCase().indexOf(q) !== -1;
      return catOk && qOk;
    });

    guideList.innerHTML = items.map(function (item) {
      var st = STATUS[item.status];
      return (
        '<li class="guide-item">' +
          '<div class="guide-main">' +
            '<p class="guide-name">' + item.name + "</p>" +
            '<p class="guide-tip">' + item.tip + "</p>" +
          "</div>" +
          '<div class="guide-side">' +
            '<span class="guide-cat">' + item.cat + "</span>" +
            '<span class="status ' + st.cls + '"><i class="dot"></i>' + st.label + "</span>" +
          "</div>" +
        "</li>"
      );
    }).join("");

    guideCount.textContent = "Menampilkan " + items.length + " dari " + GUIDE.length + " benda";
    guideEmpty.hidden = items.length !== 0;
  }

  guideChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      guideChips.forEach(function (c) { c.classList.toggle("is-active", c === chip); });
      activeCat = chip.getAttribute("data-cat");
      renderGuide();
    });
  });
  if (guideSearch) {
    guideSearch.addEventListener("input", function () {
      query = guideSearch.value;
      renderGuide();
    });
  }
  renderGuide();

  /* ============ Data kode resin ============ */
  var RESIN = [
    { num: 1, code: "PET", name: "Polyethylene Terephthalate", found: "Botol air minum, selai, saus", level: 3, note: "Jangan diisi ulang berkali-kali; pindah ke botol khusus." },
    { num: 2, code: "HDPE", name: "High-Density Polyethylene", found: "Botol susu, deterjen, shampoo", level: 3, note: "Cukup dibilas, lalu buang tutup sesuai aturan fasilitas." },
    { num: 3, code: "PVC", name: "Polyvinyl Chloride", found: "Pipa, shrink wrap, kemasan kaku", level: 1, note: "Mengeluarkan klorin saat diproses. Lebih baik dihindari." },
    { num: 4, code: "LDPE", name: "Low-Density Polyethylene", found: "Kantong belanja, plastik fleksibel", level: 2, note: "Butuh drop point khusus; tidak semua bank sampah menerima." },
    { num: 5, code: "PP", name: "Polypropylene", found: "Sedotan, tutup botol, wadah makanan", level: 2, note: "Makin banyak fasilitas yang menerimanya. Cek kebijakan lokal." },
    { num: 6, code: "PS", name: "Polystyrene", found: "Styrofoam, gelas sekali pakai", level: 1, note: "Ringan dan mudah kotor; ekonomisnya tidak masuk akal." },
    { num: 7, code: "OTHER", name: "Campuran: PC, PLA, nilon", found: "Kemasan berlapis, kacamata, peralatan", level: 1, note: "Di luar enam kode di atas; hampir selalu berakhir di TPA." }
  ];
  var LEVEL_LABEL = { 3: "Mudah didaur ulang", 2: "Sedang", 1: "Sulit didaur ulang" };

  var resinGrid = $("#resinGrid");
  if (resinGrid) {
    resinGrid.innerHTML = RESIN.map(function (r) {
      var bars = [1, 2, 3].map(function (i) {
        return '<span class="' + (i <= r.level ? "is-on" : "") + '"></span>';
      }).join("");
      return (
        '<article class="resin-card">' +
          '<div class="resin-top"><span class="resin-num">' + r.num + '</span>' +
          '<span class="resin-code">' + r.code + "</span></div>" +
          "<h3>" + r.name + "</h3>" +
          '<p class="resin-found">' + r.found + "</p>" +
          '<div class="resin-meter" aria-hidden="true">' + bars + "</div>" +
          '<p class="resin-level">' + LEVEL_LABEL[r.level] + "</p>" +
          '<p class="resin-note">' + r.note + "</p>" +
        "</article>"
      );
    }).join("");
  }

  /* ============ Kalkulator jejak ============ */
  var QUESTIONS = [
    {
      q: "Seberapa sering kamu membawa botol atau tas belanja sendiri?",
      opts: [["Selalu", 0], ["Sering", 1], ["Jarang", 2], ["Hampir tidak pernah", 3]],
      tip: "Letakkan botol dan tas belanja di depan pintu. Itu penghemat terbesar."
    },
    {
      q: "Bagaimana kamu menangani sisa makanan?",
      opts: [["Dijadikan kompos", 0], ["Dibuang ke tempat khusus", 1], ["Dibuang seperti sampah lain", 2], ["Sering tersisa dan basi", 3]],
      tip: "Mulai kompos mini untuk sisa sayur dan buah. Itu penghemat terbesar kedua."
    },
    {
      q: "Seberapa sering kamu memakai kemasan sekali pakai (sachet, sedotan, gelas)?",
      opts: [["Hampir tidak pernah", 0], ["Sesekali", 1], ["Sering", 2], ["Setiap kali belanja", 3]],
      tip: "Pilih kemasan besar daripada sachet, dan bawa wadah sendiri saat belanja."
    },
    {
      q: "Apakah kamu memilah sampah di rumah?",
      opts: [["Ya, konsisten", 0], ["Kadang-kadang", 1], ["Tidak", 2], ["Tidak ada tempatnya", 3]],
      tip: "Siapkan dua kantong di rumah: kering dan basah. Itu saja dulu."
    },
    {
      q: "Bila sesuatu rusak, apa yang kamu lakukan lebih dulu?",
      opts: [["Mencoba memperbaiki", 0], ["Mencari yang bekas", 1], ["Langsung membeli yang baru", 2], ["Membuang dan membeli baru", 3]],
      tip: "Coba perbaiki satu benda sebelum memutuskan membeli yang baru."
    },
    {
      q: "Seberapa jauh kamu tahu tujuan akhir sampahmu?",
      opts: [["Tahu persis", 0], ["Kurang lebih tahu", 1], ["Tidak tahu", 2], ["Belum pernah mikir", 3]],
      tip: "Cari drop point terdekat dan catat lokasinya. Tahu tujuan memudahkan memilah."
    }
  ];
  var MAX_SCORE = QUESTIONS.length * 3;

  var calcIntro = $("#calcIntro");
  var calcQuestion = $("#calcQuestion");
  var calcResult = $("#calcResult");
  var calcProgress = $("#calcProgress");
  var calcProgressBar = $("#calcProgressBar");
  var calcStep = $("#calcStep");
  var calcQ = $("#calcQ");
  var calcOptions = $("#calcOptions");
  var calcScore = $("#calcScore");
  var calcMeterFill = $("#calcMeterFill");
  var calcVerdict = $("#calcVerdict");
  var calcNote = $("#calcNote");
  var calcIndex = 0;
  var answers = [];

  function showCalc(view) {
    calcIntro.hidden = view !== "intro";
    calcQuestion.hidden = view !== "question";
    calcResult.hidden = view !== "result";
    calcProgress.hidden = view === "intro";
  }

  function renderQuestion() {
    var item = QUESTIONS[calcIndex];
    calcStep.textContent = "Pertanyaan " + (calcIndex + 1) + " dari " + QUESTIONS.length;
    calcQ.textContent = item.q;
    calcProgressBar.style.width = (calcIndex / QUESTIONS.length * 100) + "%";
    calcOptions.innerHTML = item.opts.map(function (opt) {
      return '<button type="button" class="calc-opt" data-score="' + opt[1] + '">' + opt[0] + "</button>";
    }).join("");
    $$(".calc-opt", calcOptions).forEach(function (btn) {
      btn.addEventListener("click", function () {
        answers[calcIndex] = Number(btn.getAttribute("data-score"));
        calcIndex += 1;
        if (calcIndex >= QUESTIONS.length) { renderResult(); } else { renderQuestion(); }
      });
    });
  }

  function renderResult() {
    var total = answers.reduce(function (a, b) { return a + b; }, 0);
    var worst = 0;
    answers.forEach(function (score, i) { if (score > answers[worst]) worst = i; });

    calcProgressBar.style.width = "100%";
    calcScore.textContent = total;
    calcMeterFill.style.width = (total / MAX_SCORE * 100) + "%";

    var verdict, note;
    if (total <= 5) {
      verdict = "Riset nol";
      note = "Kebiasaanmu sudah jarang bocor ke TPA. Pertahankan, lalu bantu satu orang di sekitarmu mulai.";
    } else if (total <= 11) {
      verdict = "Di jalur yang benar";
      note = "Sebagian besar sudah terkendali. Cari dua titik terlemah dan perbaiki satu per satu.";
    } else {
      verdict = "Banyak rembesan";
      note = "Sampahmu masih banyak yang berakhir di TPA. Mulai dari satu kebiasaan yang paling gampang.";
    }
    calcVerdict.textContent = verdict;
    calcNote.textContent = note + " " + QUESTIONS[worst].tip;
    showCalc("result");
  }

  var calcStart = $("#calcStart");
  var calcReset = $("#calcReset");
  if (calcStart) {
    calcStart.addEventListener("click", function () {
      calcIndex = 0;
      answers = [];
      renderQuestion();
      showCalc("question");
    });
  }
  if (calcReset) {
    calcReset.addEventListener("click", function () {
      calcIndex = 0;
      answers = [];
      calcProgressBar.style.width = "0";
      showCalc("intro");
    });
  }

  /* ============ FAQ ============ */
  $$(".faq-item").forEach(function (item) {
    var btn = $(".faq-q", item);
    btn.addEventListener("click", function () {
      var open = item.classList.contains("is-open");
      $$(".faq-item.is-open").forEach(function (other) {
        other.classList.remove("is-open");
        $(".faq-q", other).setAttribute("aria-expanded", "false");
      });
      if (!open) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ============ Daftar aksi ============ */
  var actionBoxes = $$("#actionList input[type=checkbox]");
  var actionFill = $("#actionFill");
  var actionDone = $("#actionDone");
  var actionTotal = $("#actionTotal");
  var actionMsg = $("#actionMsg");

  function updateAction() {
    var done = actionBoxes.filter(function (b) { return b.checked; }).length;
    var total = actionBoxes.length;
    if (actionTotal) actionTotal.textContent = total;
    if (actionDone) actionDone.textContent = done;
    if (actionFill) actionFill.style.width = (total ? done / total * 100 : 0) + "%";
    if (actionMsg) {
      if (done === 0) {
        actionMsg.textContent = "Centang langkah yang benar-benar bisa kamu lakukan, bukan yang terdengar bagus.";
      } else if (done === total) {
        actionMsg.textContent = "Semua langkah dipilih. Pilih satu untuk dimulai minggu ini, jangan semua sekaligus.";
      } else {
        actionMsg.textContent = done + " langkah siap. Tambah lagi, atau mulai dari yang pertama.";
      }
    }
  }
  actionBoxes.forEach(function (box) { box.addEventListener("change", updateAction); });
  updateAction();
})();
