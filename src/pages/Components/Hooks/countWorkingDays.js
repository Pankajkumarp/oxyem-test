import { axiosJWT } from "../../Auth/AddAuthorization";

let holidaysCache = null;
let holidaysPromise = null;

const STORAGE_KEY = "HOLIDAYS_CACHE_V1";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

const normalizeDate = (date) =>
  new Date(date).toISOString().split("T")[0];

const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

/* =========================
   🔹 LOCAL STORAGE HELPERS
========================= */
const getFromStorage = () => {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return data;
  } catch {
    return null;
  }
};

const saveToStorage = (data) => {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      data,
      timestamp: Date.now()
    })
  );
};

/* =========================
   🔹 FETCH HOLIDAYS ONCE
========================= */
const fetchHolidaysOnce = async () => {
  // ✅ In-memory cache
  if (holidaysCache) {
    return holidaysCache;
  }

  // ✅ LocalStorage cache
  const stored = getFromStorage();
  if (stored) {
    holidaysCache = stored;
    return holidaysCache;
  }

  // ✅ Request already running
  if (holidaysPromise) {
    return holidaysPromise;
  }

  // ✅ API call
  holidaysPromise = (async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(
        `${apiUrl}/holiday`,
        { params: { isFor: "year" } }
      );

      holidaysCache = response?.data?.data || [];
      saveToStorage(holidaysCache);
      return holidaysCache;
    } catch (err) {
      console.error("Holiday fetch failed", err);
      holidaysCache = [];
      return holidaysCache;
    } finally {
      holidaysPromise = null;
    }
  })();

  return holidaysPromise;
};

/* =========================
   🔹 MAIN FUNCTION
========================= */
export const countWorkingDays = async (startDate, endDate) => {
  if (!startDate || !endDate) return 0;

  const holidays = await fetchHolidaysOnce();

  const holidaySet = new Set(
    holidays
      .filter(h => h.type === "Mandatory")
      .map(h => normalizeDate(h.date))
  );

  let count = 0;
  let current = new Date(startDate);
  const last = new Date(endDate);

  while (current <= last) {
    const normalized = normalizeDate(current);

    if (
      !isWeekend(current) &&
      !holidaySet.has(normalized)
    ) {
      count++;
    }

    current.setDate(current.getDate() + 1);
  }

  return count;
};
