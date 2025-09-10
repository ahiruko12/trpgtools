document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("copy-container");
  const searchContainer = document.getElementById("search-container");
  const detailedFilters = document.getElementById("detailedFilters");
  const toggleBtn = document.getElementById("toggleFilters");
  const styleLink = document.getElementById("switchable-style");

  let currentScript = null;
  let currentData = [];
  let currentRender = null;
  let currentFilters = null;

  // ---------------------------
  // お気に入り関連
  // ---------------------------
  window.loadFavorites = function (key) {
    const fav = localStorage.getItem(key);
    try { return fav ? JSON.parse(fav) : []; } catch { return []; }
  };
  window.saveFavorites = function (key, list) {
    localStorage.setItem(key, JSON.stringify(list));
  };
  window.sortByFavorites = function (data, favorites) {
    return [...data].sort((a,b)=> (favorites.includes(a.name)?0:1) - (favorites.includes(b.name)?0:1));
  };
  window.createFavoriteStar = function (itemName, favorites, key) {
    favorites = Array.isArray(favorites) ? favorites : [];
    const star = document.createElement("span");
    star.className = "favorite-star";
    if(favorites.includes(itemName)) star.classList.add("favorited");
    star.textContent = "★";
    star.style.display="inline-block";
    star.style.marginLeft="5px";
    star.style.verticalAlign="middle";

    star.onclick = e => {
      e.stopPropagation();
      const index = favorites.indexOf(itemName);
      if(index>=0){ favorites.splice(index,1); star.classList.remove("favorited"); }
      else { favorites.push(itemName); star.classList.add("favorited"); }
      saveFavorites(key,favorites);
      updateClearFavButton(key);
      if(currentRender && currentData) applyAllFilters();
    };
    return star;
  };
  function updateClearFavButton(key){
    const btn = document.getElementById(`clearFavBtn-${key}`);
    if(!btn) return;
    const favorites = loadFavorites(key);
    btn.disabled = favorites.length===0;
    btn.classList.toggle("disabled", favorites.length===0);
  }

  // ---------------------------
  // スクリプトロード
  // ---------------------------
  function loadScript(file, callback){
    if(currentScript) currentScript.remove();
    const script = document.createElement("script");
    script.src=file;
    script.onload=callback;
    document.body.appendChild(script);
    currentScript = script;
  }

  // ---------------------------
  // 検索窓
  // ---------------------------
  function setupSearch(data, renderFunc){
    searchContainer.innerHTML="";
    const searchBox=document.createElement("input");
    searchBox.type="text";
    searchBox.id="searchBox";
    searchBox.placeholder="🔎名称を入力";
    searchBox.style.marginBottom="10px";
    searchContainer.appendChild(searchBox);

    searchBox.addEventListener("keydown", e=>{ if(e.key==="Enter") e.preventDefault(); });
    searchBox.addEventListener("input", ()=>{
      const query=searchBox.value.trim().toLowerCase();
      const filteredData = data.filter(d=>
        d.name.toLowerCase().includes(query) ||
        (d.ドラマ && d.ドラマ.解説.toLowerCase().includes(query)) ||
        (d.決戦 && d.決戦.解説.toLowerCase().includes(query)) ||
        (d.解説 && d.解説.toLowerCase().includes(query))
      );
      renderFunc(container, filteredData);
    });
  }

  // ---------------------------
  // 詳細フィルター表示/非表示
  // ---------------------------
document.getElementById("toggleFilters").addEventListener("click", () => {
  const detailedFilters = document.getElementById("detailedFilters");
  if (!detailedFilters) return;
  detailedFilters.classList.toggle("hidden"); // 表示/非表示切替
  toggleBtn.classList.toggle("open");        // 矢印回転
});

  // ---------------------------
  // select 文字色管理
  // ---------------------------
  function updateSelectColor(select){
    if(!select.value){ 
      select.classList.add("defaultOption"); 
      select.style.color=""; 
    }
    else { 
      select.classList.remove("defaultOption"); 
      select.style.color=document.body.classList.contains("dark-mode")?"#eee":"#000"; 
    }
  }

  // ---------------------------
  // フィルター UI 作成（scarFilters に依存）
  // ---------------------------
  function buildFilterUI(filters, key, data) {
    const container = document.getElementById("detailedFilters");
    container.innerHTML = ""; // クリア

    filters.forEach((f) => {
      const label = document.createElement("label");
      label.className = "selectbox-3";

      const select = document.createElement("select");
      select.id = f.id;  // 例: "filter-type"
      label.appendChild(select);
      container.appendChild(label);

      // 初期化＋選択肢追加
      select.innerHTML = `<option value="">${f.label}</option>`;
      const valuesSet = new Set();
      data.forEach(d => {
        const v = f.getter(d);
        if (Array.isArray(v)) v.forEach(x => valuesSet.add(x));
        else if (v) valuesSet.add(v);
      });

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
      valuesSet.forEach(v => {
        if (!used.has(v)) {
          const opt = document.createElement("option");
          opt.value = v;
          opt.textContent = v;
          select.appendChild(opt);
        }
      });

      select.classList.add("defaultOption");
      updateSelectColor(select);

      // 選択時にフィルター適用
      select.addEventListener("change", () => {
        updateSelectColor(select);
        applyAllFilters();
      });
    });

    // お気に入り解除ボタン
    const clearFavBtn = document.createElement("button");
    clearFavBtn.textContent = "解除";
    clearFavBtn.className = "clear-fav-btn";
    clearFavBtn.id = `clearFavBtn-${key}`;
    clearFavBtn.onclick = () => {
      saveFavorites(key, []);
      applyAllFilters();
      updateClearFavButton(key);
    };
    container.appendChild(clearFavBtn);

    container.classList.add("hidden");  // 初期状態は非表示
    updateClearFavButton(key);
  }

  // ---------------------------
  // フィルター適用
  // ---------------------------
  function applyAllFilters(){
    let filtered = [...currentData];
    if(currentFilters){
      currentFilters.forEach(f=>{
        const select=document.getElementById(f.id);
        if(!select) return;
        const val=select.value;
        if(val){
          filtered=filtered.filter(d=>{
            const v=f.getter(d);
            if(Array.isArray(v)) return v.includes(val);
            return v===val;
          });
        }
      });
    }
    if(currentRender) currentRender(container,filtered);
  }

  // ---------------------------
  // 初期ロード
  // ---------------------------
  styleLink.href="style.css";
  loadScript("js-data_scar.js", () => {
    loadScript("js-script_scar.js", () => {
      currentData = window.dataScar;
      currentRender = window.renderScar;
      currentFilters = window.scarFilters || [];

      setupSearch(currentData, currentRender);
      buildFilterUI(currentFilters, "scarFavorites", currentData); // ← HTML には select がない前提
      if (typeof currentRender === "function")
        currentRender(container, currentData);

// ---------------------------
// コードコピー機能追加
// ---------------------------
const codeToCopy = document.getElementById("code-to-copy"); // コピー対象
const copyBtn = document.getElementById("button-book");        // コピー用ボタン

if (codeToCopy && copyBtn) {
  copyBtn.addEventListener("click", () => {
    const codeText = codeToCopy.innerText;
    navigator.clipboard.writeText(codeText)
      .then(() => alert("コードをコピーしました！ブックマークに追加してください。"))
      .catch(err => alert("コピー失敗: " + err));
  });
}


    });
  });

});
