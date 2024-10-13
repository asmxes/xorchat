"use client";

export function getCurrentTimeUTC() {
  const now = new Date();

  // Get day, month, and year in UTC
  const day = String(now.getUTCDate()).padStart(2, "0");
  const month = String(now.getUTCMonth() + 1).padStart(2, "0"); // getUTCMonth is 0-based
  const year = now.getUTCFullYear();

  // Get hours and minutes in UTC
  const hours = String(now.getUTCHours()).padStart(2, "0");
  const minutes = String(now.getUTCMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} @ ${hours}:${minutes} UTC`;
}
