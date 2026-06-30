/* =====================================================================
   AHMAD KHAN — main.js
   ===================================================================== */
(function () {
  "use strict";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------------- Year ---------------- */
  $("#year").textContent = new Date().getFullYear();

  /* ---------------- Theme toggle ---------------- */
  const root = document.documentElement;
  const themeBtn = $("#theme-toggle");
  const savedTheme = localStorage.getItem("ak-theme");
  if (savedTheme) root.setAttribute("data-theme", savedTheme);
  themeBtn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("ak-theme", next);
    themeBtn.setAttribute("aria-label", next === "dark" ? "Switch to light mode" : "Switch to dark mode");
  });

  /* ---------------- Mobile menu ---------------- */
  const menuBtn = $("#menu-toggle");
  const navLinks = $(".nav-links");
  menuBtn.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });
  $$(".nav-links a").forEach(a => a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }));

  /* ---------------- Nav shrink + active link ---------------- */
  const nav = $("#nav");
  const sections = $$("main section[id]");
  const linkFor = id => $(`.nav-links a[href="#${id}"]`);
  window.addEventListener("scroll", () => {
    nav.classList.toggle("shrink", window.scrollY > 40);
    let current = "";
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    $$(".nav-links a").forEach(a => a.classList.remove("active"));
    const active = linkFor(current);
    if (active) active.classList.add("active");
  }, { passive: true });

  /* ---------------- Ticker: duplicate for seamless loop ---------------- */
  const track = $("#ticker-track");
  if (track) track.innerHTML += track.innerHTML;

  /* ---------------- Live clock (Lahore / PKT) ---------------- */
  const clock = $("#live-clock");
  function tick() {
    const t = new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Karachi", hour12: false });
    clock.textContent = t;
  }
  tick(); setInterval(tick, 1000);

  /* ---------------- Rotating signal/quotes ---------------- */
  const quotes = [
    "Value is what you understand before you price it.",
    "Diligence is just curiosity with a deadline.",
    "Every normalization tells a story the headline hides.",
    "A clean audit trail is a quiet kind of confidence.",
    "Risk you can name is risk you can manage.",
    "Models don't decide — they sharpen the question."
  ];
  const qEl = $("#rotating-quote");
  let qi = 0;
  if (qEl && !reduceMotion) {
    setInterval(() => {
      qi = (qi + 1) % quotes.length;
      qEl.style.opacity = "0";
      setTimeout(() => { qEl.textContent = quotes[qi]; qEl.style.opacity = "1"; }, 350);
    }, 5000);
    qEl.style.transition = "opacity .35s ease";
  }

  /* ---------------- Scroll reveal ---------------- */
  $$("section, .metric, .orb-card, .mini-card, .tl-item").forEach(el => el.classList.add("reveal"));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        if (e.target.id === "skills") animateSkills();
        if (e.target.classList.contains("reveal") && e.target.querySelector("[data-count]")) animateCounters(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  $$(".reveal").forEach(el => io.observe(el));

  /* ---------------- Counters ---------------- */
  function animateCounters(scope) {
    $$("[data-count]", scope).forEach(el => {
      const target = parseFloat(el.dataset.count);
      const prefix = el.dataset.prefix || "";
      const suffix = el.dataset.suffix || "";
      const decimals = (el.dataset.count.split(".")[1] || "").length;
      const dur = 1400, start = performance.now();
      function step(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = (target * eased).toFixed(decimals);
        el.textContent = prefix + val + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  /* ---------------- Skill bars ---------------- */
  let skillsAnimated = false;
  function animateSkills() {
    if (skillsAnimated) return; skillsAnimated = true;
    $$(".skill").forEach(s => {
      const lvl = s.dataset.level;
      $(".sk-fill", s).style.width = lvl + "%";
    });
    drawRadar();
  }

  /* ---------------- Radar chart (pure SVG) ---------------- */
  function drawRadar() {
    const svg = $("#radar");
    if (!svg) return;
    const cx = 160, cy = 160, R = 120;
    const axes = ["Deal Adv.", "Valuation", "Audit", "IFRS", "Modeling", "Risk"];
    const values = [0.9, 0.86, 0.95, 0.9, 0.82, 0.86];
    const n = axes.length;
    const ang = i => (Math.PI * 2 * i) / n - Math.PI / 2;
    let html = "";
    // rings
    for (let r = 1; r <= 4; r++) {
      let pts = "";
      for (let i = 0; i < n; i++) {
        const rr = (R * r) / 4;
        pts += `${cx + rr * Math.cos(ang(i))},${cy + rr * Math.sin(ang(i))} `;
      }
      html += `<polygon class="radar-ring" points="${pts.trim()}" />`;
    }
    // axes + labels
    for (let i = 0; i < n; i++) {
      const x = cx + R * Math.cos(ang(i)), y = cy + R * Math.sin(ang(i));
      html += `<line class="radar-axis" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" />`;
      const lx = cx + (R + 22) * Math.cos(ang(i)), ly = cy + (R + 22) * Math.sin(ang(i));
      html += `<text class="radar-label" x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle">${axes[i]}</text>`;
    }
    // data shape (animated by scaling from 0)
    let dataPts = "";
    const dots = [];
    for (let i = 0; i < n; i++) {
      const rr = R * values[i];
      const x = cx + rr * Math.cos(ang(i)), y = cy + rr * Math.sin(ang(i));
      dataPts += `${x},${y} `;
      dots.push(`<circle class="radar-dot" cx="${x}" cy="${y}" r="3.5" />`);
    }
    html += `<polygon class="radar-shape" points="${dataPts.trim()}" transform="scale(0)" transform-origin="${cx} ${cy}">
      ${reduceMotion ? "" : `<animateTransform attributeName="transform" type="scale" from="0" to="1" dur="1s" fill="freeze" calcMode="spline" keySplines="0.2 0.8 0.2 1" additive="sum" />`}
    </polygon>`;
    if (reduceMotion) html = html.replace('transform="scale(0)"', "");
    html += dots.join("");
    svg.innerHTML = html;
  }

  /* ---------------- Three.js cosmic background ---------------- */
  function initThree() {
    if (typeof THREE === "undefined" || reduceMotion) return;
    const canvas = $("#bg-canvas");
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 6;

    // Star field
    const starCount = 1400;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const cyan = new THREE.Color(0x38e8ff), violet = new THREE.Color(0x8b5cff), gold = new THREE.Color(0xffd277);
    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
      const c = Math.random() < 0.6 ? cyan : Math.random() < 0.8 ? violet : gold;
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const starMat = new THREE.PointsMaterial({ size: 0.13, vertexColors: true, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Wireframe focal object — a "deal network" icosahedron
    const ico = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.2, 1),
      new THREE.MeshBasicMaterial({ color: 0x38e8ff, wireframe: true, transparent: true, opacity: 0.22 })
    );
    ico.position.set(3.2, 0.4, -2);
    scene.add(ico);

    const ico2 = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.9, 0.26, 80, 12),
      new THREE.MeshBasicMaterial({ color: 0x8b5cff, wireframe: true, transparent: true, opacity: 0.18 })
    );
    ico2.position.set(-3.6, -1.2, -1);
    scene.add(ico2);

    // Mouse parallax
    let mx = 0, my = 0, tx = 0, ty = 0;
    window.addEventListener("mousemove", e => {
      mx = (e.clientX / window.innerWidth - 0.5);
      my = (e.clientY / window.innerHeight - 0.5);
    });

    let scrollY = 0;
    window.addEventListener("scroll", () => { scrollY = window.scrollY; }, { passive: true });

    const clock3 = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const t = clock3.getElapsedTime();
      stars.rotation.y = t * 0.02 + scrollY * 0.0002;
      stars.rotation.x = scrollY * 0.0001;
      ico.rotation.x = t * 0.15; ico.rotation.y = t * 0.2;
      ico2.rotation.x = -t * 0.25; ico2.rotation.z = t * 0.18;
      tx += (mx - tx) * 0.04; ty += (my - ty) * 0.04;
      camera.position.x = tx * 1.4;
      camera.position.y = -ty * 1.0;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
  initThree();

  /* ---------------- Procedural ambient audio (no file needed) ---------------- */
  const soundBtn = $("#sound-toggle");
  let audioCtx = null, master = null, playing = false, nodes = [];
  function buildAmbient() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    master = audioCtx.createGain();
    master.gain.value = 0.0;
    master.connect(audioCtx.destination);
    // soft layered drone (cosmic pad)
    const freqs = [110, 164.81, 220, 329.63];
    freqs.forEach((f, i) => {
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      osc.type = i % 2 ? "sine" : "triangle";
      osc.frequency.value = f;
      g.gain.value = 0.05 / (i + 1);
      // gentle LFO for movement
      const lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();
      lfo.frequency.value = 0.05 + i * 0.03;
      lfoGain.gain.value = 1.5;
      lfo.connect(lfoGain); lfoGain.connect(osc.detune);
      osc.connect(g); g.connect(master);
      osc.start(); lfo.start();
      nodes.push(osc, lfo);
    });
  }
  soundBtn.addEventListener("click", () => {
    if (!audioCtx) buildAmbient();
    if (audioCtx.state === "suspended") audioCtx.resume();
    playing = !playing;
    master.gain.cancelScheduledValues(audioCtx.currentTime);
    master.gain.linearRampToValueAtTime(playing ? 0.5 : 0.0, audioCtx.currentTime + (playing ? 1.5 : 0.6));
    soundBtn.setAttribute("aria-pressed", playing);
  });

  /* ---------------- Contact form ---------------- */
  const form = $("#contact-form");
  const status = $("#form-status");
  const showErr = (name, msg) => {
    const field = $(`#${name}`).closest(".field");
    field.classList.toggle("invalid", !!msg);
    $(`.err[data-for="${name}"]`).textContent = msg || "";
  };
  function validate() {
    let ok = true;
    const name = $("#name").value.trim();
    const email = $("#email").value.trim();
    const message = $("#message").value.trim();
    if (!name) { showErr("name", "Please enter your name."); ok = false; } else showErr("name", "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showErr("email", "Enter a valid email."); ok = false; } else showErr("email", "");
    if (message.length < 10) { showErr("message", "A little more detail, please (10+ chars)."); ok = false; } else showErr("message", "");
    return ok;
  }
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate()) return;
    status.textContent = "Sending…"; status.className = "form-status";
    // If Formspree isn't configured yet, guide the user
    if (form.action.includes("YOUR_FORM_ID")) {
      status.textContent = "Form not connected yet — add your Formspree ID (see README).";
      status.className = "form-status bad";
      return;
    }
    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });
      if (res.ok) {
        status.textContent = "Message sent. I'll be in touch soon.";
        status.className = "form-status ok";
        form.reset();
      } else {
        status.textContent = "Something went wrong. Try email instead.";
        status.className = "form-status bad";
      }
    } catch {
      status.textContent = "Network error. Try email instead.";
      status.className = "form-status bad";
    }
  });
  ["name", "email", "message"].forEach(id => $(`#${id}`).addEventListener("input", () => {
    if ($(`#${id}`).closest(".field").classList.contains("invalid")) validate();
  }));

  /* ---------------- Scripted assistant ---------------- */
  const fab = $("#assistant-fab");
  const panel = $("#assistant-panel");
  const body = $("#ap-body");
  const input = $("#ap-text");
  fab.addEventListener("click", () => {
    const open = panel.hasAttribute("hidden");
    if (open) { panel.removeAttribute("hidden"); input.focus(); }
    else panel.setAttribute("hidden", "");
  });
  $("#assistant-close").addEventListener("click", () => panel.setAttribute("hidden", ""));

  const kb = [
    { k: ["achiev", "impact", "result", "top"], a: "Highlights: resolved a $500K FX translation gap (Zonergy/China), detected PKR 8M in inventory discrepancies (Ittehad Chemicals, listed), found PKR 20M+ in cost savings, and cut audit fieldwork time 30% via ACL/CaseWare automation." },
    { k: ["valu", "dcf", "model", "fmva"], a: "On valuation: Ahmad builds and reviews DCF, Comparable Companies and Precedent Transaction models, plus QoE and working-capital analysis — and is pursuing the CFA and FMVA® programmes." },
    { k: ["experience", "bdo", "work", "role", "job"], a: "3.5+ years at BDO Pakistan across three roles: Deal Advisory Analyst (M&A, since Jan 2026), Audit Senior — External Audit (2024–25), and Internal Audit Senior — Risk Advisory (2022–24)." },
    { k: ["skill", "capab", "ifrs", "audit"], a: "Core skills: Financial Due Diligence & QoE, DCF/Comps/Precedent valuation, External & Internal Audit (ISA), IFRS 3/9/15/16/40, financial modeling, and risk advisory. Tools: ACL Analytics, CaseWare, Oracle Financials." },
    { k: ["contact", "email", "reach", "hire", "talk"], a: "You can reach Ahmad at ahmad.avanofficial@gmail.com or +92 319 4326085 (Lahore, PKT). The contact form below his profile sends straight to his inbox." },
    { k: ["education", "qualif", "acca", "cfa", "certif"], a: "Credentials: ACCA (Qualified), CA Finalist (ICAP), Certificate in Accounting & Finance, plus CFA Level 1 and FMVA® in progress." },
    { k: ["sector", "client", "industr"], a: "Sectors covered: Banking (SBP, NBP), Healthcare (Shaukat Khanum, Evercare), Manufacturing (Ittehad Chemicals, Zonergy), FMCG (Bata, Avari), NGO (PSDF, Karvaan) and NBFC (Parvaaz)." }
  ];
  function reply(text) {
    const q = text.toLowerCase();
    const hit = kb.find(item => item.k.some(k => q.includes(k)));
    return hit ? hit.a : "I can tell you about Ahmad's experience, skills, achievements, sectors, education, or how to get in touch. Try one of the buttons above.";
  }
  function addMsg(text, who) {
    const div = document.createElement("div");
    div.className = "ap-msg " + who;
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }
  function send() {
    const text = input.value.trim();
    if (!text) return;
    addMsg(text, "user");
    input.value = "";
    setTimeout(() => addMsg(reply(text), "bot"), 350);
  }
  $("#ap-send").addEventListener("click", send);
  input.addEventListener("keydown", e => { if (e.key === "Enter") send(); });
  $$("#ap-quick button").forEach(b => b.addEventListener("click", () => {
    addMsg(b.textContent, "user");
    setTimeout(() => addMsg(reply(b.textContent), "bot"), 350);
  }));
})();
