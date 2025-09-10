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
  toggleBtn.addEventListener("click", () => {
    if (!detailedFilters) return;
    detailedFilters.classList.toggle("hidden");
    toggleBtn.classList.toggle("open");
  });

  // ---------------------------
  // select 文字色管理
  // ---------------------------
  function updateSelectColor(select){
    if(!select.value){ 
      select.classList.add("defaultOption"); 
      select.style.color=""; 
    } else { 
      select.classList.remove("defaultOption"); 
      select.style.color=document.body.classList.contains("dark-mode")?"#eee":"#000"; 
    }
  }

  // ---------------------------
  // フィルター UI 作成（scarFilters に依存）
  // ---------------------------
  function buildFilterUI(filters, data) {
    const container = document.getElementById("detailedFilters");
    container.innerHTML = "";

    filters.forEach((f) => {
      const label = document.createElement("label");
      label.className = "selectbox-3";

      const select = document.createElement("select");
      select.id = f.id;
      label.appendChild(select);
      container.appendChild(label);

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

      select.addEventListener("change", () => {
        updateSelectColor(select);
        applyAllFilters();
      });
    });

    container.classList.add("hidden");
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
      buildFilterUI(currentFilters, currentData);
      if (typeof currentRender === "function")
        currentRender(container, currentData);

      // ---------------------------
      // コードコピー機能追加
      // ---------------------------
      const codeToCopy = document.getElementById("code-to-copy");
      const copyBtn = document.getElementById("button-book");

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
