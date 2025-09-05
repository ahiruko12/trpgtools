document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("copy-container");
  const searchContainer = document.getElementById("search-container");
  const styleLink = document.getElementById("switchable-style");
  let currentScript = null;

  // スクリプトロード用
  function loadScript(file, callback){
    if(currentScript) currentScript.remove();
    const script = document.createElement("script");
    script.src = file;
    script.onload = callback;
    document.body.appendChild(script);
    currentScript = script;
  }

  // 検索窓セットアップ（scar / miracle 用）
  function setupSearch(data, renderFunc) {
    searchContainer.innerHTML = ""; // リセット
    const searchBox = document.createElement("input");
    searchBox.type = "text";
    searchBox.id = "searchBox";
    searchBox.placeholder = "🔎名称を入力";
    searchBox.style.marginBottom = "10px";
    searchContainer.appendChild(searchBox);

    searchBox.addEventListener("keydown", e => { if(e.key === "Enter") e.preventDefault(); });
    searchBox.addEventListener("input", () => {
      const query = searchBox.value.trim().toLowerCase();
      const filteredData = data.filter(d =>
        d.name.toLowerCase().includes(query) ||
        (d.ドラマ && d.ドラマ.解説.toLowerCase().includes(query)) ||
        (d.決戦 && d.決戦.解説.toLowerCase().includes(query))
      );
      renderFunc(container, filteredData);
    });
}

  const buttons = document.querySelectorAll("button[data-target]");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      // 全ボタンの active を解除
      buttons.forEach(b => b.classList.remove("active"));
      // クリックしたボタンに active を付与
      btn.classList.add("active");

      const target = btn.dataset.target;

      if(target === "battle"){
        styleLink.href = "style_a.css";
        loadScript("js-data_Battle.js", ()=> {
          loadScript("js-script_Battle.js", ()=> {
            searchContainer.innerHTML = ""; // 戦技は検索窓非表示
            if(typeof renderBattle === "function") renderBattle(container, dataBattle);
          });
        });
      } else if(target === "scar"){
        styleLink.href = "style_b.css";
        loadScript("js-data_scar.js", ()=> {
          loadScript("js-script_scar.js", ()=> {
            setupSearch(dataScar, renderScar); // 検索窓生成
            if(typeof renderScar === "function") renderScar(container, dataScar);
          });
        });
      } else if(target === "miracle"){
        styleLink.href = "style_b.css";
        loadScript("js-data_miracle.js", ()=> {
          loadScript("js-script_miracle.js", ()=> {
            setupSearch(dataMiracle, renderMiracle); // 検索窓生成
            if(typeof renderMiracle === "function") renderMiracle(container, dataMiracle);
          });
        });
      }
    });
  });
});