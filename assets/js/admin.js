const { client: supabaseClient, formatJapaneseDate, loadFooter } = window.ReservationApp;
loadFooter();
const password = prompt("パスワードを入力してください：");
    if (password !== "uec.nihongo2026") {
      alert("パスワードが正しくありません。");
      window.location.href = "index.html";
    }
  
;

;

    async function loadEnrollments() {

      const { data, error } = await supabaseClient
        .from("enrollments")
        .select("*");

      if (error) {
        alert("エラーが発生しました。");
        console.error(error);
        return;
      }

      // 日期 → 时间 排序
      data.sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return convertToDecimalTime(a.time_slot) - convertToDecimalTime(b.time_slot);
      });

      const tbody = document.querySelector("#result-table tbody");
      tbody.innerHTML = "";

      data.forEach(row => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${row.date}</td>
          <td>${row.time_slot}</td>
          <td>${row.name}</td>
          <td>${row.kana}</td>
          <td>${row.nationality}</td>
          <td>${row.status}</td>
          <td>${row.email}</td>
          <td>${formatDateTime(row.created_at)}</td>
        `;

        tbody.appendChild(tr);
      });
    }

    function convertToDecimalTime(timeRange) {
      const start = timeRange.split(" - ")[0];
      const [hour, minute] = start.split(":").map(Number);
      return hour + minute / 60;
    }

    function exportCSV() {
      const rows = document.querySelectorAll("#result-table tbody tr");
      const csv = [];

      const bom = "\ufeff";
      const header = ["日程", "時間", "名前", "カタカナ", "国籍・地域", "身分", "メールアドレス", "登録日時"];
      csv.push(header.join(","));

      rows.forEach(row => {
        const cols = row.querySelectorAll("td");
        const rowData = Array.from(cols).map(c => `"${c.textContent}"`);
        csv.push(rowData.join(","));
      });

      const csvString = bom + csv.join("\n");
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "ReservationList.csv";
      link.click();
    }

function formatDateTime(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

    document.getElementById("export-btn").onclick = exportCSV;

    loadEnrollments();
  

