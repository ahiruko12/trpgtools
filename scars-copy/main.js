document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("copy-container");
  const searchContainer = document.getElementById("search-container");
  const styleLink = document.getElementById("switchable-style");
  let currentScript = null;

 // ★ フィルター用のグローバル変数
let currentFilters = null;
let currentData = [];
let currentRender = null;

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

// ---------------------------
// 共通フィルタ構築関数
// ---------------------------
function buildFilterUI(filters) {
  const filterContainer = document.getElementById("detailedFilters");
  filterContainer.innerHTML = ""; // リセット

  filters.forEach(f => {
    const wrapper = document.createElement("div");
    wrapper.className = "selectbox-3";

    const select = document.createElement("select");
    select.id = f.id;

    // デフォルトオプション
    const defaultOpt = document.createElement("option");
    defaultOpt.className = "defaultOption";
    defaultOpt.value = "";
    defaultOpt.textContent = f.label; // そのままラベル表示
    select.appendChild(defaultOpt);

    wrapper.appendChild(select);
    filterContainer.appendChild(wrapper);
  });

  // hidden クラスを削除して表示
  filterContainer.classList.remove("hidden");
}

// データからユニークな選択肢を抽出してセット（固定順オプション対応）
function populateFilters(data, filters) {
  filters.forEach(f => {
    const select = document.getElementById(f.id);
    if (!select) return;

    // selectをリセット
    select.innerHTML = "";
    const defaultOpt = document.createElement("option");
    defaultOpt.className = "defaultOption";
    defaultOpt.value = "";
    defaultOpt.textContent = f.label;
    select.appendChild(defaultOpt);

    // データからユニーク値を集める
    const valuesSet = new Set();
    data.forEach(d => {
      const v = f.getter(d);
      if (Array.isArray(v)) v.forEach(x => valuesSet.add(x));
      else if (v) valuesSet.add(v);
    });

    // まず固定順オプションがあれば追加
    const used = new Set();
    if (f.options) {
      f.options.forEach(v => {
        if (valuesSet.has(v)) {
          const opt = document.createElement("option");
          opt.value = v;
          opt.textContent = v;
          select.appendChild(opt);
          used.add(v);
        }
      });
    }

    // 残りの値（固定順にないもの）を追加
    valuesSet.forEach(v => {
      if (!used.has(v)) {
        const opt = document.createElement("option");
        opt.value = v;
        opt.textContent = v;
        select.appendChild(opt);
      }
    });
  });
}


// イベントを付与して絞り込み実行
function attachFilterEvents(filters) {
  filters.forEach(f => {
    const select = document.getElementById(f.id);
    if (!select) return;

    select.addEventListener("change", () => {
      applyAllFilters();
    });
  });
}

// すべてのフィルタを順に適用
function applyAllFilters() {
  let filtered = [...currentData];

  if (currentFilters) {
    currentFilters.forEach(f => {
      const select = document.getElementById(f.id);
      if (!select) return;
      const val = select.value;
      if (val) {
        filtered = filtered.filter(d => {
          const v = f.getter(d);
          if (Array.isArray(v)) return v.includes(val);
          return v === val;
        });
      }
    });
  }

  currentRender(container, filtered);
}

  // ---------------------------
  // 切替ボタン
  // ---------------------------

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
            document.getElementById("detailedFilters").innerHTML = ""; // フィルタも消す
            if(typeof renderBattle === "function") renderBattle(container, dataBattle);
          });
        });
      } else if(target === "scar"){
        styleLink.href = "style_b.css";
        loadScript("js-data_scar.js", ()=> {
          loadScript("js-script_scar.js", ()=> {
            currentData = dataScar;
            currentRender = renderScar;
            currentFilters = scarFilters; // ★ js-script_scar.js 側で定義

            setupSearch(dataScar, renderScar); // 検索窓生成
            buildFilterUI(scarFilters);
            populateFilters(dataScar, scarFilters);
            attachFilterEvents(scarFilters);

            if(typeof renderScar === "function") renderScar(container, dataScar);
          });
        });

      } else if(target === "miracle"){
        styleLink.href = "style_b.css";
        loadScript("js-data_miracle.js", ()=> {
          loadScript("js-script_miracle.js", ()=> {
            currentData = dataMiracle;
            currentRender = renderMiracle;
            currentFilters = miracleFilters; // ★ js-script_miracle.js 側で定義

            setupSearch(dataMiracle, renderMiracle); // 検索窓生成
            buildFilterUI(miracleFilters);
            populateFilters(dataMiracle, miracleFilters);
            attachFilterEvents(miracleFilters);

            if(typeof renderMiracle === "function") renderMiracle(container, dataMiracle);
          });
        });
      }
    });
  });
});