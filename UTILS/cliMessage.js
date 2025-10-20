const chalk = require("chalk");
const wrapAnsi = require("wrap-ansi");

function formatBlock(color, icon, title, txt) {
  const line = chalk[color]("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  const header = chalk[color].bold(`${icon}  ${title}`);
  const cols = process.stdout.columns || 80;
  const width = Math.min(cols - 10, 80);
  const wrapped = wrapAnsi(txt, width, { hard: false });

  // ✅ Safely use bright version if available
  const chalkFn = chalk[`${color}Bright`] || chalk[color];
  const message = chalkFn ? chalkFn(wrapped) : wrapped;

  return `\n${line}\n${header}\n${line}\n${message}\n${line}\n`;
}

// ────────────────────────────────
// Message Types
// ────────────────────────────────
const info = (txt) => formatBlock("whiteBright", "ℹ️", "INFO", txt);
const success = (txt) => formatBlock("green", "✅", "SUCCESS", txt);
const warning = (txt) => formatBlock("yellow", "⚠️", "WARNING", txt);
const error = (txt) => formatBlock("red", "❌", "ERROR", txt);
const debug = (txt) => formatBlock("gray", "🐞", "DEBUG", txt);
const note = (txt) => formatBlock("gray", "📝", "NOTE", txt); // 👈 new message type

// ────────────────────────────────
// Universal Print Function
// ────────────────────────────────
const print = ({ type = "info", txt = "", silent = false } = {}) => {
  const types = { info, success, warning, error, debug, note };

  // fallback to info if unknown type
  const fn = types[type] || types.info;

  // normalize txt
  let message = "";
  if (txt instanceof Error) {
    message = txt.stack || txt.message || txt.toString();
  } else if (typeof txt === "object") {
    message = JSON.stringify(txt, null, 2);
  } else {
    message = String(txt);
  }

  if (!silent) console.log(fn(message));
  return fn(message);
};

// ────────────────────────────────
// Convenience Wrappers
// ────────────────────────────────
const printError = (txt) => print({ type: "error", txt });
const printInfo = (txt) => print({ type: "info", txt });
const printSuccess = (txt) => print({ type: "success", txt });
const printWarning = (txt) => print({ type: "warning", txt });
const printDebug = (txt) => print({ type: "debug", txt });
const printNote = (txt) => print({ type: "note", txt });

module.exports = {
  info,
  success,
  warning,
  error,
  debug,
  note,
  print,
  printError,
  printInfo,
  printSuccess,
  printWarning,
  printDebug,
  printNote,
};
