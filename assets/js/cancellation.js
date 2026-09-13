const { client: supabaseClient, formatJapaneseDate, loadFooter } = window.ReservationApp;
loadFooter();
;

    const table = document.getElementById("result-table");
    const tbody = table.querySelector("tbody");
    const emptyDiv = document.getElementById("empty");

    document.getElementById("search").onclick = async () => {

//      const email = document.getElementById("email").value.trim();
//      if (!email) {
//        alert("予約時のメールアドレスを入力してください。");
//        return;
//      }
      const name = document.getElementById("name").value.trim();
      if (!name) {
        alert("予約時の名前を入力してください。<br>Enter your reservation name.");
        return;
      }

      tbody.innerHTML = "";
      emptyDiv.textContent = "";
      table.style.display = "none";

 //     const { data, error } = await supabaseClient
 //       .from("enrollments")
 //       .select("*")
 //       .eq("email", email);
      const { data, error } = await supabaseClient
        .from("enrollments")
        .select("*")
        .eq("name", name);

      if (error) {
        alert("エラーが発生しました。<br>System Error.");
        console.error(error);
        return;
      }

      if (data.length === 0) {
        emptyDiv.innerHTML = "予約記録がありません。<br>No reservation found.";
        return;
      }

      data.sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.time_slot.localeCompare(b.time_slot);
      });

      table.style.display = "table";

      data.forEach(row => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${formatJapaneseDate(row.date)}</td>
          <td>${row.time_slot}</td>
          <td>${row.name}</td>
          <td>${row.kana}</td>
          <td>${row.nationality}</td>
          <td>${row.status}</td>
          <td><button class="btn cancel">キャンセル</button></td>
        `;

        tr.querySelector(".btn.cancel").onclick = () => cancelEnrollment(row);
        tbody.appendChild(tr);
      });
    };

async function cancelEnrollment(row) {

  if (!confirm(`${formatJapaneseDate(row.date)} ${row.time_slot} の予約をキャンセルしますか？\nAre you sure you want to cancel your reservation?`)) {
    return;
  }

//  const { error } = await supabaseClient
//    .from("enrollments")
//    .delete()
//    .eq("email", row.email)
//    .eq("date", row.date)
//    .eq("time_slot", row.time_slot);
  const { error } = await supabaseClient
    .from("enrollments")
    .delete()
    .eq("name", row.name)
    .eq("date", row.date)
    .eq("time_slot", row.time_slot);


  if (error) {
    alert("エラーが発生しました。");
    console.error(error);
  } else {

    alert("キャンセルしました。\nReservation cancelled.");

    // ✅ 0.8秒后自动返回主界面
    setTimeout(() => {
      window.location.href = "index.html";
    }, 800);

  }
}

  

