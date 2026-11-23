(() => {
  "use strict";

  const STORAGE_KEY = "goa_resort_feedback_v1";
  const CATEGORIES = ["Cleanliness", "Food", "Service", "Location", "Value"];
  const FOLLOWUP_KEYWORDS = ["dirty", "rude", "refund", "broken", "leak", "stain", "cold food", "slow"];

  let feedbackEntries = [];
  let activeFlagPill = "ALL";

  // ---------------------------------------------------------------------------
  // 1. Seed Data Generator (64 realistic entries across 90 days / ~3 months)
  // ---------------------------------------------------------------------------
  function isoDaysAgo(daysAgo) {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split("T")[0];
  }

  function generateSeedData() {
    const guests = [
      "Aarav Sharma", "Priya Nair", "Rohan Kulkarni", "Meera Krishnan", "Vikramaditya Rao",
      "Ananya Deshmukh", "Siddharth Menon", "Kavita Joshi", "Nikhil Kamat", "Sneha Sawant",
      "Arjun Malhotra", "Divya Hegde", "Karan Kapoor", "Pooja Verma", "Rahul Prabhu",
      "Nandini Pai", "Aditya Bhat", "Shruti Naik", "Manish Tiwari", "Rhea Fernandes",
      "Oliver Wright", "Sophie Bennett", "Liam O'Connor", "Hannah Clarke", "Lucas Meyer",
      "Elena Petrova", "Marcus Vance", "Claire Dubois", "Daniel Foster", "Maya Lin",
      "Devika Shetty", "Pranav Gokhale", "Ishaan Chatterjee", "Tanvi Kulkarni", "Suresh Shenoy",
      "Neha Agarwal", "Varun Bansal", "Ritika Saxena", "Abhishek Sen", "Mitali Desai",
      "Gaurav Khanna", "Swati Patwardhan", "Harshvardhan Joshi", "Pallavi Borkar", "Sameer Sardesai",
      "Deepika Rane", "Yashwant Nadkarni", "Anjali Fadte", "Kunal Velip", "Trisha Gaonkar",
      "Benjamin Cole", "Chloe Martin", "Nathan Brooks", "Amelia Hayes", "Julian Ross",
      "Zara Sheikh", "Farhan Siddiqui", "Ayesha Khan", "Kabir Bedi", "Simran Gill",
      "Rajeshwar Kamath", "Sunita Shirodkar", "Tushar Mhapne", "Vaishali Korgaonkar"
    ];

    const roomTypes = ["Sea View Suite", "Garden Villa", "Poolside Cabana", "Deluxe Room"];
    const sources = ["Google", "Email", "Comment card", "Phone"];

    const templates = [
      {
        ratings: { Cleanliness: 5, Food: 5, Service: 5, Location: 5, Value: 5 },
        comment: "Waking up to the Arabian Sea from our balcony was magical. Goan fish curry at the beach shack and spotless housekeeping made this our best holiday."
      },
      {
        ratings: { Cleanliness: 5, Food: 4, Service: 5, Location: 5, Value: 4 },
        comment: "Two-minute walk to Baga beach yet remarkably peaceful inside the garden courtyard. Staff arranged our airport taxi effortlessly."
      },
      {
        ratings: { Cleanliness: 4, Food: 5, Service: 4, Location: 5, Value: 4 },
        comment: "Breakfast buffet had fresh appams, bebinca, and great filter coffee. Pool area is lush and well shaded."
      },
      {
        ratings: { Cleanliness: 1, Food: 4, Service: 3, Location: 5, Value: 2 },
        comment: "Beach access is unbeatable, but the bathroom floor was dirty on check-in and damp towels were left behind."
      },
      {
        ratings: { Cleanliness: 4, Food: 3, Service: 2, Location: 5, Value: 3 },
        comment: "Front desk staff seemed rude when we requested a late checkout despite low occupancy. Room itself was comfortable."
      },
      {
        ratings: { Cleanliness: 3, Food: 2, Service: 3, Location: 4, Value: 2 },
        comment: "Dinner buffet took forever to refill and the seafood platter arrived lukewarm. Expected better at this tariff."
      },
      {
        ratings: { Cleanliness: 5, Food: 5, Service: 5, Location: 5, Value: 5 },
        comment: "Pure bliss! The poolside cabana service was attentive without being intrusive, and sunset cocktails were unforgettable."
      },
      {
        ratings: { Cleanliness: 4, Food: 4, Service: 4, Location: 5, Value: 4 },
        comment: "Spacious room, crisp linen, and very courteous housekeeping team. Wi-Fi dipped briefly during a squall."
      },
      {
        ratings: { Cleanliness: 2, Food: 3, Service: 2, Location: 4, Value: 1 },
        comment: "AC leaked water onto our luggage and we had to ask three times for maintenance. Requesting a partial refund for night one."
      },
      {
        ratings: { Cleanliness: 5, Food: 4, Service: 5, Location: 5, Value: 5 },
        comment: "Loved the complimentary evening feni tasting and live acoustic music. Truly warm Goan hospitality."
      },
      {
        ratings: { Cleanliness: 4, Food: 4, Service: 5, Location: 4, Value: 4 },
        comment: "Concierge planned an amazing Spice Plantation and Old Goa heritage tour for our parents."
      },
      {
        ratings: { Cleanliness: 3, Food: 4, Service: 3, Location: 5, Value: 3 },
        comment: "Great location near nightlife, though weekend music from neighbouring shacks carried into the room until midnight."
      },
      {
        ratings: { Cleanliness: 5, Food: 5, Service: 5, Location: 5, Value: 5 },
        comment: "Celebrated our anniversary here—the team surprised us with flower petals and a personalised cake. Flawless stay!"
      },
      {
        ratings: { Cleanliness: 4, Food: 3, Service: 4, Location: 5, Value: 4 },
        comment: "Clean pool, friendly lifeguards, and relaxing Ayurveda massage. Vegetarian dinner choices could be slightly wider."
      },
      {
        ratings: { Cleanliness: 2, Food: 4, Service: 4, Location: 5, Value: 3 },
        comment: "Balcony glass and patio chairs were dusty and dirty after the sea breeze, though staff cleaned it promptly once informed."
      },
      {
        ratings: { Cleanliness: 4, Food: 5, Service: 5, Location: 5, Value: 4 },
        comment: "Chef prepared a custom mild prawn xacuti for our kids. Service across the resort felt genuinely caring."
      }
    ];

    const entries = [];
    for (let i = 0; i < 64; i++) {
      // Spread 64 stays across the trailing 84 days (12 full weeks)
      const daysAgo = Math.floor((i / 64) * 83);
      const tpl = templates[i % templates.length];

      // Slight deterministic variation on middle weeks to make trend realistic
      const ratings = { ...tpl.ratings };
      if (i >= 24 && i <= 38 && ratings.Food > 2 && i % 3 === 0) {
        ratings.Food = Math.max(2, ratings.Food - 1);
      }

      const entry = {
        id: `FB-${1001 + i}`,
        guestName: guests[i % guests.length],
        stayDate: isoDaysAgo(daysAgo),
        roomType: roomTypes[(i * 3 + 1) % roomTypes.length],
        source: sources[(i * 5 + 2) % sources.length],
        ratings,
        comment: tpl.comment,
        actioned: false,
        actionNote: "",
        actionDate: ""
      };

      // Pre-action 2 older urgent items so users see both open and resolved history
      if (i === 48) {
        entry.actioned = true;
        entry.actionNote = "Housekeeping supervisor deep-cleaned suite & sent complimentary fruit basket.";
        entry.actionDate = isoDaysAgo(daysAgo - 1);
      }

      entries.push(entry);
    }

    return entries;
  }

  // ---------------------------------------------------------------------------
  // 2. Calculations & Auto-Flagging Rules
  // ---------------------------------------------------------------------------
  function getOverallRating(ratings) {
    const sum = CATEGORIES.reduce((acc, cat) => acc + Number(ratings[cat] || 0), 0);
    return +(sum / CATEGORIES.length).toFixed(2);
  }

  function evaluateFlags(entry) {
    const flags = [];
    const lowCategories = CATEGORIES.filter((cat) => Number(entry.ratings[cat]) <= 2);
    if (lowCategories.length > 0) {
      flags.push("Urgent");
    }

    const lowerComment = entry.comment.toLowerCase();
    const matchedKeyword = FOLLOWUP_KEYWORDS.find((kw) => lowerComment.includes(kw));
    if (matchedKeyword) {
      flags.push("Follow-up");
    }

    const overall = getOverallRating(entry.ratings);
    if (overall === 5) {
      flags.push("Praise");
    }

    return { flags, lowCategories, matchedKeyword, overall };
  }

  // ---------------------------------------------------------------------------
  // 3. Filtering
  // ---------------------------------------------------------------------------
  function getFilteredEntries() {
    const fromDate = document.getElementById("filterDateFrom").value;
    const toDate = document.getElementById("filterDateTo").value;
    const room = document.getElementById("filterRoom").value;
    const source = document.getElementById("filterSource").value;
    const minRating = parseFloat(document.getElementById("filterMinRating").value) || 0;

    return feedbackEntries
      .filter((entry) => {
        if (fromDate && entry.stayDate < fromDate) return false;
        if (toDate && entry.stayDate > toDate) return false;
        if (room !== "ALL" && entry.roomType !== room) return false;
        if (source !== "ALL" && entry.source !== source) return false;
        const overall = getOverallRating(entry.ratings);
        if (overall < minRating) return false;
        return true;
      })
      .sort((a, b) => b.stayDate.localeCompare(a.stayDate));
  }

  // ---------------------------------------------------------------------------
  // 4. Canvas Chart Renderers (HiDPI-aware, responsive)
  // ---------------------------------------------------------------------------
  function setupCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    const width = Math.max(260, Math.floor(rect.width));
    const height = Math.max(200, Math.floor(rect.height));
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);
    return { ctx, width, height };
  }

  function drawDistributionChart(entries) {
    const canvas = document.getElementById("chartDistribution");
    const { ctx, width, height } = setupCanvas(canvas);

    const counts = [0, 0, 0, 0, 0]; // 1★ to 5★
    entries.forEach((e) => {
      const rounded = Math.min(5, Math.max(1, Math.round(getOverallRating(e.ratings))));
      counts[rounded - 1]++;
    });

    const pad = { top: 24, right: 20, bottom: 36, left: 38 };
    const plotW = width - pad.left - pad.right;
    const plotH = height - pad.top - pad.bottom;
    const maxVal = Math.max(5, ...counts);

    // Gridlines
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.font = "11px sans-serif";
    ctx.fillStyle = "#5a6d7e";
    ctx.textAlign = "right";

    const steps = 4;
    for (let s = 0; s <= steps; s++) {
      const val = Math.round((maxVal / steps) * s);
      const y = pad.top + plotH - (val / maxVal) * plotH;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(width - pad.right, y);
      ctx.stroke();
      ctx.fillText(String(val), pad.left - 8, y + 4);
    }

    const barColors = ["#dc2626", "#f97316", "#eab308", "#0d9488", "#15803d"];
    const slotW = plotW / 5;
    const barW = Math.min(48, slotW * 0.56);

    counts.forEach((count, idx) => {
      const barH = (count / maxVal) * plotH;
      const x = pad.left + idx * slotW + (slotW - barW) / 2;
      const y = pad.top + plotH - barH;

      ctx.fillStyle = barColors[idx];
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, [6, 6, 0, 0]);
      ctx.fill();

      // Count label
      ctx.fillStyle = "#162635";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(count), x + barW / 2, y - 6);

      // X-axis label
      ctx.fillStyle = "#5a6d7e";
      ctx.font = "12px sans-serif";
      ctx.fillText(`${idx + 1} ★`, x + barW / 2, height - 12);
    });
  }

  function drawCategoryChart(entries) {
    const canvas = document.getElementById("chartCategories");
    const { ctx, width, height } = setupCanvas(canvas);

    const avgs = CATEGORIES.map((cat) => {
      if (!entries.length) return 0;
      const sum = entries.reduce((acc, e) => acc + Number(e.ratings[cat]), 0);
      return +(sum / entries.length).toFixed(2);
    });

    const pad = { top: 24, right: 20, bottom: 36, left: 38 };
    const plotW = width - pad.left - pad.right;
    const plotH = height - pad.top - pad.bottom;

    // 0 to 5 scale gridlines
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.font = "11px sans-serif";
    ctx.fillStyle = "#5a6d7e";
    ctx.textAlign = "right";

    for (let v = 0; v <= 5; v++) {
      const y = pad.top + plotH - (v / 5) * plotH;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(width - pad.right, y);
      ctx.stroke();
      ctx.fillText(v.toFixed(1), pad.left - 8, y + 4);
    }

    const slotW = plotW / CATEGORIES.length;
    const barW = Math.min(48, slotW * 0.54);

    avgs.forEach((avg, idx) => {
      const barH = (avg / 5) * plotH;
      const x = pad.left + idx * slotW + (slotW - barW) / 2;
      const y = pad.top + plotH - barH;

      ctx.fillStyle = avg < 3.5 ? "#d97706" : "#0f766e";
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, [6, 6, 0, 0]);
      ctx.fill();

      ctx.fillStyle = "#162635";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(avg.toFixed(2), x + barW / 2, y - 6);

      ctx.fillStyle = "#5a6d7e";
      ctx.font = "11px sans-serif";
      ctx.fillText(CATEGORIES[idx], x + barW / 2, height - 12);
    });
  }

  function compute12WeekBuckets(entries) {
    // Anchor end date to latest filtered entry or today
    const anchorStr = entries.length
      ? entries.reduce((max, e) => (e.stayDate > max ? e.stayDate : max), entries[0].stayDate)
      : isoDaysAgo(0);

    const anchor = new Date(anchorStr + "T12:00:00");
    const weeks = [];

    for (let w = 11; w >= 0; w--) {
      const end = new Date(anchor);
      end.setDate(anchor.getDate() - w * 7);
      const start = new Date(end);
      start.setDate(end.getDate() - 6);

      const startStr = start.toISOString().split("T")[0];
      const endStr = end.toISOString().split("T")[0];

      const bucketItems = entries.filter((e) => e.stayDate >= startStr && e.stayDate <= endStr);
      const avg = bucketItems.length
        ? +(bucketItems.reduce((acc, e) => acc + getOverallRating(e.ratings), 0) / bucketItems.length).toFixed(2)
        : null;

      const label = `${end.toLocaleString("en-US", { month: "short" })} ${end.getDate()}`;
      weeks.push({ label, avg, count: bucketItems.length });
    }
    return weeks;
  }

  function drawTrendChart(entries) {
    const canvas = document.getElementById("chartTrend");
    const { ctx, width, height } = setupCanvas(canvas);
    const weeks = compute12WeekBuckets(entries);

    const pad = { top: 26, right: 26, bottom: 38, left: 40 };
    const plotW = width - pad.left - pad.right;
    const plotH = height - pad.top - pad.bottom;

    // Horizontal scale 1.0 to 5.0
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.font = "11px sans-serif";
    ctx.fillStyle = "#5a6d7e";
    ctx.textAlign = "right";

    for (let v = 1; v <= 5; v++) {
      const y = pad.top + plotH - ((v - 1) / 4) * plotH;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(width - pad.right, y);
      ctx.stroke();
      ctx.fillText(v.toFixed(1), pad.left - 8, y + 4);
    }

    const points = weeks.map((wk, idx) => {
      const x = pad.left + (idx / (weeks.length - 1)) * plotW;
      const y = wk.avg !== null ? pad.top + plotH - ((wk.avg - 1) / 4) * plotH : null;
      return { x, y, ...wk };
    });

    // X-axis week labels
    ctx.textAlign = "center";
    ctx.fillStyle = "#5a6d7e";
    points.forEach((pt, idx) => {
      if (width < 520 && idx % 2 !== 0) return;
      ctx.fillText(pt.label, pt.x, height - 12);
    });

    const validPoints = points.filter((p) => p.y !== null);
    if (validPoints.length > 1) {
      // Shaded area under curve
      ctx.beginPath();
      ctx.moveTo(validPoints[0].x, pad.top + plotH);
      validPoints.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.lineTo(validPoints[validPoints.length - 1].x, pad.top + plotH);
      ctx.closePath();
      ctx.fillStyle = "rgba(15, 118, 110, 0.12)";
      ctx.fill();

      // Trend line
      ctx.beginPath();
      ctx.moveTo(validPoints[0].x, validPoints[0].y);
      validPoints.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.strokeStyle = "#0f766e";
      ctx.lineWidth = 2.6;
      ctx.stroke();
    }

    // Data nodes & values
    validPoints.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#0f766e";
      ctx.stroke();

      ctx.fillStyle = "#162635";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(p.avg.toFixed(2), p.x, p.y - 10);
    });

    return weeks;
  }

  // ---------------------------------------------------------------------------
  // 5. Weekly Summary Generator (4 to 6 sentences grounded in filtered data)
  // ---------------------------------------------------------------------------
  function generateWeeklySummary(entries, weeks) {
    if (!entries.length) {
      return "No guest feedback records match the active filter selection. Adjust your date range, room type, source, or minimum rating filters to generate a performance brief.";
    }

    const overallAvg = (
      entries.reduce((sum, e) => sum + getOverallRating(e.ratings), 0) / entries.length
    ).toFixed(2);

    const catStats = CATEGORIES.map((cat) => {
      const avg = entries.reduce((sum, e) => sum + Number(e.ratings[cat]), 0) / entries.length;
      return { cat, avg };
    }).sort((a, b) => b.avg - a.avg);

    const best = catStats[0];
    const worst = catStats[catStats.length - 1];

    const populatedWeeks = weeks.filter((w) => w.avg !== null);
    let trendSentence = "Weekly trend data shows steady guest satisfaction across the active window.";
    if (populatedWeeks.length >= 2) {
      const latest = populatedWeeks[populatedWeeks.length - 1];
      const prior = populatedWeeks[populatedWeeks.length - 2];
      const diff = +(latest.avg - prior.avg).toFixed(2);
      if (diff > 0.05) {
        trendSentence = `The 12-week trajectory is trending upward, rising by +${diff.toFixed(2)} points in the most recent week (${latest.avg.toFixed(2)} vs. ${prior.avg.toFixed(2)} the prior week).`;
      } else if (diff < -0.05) {
        trendSentence = `The 12-week trajectory dipped by ${diff.toFixed(2)} points in the most recent week (${latest.avg.toFixed(2)} vs. ${prior.avg.toFixed(2)} the prior week), warranting closer shift supervision.`;
      } else {
        trendSentence = `The 12-week trajectory remains stable at ${latest.avg.toFixed(2)} ★ compared to ${prior.avg.toFixed(2)} ★ the prior week.`;
      }
    }

    let openUrgent = 0;
    let praiseCount = 0;
    entries.forEach((e) => {
      const { flags } = evaluateFlags(e);
      if (flags.includes("Urgent") && !e.actioned) openUrgent++;
      if (flags.includes("Praise")) praiseCount++;
    });

    return [
      `Across ${entries.length} filtered guest reviews at Baga Sands Resort, the overall satisfaction score stands at ${overallAvg} out of 5.00.`,
      `${best.cat} is our strongest-performing pillar at ${best.avg.toFixed(2)} ★, whereas ${worst.cat} trails at ${worst.avg.toFixed(2)} ★ and represents the primary operational focus area.`,
      trendSentence,
      `There are currently ${openUrgent} open Urgent escalations (1–2 ★ category ratings) awaiting duty manager closure alongside ${praiseCount} five-star Praise mentions.`,
      `Department heads should review open urgent tickets prior to the weekend check-in wave and share top praise notes during morning briefing.`
    ].join(" ");
  }

  // ---------------------------------------------------------------------------
  // 6. DOM Rendering
  // ---------------------------------------------------------------------------
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderDashboard() {
    const filtered = getFilteredEntries();

    // KPIs
    const overallAvg = filtered.length
      ? (filtered.reduce((s, e) => s + getOverallRating(e.ratings), 0) / filtered.length).toFixed(2)
      : "0.00";

    let openUrgent = 0;
    let openFollowup = 0;
    let praiseCount = 0;
    const openQueue = [];

    filtered.forEach((entry) => {
      const info = evaluateFlags(entry);
      if (info.flags.includes("Urgent") && !entry.actioned) openUrgent++;
      if (info.flags.includes("Follow-up") && !entry.actioned) openFollowup++;
      if (info.flags.includes("Praise")) praiseCount++;

      if (!entry.actioned && (info.flags.includes("Urgent") || info.flags.includes("Follow-up"))) {
        openQueue.push({ entry, info });
      }
    });

    document.getElementById("kpiOverallAvg").textContent = overallAvg;
    document.getElementById("kpiReviewCount").textContent = `Based on ${filtered.length} review${filtered.length === 1 ? "" : "s"}`;
    document.getElementById("kpiUrgentCount").textContent = openUrgent;
    document.getElementById("kpiFollowupCount").textContent = openFollowup;
    document.getElementById("kpiPraiseCount").textContent = praiseCount;

    // Charts
    drawDistributionChart(filtered);
    drawCategoryChart(filtered);
    const weeks = drawTrendChart(filtered);

    // Weekly Summary
    document.getElementById("weeklySummaryText").textContent = generateWeeklySummary(filtered, weeks);

    // Open Urgent & Follow-up Queue
    document.getElementById("queueCount").textContent = openQueue.length;
    const queueContainer = document.getElementById("urgentQueueList");
    if (!openQueue.length) {
      queueContainer.innerHTML = `<div class="empty-state">All Urgent and Follow-up items in this filter view have been actioned.</div>`;
    } else {
      queueContainer.innerHTML = openQueue
        .map(({ entry, info }) => {
          const badges = info.flags
            .filter((f) => f !== "Praise")
            .map((f) => `<span class="badge ${f === "Urgent" ? "badge-urgent" : "badge-followup"}">${f}</span>`)
            .join(" ");

          const chips = CATEGORIES.map((cat) => {
            const val = entry.ratings[cat];
            return `<span class="cat-chip ${val <= 2 ? "low" : ""}">${cat}: ${val}★</span>`;
          }).join("");

          return `
            <article class="queue-item">
              <div>
                <div class="queue-top">
                  <div>
                    <div class="queue-guest">${escapeHtml(entry.guestName)}</div>
                    <div class="queue-meta">${entry.stayDate} · ${escapeHtml(entry.roomType)} · ${escapeHtml(entry.source)}</div>
                  </div>
                  <div>${badges}</div>
                </div>
                <p class="queue-comment" style="margin-top:0.5rem;">"${escapeHtml(entry.comment)}"</p>
              </div>
              <div>
                <div class="cat-pills" style="margin-bottom:0.65rem;">${chips}</div>
                <button class="btn btn-primary btn-sm" data-action-id="${entry.id}">Mark Actioned</button>
              </div>
            </article>
          `;
        })
        .join("");
    }

    // Full Feedback Feed (with pill sub-filter)
    const feedItems = filtered.filter((entry) => {
      if (activeFlagPill === "ALL") return true;
      return evaluateFlags(entry).flags.includes(activeFlagPill);
    });

    document.getElementById("feedCount").textContent = feedItems.length;
    const feedContainer = document.getElementById("feedbackList");

    if (!feedItems.length) {
      feedContainer.innerHTML = `<div class="empty-state">No feedback entries match the current filters.</div>`;
    } else {
      feedContainer.innerHTML = feedItems
        .map((entry) => {
          const info = evaluateFlags(entry);
          const flagBadges = info.flags
            .map((f) => {
              const cls = f === "Urgent" ? "badge-urgent" : f === "Follow-up" ? "badge-followup" : "badge-praise";
              return `<span class="badge ${cls}">${f}</span>`;
            })
            .join(" ");

          const statusBadge = entry.actioned
            ? `<span class="badge badge-actioned">Actioned (${escapeHtml(entry.actionDate)})</span>`
            : info.flags.includes("Urgent") || info.flags.includes("Follow-up")
            ? `<button class="btn btn-secondary btn-sm" data-action-id="${entry.id}">Mark Actioned</button>`
            : "";

          const chips = CATEGORIES.map((cat) => {
            const val = entry.ratings[cat];
            return `<span class="cat-chip ${val <= 2 ? "low" : ""}">${cat}: ${val}★</span>`;
          }).join("");

          const actionNoteHtml = entry.actioned
            ? `<div class="action-note-box"><strong>Staff Resolution (${escapeHtml(entry.actionDate)}):</strong> ${escapeHtml(entry.actionNote)}</div>`
            : "";

          return `
            <article class="review-card">
              <div class="review-header">
                <div class="review-title">
                  <strong>${escapeHtml(entry.guestName)}</strong>
                  <span class="review-score">${info.overall.toFixed(2)} ★</span>
                  ${flagBadges}
                </div>
                <div class="review-title">
                  <span class="queue-meta">${entry.stayDate} · ${escapeHtml(entry.roomType)} · ${escapeHtml(entry.source)}</span>
                  ${statusBadge}
                </div>
              </div>
              <p class="review-comment">${escapeHtml(entry.comment)}</p>
              <div class="cat-pills">${chips}</div>
              ${actionNoteHtml}
            </article>
          `;
        })
        .join("");
    }
  }

  // ---------------------------------------------------------------------------
  // 7. CSV Export
  // ---------------------------------------------------------------------------
  function exportFilteredCsv() {
    const filtered = getFilteredEntries();
    const headers = [
      "ID", "Guest Name", "Stay Date", "Room Type", "Source",
      "Cleanliness", "Food", "Service", "Location", "Value",
      "Overall Rating", "Flags", "Status", "Staff Note", "Action Date", "Comment"
    ];

    const rows = filtered.map((e) => {
      const info = evaluateFlags(e);
      return [
        e.id,
        e.guestName,
        e.stayDate,
        e.roomType,
        e.source,
        e.ratings.Cleanliness,
        e.ratings.Food,
        e.ratings.Service,
        e.ratings.Location,
        e.ratings.Value,
        info.overall.toFixed(2),
        info.flags.join(" | ") || "None",
        e.actioned ? "Actioned" : "Open",
        e.actionNote,
        e.actionDate,
        e.comment
      ].map((val) => `"${String(val ?? "").replace(/"/g, '""')}"`).join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `goa-resort-feedback-${isoDaysAgo(0)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // ---------------------------------------------------------------------------
  // 8. Persistence & Event Wiring
  // ---------------------------------------------------------------------------
  function saveEntries() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbackEntries));
  }

  function loadEntries() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          feedbackEntries = parsed;
          return;
        }
      } catch (_) {
        // Fall through to seed
      }
    }
    feedbackEntries = generateSeedData();
    saveEntries();
  }

  function initEventListeners() {
    // Filter inputs
    ["filterDateFrom", "filterDateTo", "filterRoom", "filterSource", "filterMinRating"].forEach((id) => {
      document.getElementById(id).addEventListener("change", renderDashboard);
    });

    document.getElementById("btnClearFilters").addEventListener("click", () => {
      document.getElementById("filterDateFrom").value = "";
      document.getElementById("filterDateTo").value = "";
      document.getElementById("filterRoom").value = "ALL";
      document.getElementById("filterSource").value = "ALL";
      document.getElementById("filterMinRating").value = "0";
      activeFlagPill = "ALL";
      document.querySelectorAll(".pill").forEach((p) => p.classList.toggle("active", p.dataset.flag === "ALL"));
      renderDashboard();
    });

    // Flag filter pills
    document.querySelectorAll(".pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        activeFlagPill = pill.dataset.flag;
        document.querySelectorAll(".pill").forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        renderDashboard();
      });
    });

    // New Feedback Modal
    const feedbackModal = document.getElementById("feedbackModal");
    document.getElementById("btnOpenModal").addEventListener("click", () => {
      document.getElementById("stayDate").value = isoDaysAgo(0);
      feedbackModal.classList.remove("hidden");
    });
    const closeFeedbackModal = () => feedbackModal.classList.add("hidden");
    document.getElementById("btnCloseModal").addEventListener("click", closeFeedbackModal);
    document.getElementById("btnCancelModal").addEventListener("click", closeFeedbackModal);

    document.getElementById("feedbackForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const newEntry = {
        id: `FB-${1001 + feedbackEntries.length}`,
        guestName: document.getElementById("guestName").value.trim(),
        stayDate: document.getElementById("stayDate").value,
        roomType: document.getElementById("roomType").value,
        source: document.getElementById("source").value,
        ratings: {
          Cleanliness: Number(document.getElementById("rateCleanliness").value),
          Food: Number(document.getElementById("rateFood").value),
          Service: Number(document.getElementById("rateService").value),
          Location: Number(document.getElementById("rateLocation").value),
          Value: Number(document.getElementById("rateValue").value)
        },
        comment: document.getElementById("comment").value.trim(),
        actioned: false,
        actionNote: "",
        actionDate: ""
      };

      feedbackEntries.unshift(newEntry);
      saveEntries();
      e.target.reset();
      closeFeedbackModal();
      renderDashboard();
    });

    // Actioned Workflow Modal (Event delegation)
    const actionModal = document.getElementById("actionModal");
    const closeActionModal = () => actionModal.classList.add("hidden");
    document.getElementById("btnCloseActionModal").addEventListener("click", closeActionModal);
    document.getElementById("btnCancelActionModal").addEventListener("click", closeActionModal);

    document.body.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action-id]");
      if (!btn) return;
      const entry = feedbackEntries.find((item) => item.id === btn.dataset.actionId);
      if (!entry) return;

      document.getElementById("actionEntryId").value = entry.id;
      document.getElementById("actionEntrySummary").textContent =
        `${entry.guestName} (${entry.stayDate} · ${entry.roomType}): "${entry.comment}"`;
      document.getElementById("staffNote").value = "";
      document.getElementById("actionDate").value = isoDaysAgo(0);
      actionModal.classList.remove("hidden");
    });

    document.getElementById("actionForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const id = document.getElementById("actionEntryId").value;
      const entry = feedbackEntries.find((item) => item.id === id);
      if (entry) {
        entry.actioned = true;
        entry.actionNote = document.getElementById("staffNote").value.trim();
        entry.actionDate = document.getElementById("actionDate").value;
        saveEntries();
      }
      closeActionModal();
      renderDashboard();
    });

    // Export CSV, Copy Summary, Reset Data
    document.getElementById("btnExportCsv").addEventListener("click", exportFilteredCsv);

    document.getElementById("btnCopySummary").addEventListener("click", async () => {
      const text = document.getElementById("weeklySummaryText").textContent;
      try {
        await navigator.clipboard.writeText(text);
        const btn = document.getElementById("btnCopySummary");
        const orig = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = orig), 1500);
      } catch (_) {
        alert("Summary copied:\n\n" + text);
      }
    });

    document.getElementById("btnResetData").addEventListener("click", () => {
      feedbackEntries = generateSeedData();
      saveEntries();
      renderDashboard();
    });

    // Redraw canvas charts cleanly on viewport resize
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(renderDashboard, 100);
    });
  }

  // Boot
  loadEntries();
  initEventListeners();
  renderDashboard();
})();