const { client: supabaseClient, formatJapaneseDate, loadFooter } = window.ReservationApp;
loadFooter();
;

    const urlParams = new URLSearchParams(window.location.search);
    const timeSlot = urlParams.get('time');
    const date = urlParams.get('date');
    const capacity = parseInt(urlParams.get('capacity'));

    document.getElementById("time-slot").textContent = timeSlot;
    document.getElementById("date").textContent = formatJapaneseDate(date);

    document.getElementById("back").onclick = () => {
      window.location.href = "index.html";
    };

    async function checkEnrollmentExistence() {
      const { count, error } = await supabaseClient
        .from("enrollments")
        .select("*", { count: "exact" })
        .eq("time_slot", timeSlot)
        .eq("date", date);

      if (error) {
        console.error("查询失败:", error.message);
        return false;
      }

      if (count >= capacity) {
        document.getElementById("alert-message").textContent =
          "この時間帯は満席です。ほかの時間を選択してください。\nFully booked.";
        setTimeout(() => {
          window.location.href = "index.html";
        }, 3000);
        return false;
      }

      return true;
    }

document.getElementById("confirm").onclick = async () => {

  const name = document.getElementById("name").value.trim();
  const kana = document.getElementById("kana").value.trim();
  const nationality = document.getElementById("nationality").value.trim();
  const status = document.getElementById("status").value;
//  const email = document.getElementById("email").value.trim();

  // ===== 1. 必填检查 =====
//  if (!name || !kana || !nationality || !status || !email) {
  if (!name || !kana || !nationality || !status) {
    alert("すべての項目を入力してください。\nPlease fill in all fields.");
    return;
  }

  // ===== 2. 满员检查 =====
  const canInsert = await checkEnrollmentExistence();
  if (!canInsert) return;

  // ===== 3. 生成确认信息 =====
  const confirmMessage =
    "以下の内容で予約します。\n\n" +
    `日程/Date：${formatJapaneseDate(date)}\n` +
    `時間/Time：${timeSlot}\n` +
    `名前：${name}\n` +
    `カタカナ：${kana}\n` +
    `国籍・地域：${nationality}\n` +
    `身分：${status}\n` +
//    `メールアドレス：${email}\n\n` +
    "よろしいですか？";

  // ===== 4. 弹出确认窗口 =====
  const userConfirmed = confirm(confirmMessage);
  if (!userConfirmed) {
    return; // 用户取消
  }

  // ===== 5. 真正写入数据库 =====
  const { error } = await supabaseClient
    .from("enrollments")
    .insert([{
      time_slot: timeSlot,
      date: date,
      name: name,
      kana: kana,
      nationality: nationality,
      status: status
//      ,
//      email: email
    }]);

  if (error) {
    alert("予約に失敗しました。再度お試しください。");
    console.error(error);
  } else {
    alert("予約完了 / Reservation successful");
    window.location.href = "index.html";
  }
};
  

