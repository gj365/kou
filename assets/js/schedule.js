const { client: supabaseClient, formatJapaneseDate, loadFooter } = window.ReservationApp;
loadFooter();
;

	  // 1.设置截止时间（本地时间）
	  //const DEADLINE = new Date("2026-03-25T23:59:59");
	  const DEADLINE = new Date("2026-09-23T23:59:59");

	  // 2.页面加载时检查
	  if (new Date() > DEADLINE) {
		// 所有可预约格子禁用
		document.querySelectorAll(".slot").forEach(cell => {
		  cell.textContent = "受付終了";   // 显示已结束
		  cell.style.pointerEvents = "none"; // 禁止点击
		  cell.classList.add("full");       // 可加样式变灰
		});

		// 所有按钮禁用
		//document.querySelectorAll(".btn").forEach(btn => {
		//  btn.style.pointerEvents = "none";
		//  btn.style.opacity = "0.5";
		//});

		// 顶部显示提示
		const msg = document.createElement("div");
		msg.textContent = "予約受付は終了しました";
		msg.style.color = "red";
		msg.style.fontWeight = "bold";
		msg.style.textAlign = "center";
		msg.style.marginBottom = "15px";
		document.querySelector(".container").prepend(msg);
	  }
	
;
    let flag = false;

    function goToEnrollPage(time, date) {
      if (flag) {
        const cell = document.querySelector(`td[data-time="${time}"][data-date="${date}"]`);
        if (cell.textContent !== "×") {
		  const capacity = cell.dataset.capacity;
		  window.location.href = `input.html?time=${time}&date=${date}&capacity=${capacity}`;
        } else {
          alert("この時間帯は満員です。\nFully booked.");
        }
      }
    }

    function groupByTwoKeys(list, key1, key2) {
      const groupMap = {};
      list.forEach(item => {
        const groupKey = `${item[key1]}_${item[key2]}`;
        if (!groupMap[groupKey]) {
          groupMap[groupKey] = { [key1]: item[key1], [key2]: item[key2], count: 1 };
        } else {
          groupMap[groupKey].count++;
        }
      });
      return Object.values(groupMap);
    }

    function updateCourse(list) {
      const slots = document.querySelectorAll(".slot");

      for (let cell of slots) {
        const time = cell.getAttribute("data-time");
        const date = cell.getAttribute("data-date");
		const capacity = parseInt(cell.dataset.capacity);

        for (let item of list) {
          if (item.time_slot == time && item.date == date) {
            let remaining = capacity - item.count;
            cell.textContent = remaining > 0 ? remaining + "人" : "×";

            if (remaining <= 0) {
              cell.classList.add("full");
              cell.classList.remove("slot");
            }
            break;
          }
        }
      }
    }

    async function loadSchedule() {
      const { data, error } = await supabaseClient
        .from("enrollments")
        .select("time_slot,date")
        .order("date", { ascending: true })
        .order("time_slot", { ascending: true });

      if (error) {
        console.error(error.message);
        return;
      }

      const grouped = groupByTwoKeys(data, "time_slot", "date");
      updateCourse(grouped);
      flag = true;
    }

    loadSchedule();
  

