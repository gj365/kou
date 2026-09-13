window.ReservationApp = (() => {
  const SUPABASE_URL = "https://iodijnhbxihastuknqky.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZGlqbmhieGloYXN0dWtucWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4NjgyNTIsImV4cCI6MjA4NTQ0NDI1Mn0.PTG1s0Zv14VX-yfrZNmJqyu-R7wlvJl3_YYcq40g6Y4";
  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  async function loadFooter() {
    const container = document.getElementById("footer-container");
    if (!container) return;

    try {
      const response = await fetch("footer.html");
      container.innerHTML = await response.text();
    } catch (error) {
      console.error("Unable to load footer:", error);
    }
  }

  function formatJapaneseDate(dateString) {
    const [month, day] = dateString.split("/").map(Number);
    const date = new Date(2026, month - 1, day);
    const weekdays = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."];

    return `${month}月${day}日(${weekdays[date.getDay()]})`;
  }

  return { client, formatJapaneseDate, loadFooter };
})();
