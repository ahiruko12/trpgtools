document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("darkModeToggle");
  const body = document.body;

// ページ読み込み時に状態を復元
if (localStorage.getItem("dark-mode") === "enabled") {
  body.classList.add("dark-mode");
  if (toggle) {
    toggle.checked = true;
    toggle.classList.add("active"); // ←右寄せ用クラスを付与
  }
}

  // 切替イベント
  if (toggle) {
    toggle.addEventListener("change", () => {
      // ダークモードの切替
      body.classList.toggle("dark-mode", toggle.checked);

      // 状態を保存
      localStorage.setItem("dark-mode", toggle.checked ? "enabled" : "disabled");

      });
    });
  }
});
