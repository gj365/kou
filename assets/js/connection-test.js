const { client: supabaseClient, formatJapaneseDate, loadFooter } = window.ReservationApp;
loadFooter();
const log = document.getElementById("log");
  const btn = document.getElementById("btn");

  btn.onclick = async () => {
    log.textContent = "⏳ 正在访问 Supabase…";

    const { data, error } = await supabaseClient
      .from("enrollments")
      .select("*")
      .limit(1);

    if (error) {
      log.textContent = "❌ Supabase 错误：\n" + error.message;
    } else {
      log.textContent =
        "✅ 数据库访问成功：\n" +
        JSON.stringify(data, null, 2);
    }
  };


