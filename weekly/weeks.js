// weeks.js

const WEEK_START_DAY = 1; // Monday

function getISOWeekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay() || 7; // Sunday = 7
  if (day !== WEEK_START_DAY) {
    d.setDate(d.getDate() - (day - WEEK_START_DAY));
  }
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDateKey(date) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

function getWeekKey(date = new Date()) {
  const start = getISOWeekStart(date);
  return formatDateKey(start);
}

/* =========================
   DAILY TEXT
========================= */

async function loadDailyText(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  const key = `${y}-${m}-${d}`;

  try {
    const res = await fetch(`../data/daily_text/${y}-${m}.json`);
    if (!res.ok) throw new Error("Missing file");

    const monthData = await res.json();
    return monthData[key] || null;
  } catch (e) {
    console.warn("Daily text not found:", key);
    return null;
  }
}

/* =========================
   COMPLETION TRACKING
========================= */

function markCompleted(section, dateKey) {
  const storeKey = `fc_completed_${section}`;
  const data = JSON.parse(localStorage.getItem(storeKey) || "{}");
  data[dateKey] = true;
  localStorage.setItem(storeKey, JSON.stringify(data));
}

function isCompleted(section, dateKey) {
  const storeKey = `fc_completed_${section}`;
  const data = JSON.parse(localStorage.getItem(storeKey) || "{}");
  return !!data[dateKey];
}
