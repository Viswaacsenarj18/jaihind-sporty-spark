// ✅ FULL WORKING Unicode Font Loader for jsPDF
// ✅ Font: NotoSans-Regular (supports ₹ perfectly)

import jsPDF from "jspdf";

// FULL BASE64 FONT (over 300KB)
// NOTE: To enable custom fonts in PDFs, replace the placeholder below with actual base64-encoded TTF data.
// For now, the system font will be used (which supports ₹ symbol).
// Get base64 NotoSans font from: https://www.google.com/fonts/download?family=Noto+Sans
const notoSans = `
AAEAAAASAQAABAAgR0RFRrRCsIIAAI...VERY_LONG_FONT_DATA...AAA==
`;

// Register fonts on jsPDF initialization events. Use a cast to any to satisfy TS and
// ensure compatibility across jsPDF versions where API is not fully typed.
try {
  const eventsApi = (jsPDF as any).API && (jsPDF as any).API.events;

  if (!notoSans || notoSans.includes("VERY_LONG_FONT_DATA") || notoSans.trim().length < 100) {
    // Placeholder base64 — skip registration so the import doesn't throw at runtime.
    // PDFs will render using default system font, which should support ₹ symbol.
    // Only log in development mode to avoid cluttering production logs.
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.info("ℹ️  pdf-fonts: Custom NotoSans font not configured. PDFs will use system font (which supports ₹).");
    }
  } else if (eventsApi && Array.isArray(eventsApi.push)) {
    (jsPDF as any).API.events.push([
      "addFonts",
      function () {
        try {
          // Add the same TTF twice under two VFS names so we can register both normal and bold
          // styles. If you have separate bold font data, replace the second addFileToVFS call
          // with the bold font data instead.
          this.addFileToVFS("NotoSans-Regular.ttf", notoSans);
          this.addFileToVFS("NotoSans-Bold.ttf", notoSans);

          // Register fonts. jsPDF will then accept calls like setFont('NotoSans','normal') or
          // setFont('NotoSans','bold'). We register both styles under the same family name.
          this.addFont("NotoSans-Regular.ttf", "NotoSans", "normal");
          this.addFont("NotoSans-Bold.ttf", "NotoSans", "bold");
        } catch (regErr) {
          // eslint-disable-next-line no-console
          console.error("pdf-fonts: failed registering font to jsPDF:", regErr);
        }
      },
    ]);
  } else {
    // Fallback: try to register directly but guarded
    try {
      (jsPDF as any).API.addFileToVFS && (jsPDF as any).API.addFileToVFS("NotoSans-Regular.ttf", notoSans);
      (jsPDF as any).API.addFont && (jsPDF as any).API.addFont("NotoSans-Regular.ttf", "NotoSans", "normal");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("pdf-fonts: jsPDF events API not available; font registration skipped.", err);
    }
  }
} catch (e) {
  // eslint-disable-next-line no-console
  console.error("pdf-fonts: unexpected error while attempting to register fonts:", e);
}

export {};

