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

export function XOR(message, key) {

  if (!key) return message;

  let result = "";
  for (let i = 0; i < message.length; i++) {
    // XOR each character of the message with the key, cycling through the key
    result += String.fromCharCode(
      message.charCodeAt(i) ^ key.charCodeAt(i % key.length),
    );
  }

  return result;
}
