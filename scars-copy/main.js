document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("copy-container");
  const searchContainer = document.getElementById("search-container");
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
    return fav ? JSON.parse(fav) : [];
  };

  window.saveFavorites = function (key, list) {
    localStorage.setItem(key, JSON.stringify(list));
  };

  window.sortByFavorites = function (data, favorites) {
    return [...data].sort((a, b) => {
      const aFav = favorites.includes(a.name) ? 0 : 1;
      const bFav = favorites.includes(b.name) ? 0 : 1;
      return aFav - bFav;
    });
  };

  // ---------------------------
  // お気に入り★生成（ライトモード用）
  // ---------------------------
  window.createFavoriteStar = function (itemName, favorites, key) {
    const star = document.createElement("span");
    star.className = "favorite-star";
    if (favorites.includes(itemName)) star.classList.add("favorited");
    star.textContent = "★";
    star.style.display = "inline-block";
    star.style.marginLeft = "5px";
    star.style.verticalAlign = "middle";

    // ホバー色はCSSに任せる
    star.onclick = (e) => {
      e.stopPropagation();
      const index = favorites.indexOf(itemName);
      if (index >= 0) {
        // お気に入り解除
        favorites.splice(index, 1);
        star.classList.remove("favorited");
      } else {
        // お気に入り登録
        favorites.push(itemName);
        star.classList.add("favorited");
      }
      saveFavorites(key, favorites);
      updateClearFavButton(key);
      if (currentRender && currentData) applyAllFilters();
    };

    return star;
  };

  // ---------------------------
  // ★ボタン状態更新
  // ---------------------------
function updateClearFavButton(key) {
  const btn = document.getElementById(`clearFavBtn-${key}`);
  if (!btn) return;
  const favorites = loadFavorites(key);

  if (favorites.length === 0) {
    btn.classList.add("disabled");
    btn.disabled = true;
  } else {
    btn.classList.remove("disabled");
    btn.disabled = false;
  }
}

  // ---------------------------
  // スクリプトロード
  // ---------------------------
  function loadScript(file, callback) {
    if (currentScript) currentScript.remove();
    const script = document.createElement("script");
    script.src = file;
    script.onload = callback;
    document.body.appendChild(script);
    currentScript = script;
  }

  // ---------------------------
  // 検索窓
  // ---------------------------
  function setupSearch(data, renderFunc) {
    searchContainer.innerHTML = "";
    const searchBox = document.createElement("input");
    searchBox.type = "text";
    searchBox.id = "searchBox";
    searchBox.placeholder = "🔎名称を入力";
    searchBox.style.marginBottom = "10px";
    searchContainer.appendChild(searchBox);

    searchBox.addEventListener("keydown", (e) => {
      if (e.key === "Enter") e.preventDefault();
    });
    searchBox.addEventListener("input", () => {
      const query = searchBox.value.trim().toLowerCase();
      const filteredData = data.filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          (d.ドラマ && d.ドラマ.解説.toLowerCase().includes(query)) ||
          (d.決戦 && d.決戦.解説.toLowerCase().includes(query)) ||
          (d.解説 && d.解説.toLowerCase().includes(query))
      );
      renderFunc(container, filteredData);
    });
  }

  // ---------------------------
  // フィルターUI
  // ---------------------------
  function buildFilterUI(filters, key) {
    const filterContainer = document.getElementById("detailedFilters");
    filterContainer.innerHTML = "";

    // フィルター生成
    filters.forEach((f) => {
      const wrapper = document.createElement("div");
      wrapper.className = "selectbox-3";
      const select = document.createElement("select");
      select.id = f.id;
      const defaultOpt = document.createElement("option");
      defaultOpt.className = "defaultOption";
      defaultOpt.value = "";
      defaultOpt.textContent = f.label;
      select.appendChild(defaultOpt);
      wrapper.appendChild(select);
      filterContainer.appendChild(wrapper);
    });

    // ★お気に入り解除ボタン追加
    const clearFavBtn = document.createElement("button");
    clearFavBtn.textContent = "解除";
    clearFavBtn.className = "clear-fav-btn";
    clearFavBtn.id = `clearFavBtn-${key}`;
    clearFavBtn.style.marginLeft = "10px";

    clearFavBtn.onclick = () => {
      saveFavorites(key, []);
      applyAllFilters();
      updateClearFavButton(key);
    };

    filterContainer.appendChild(clearFavBtn);
    filterContainer.classList.remove("hidden");
    updateClearFavButton(key);
  }

  function populateFilters(data, filters) {
    filters.forEach((f) => {
      const select = document.getElementById(f.id);
      if (!select) return;
      select.innerHTML = "";
      const defaultOpt = document.createElement("option");
      defaultOpt.className = "defaultOption";
      defaultOpt.value = "";
      defaultOpt.textContent = f.label;
      select.appendChild(defaultOpt);

      const valuesSet = new Set();
      data.forEach((d) => {
        const v = f.getter(d);
        if (Array.isArray(v)) v.forEach((x) => valuesSet.add(x));
        else if (v) valuesSet.add(v);
      });

      const used = new Set();
      if (f.options) {
        f.options.forEach((v) => {
          if (valuesSet.has(v)) {
            const opt = document.createElement("option");
            opt.value = v;
            opt.textContent = v;
            select.appendChild(opt);
            used.add(v);
          }
        });
      }

      valuesSet.forEach((v) => {
        if (!used.has(v)) {
          const opt = document.createElement("option");
          opt.value = v;
          opt.textContent = v;
          select.appendChild(opt);
        }
      });
    });
  }

  function attachFilterEvents(filters) {
    filters.forEach((f) => {
      const select = document.getElementById(f.id);
      if (!select) return;
      select.addEventListener("change", () => {
        applyAllFilters();
      });
    });
  }

  function applyAllFilters() {
    let filtered = [...currentData];
    if (currentFilters) {
      currentFilters.forEach((f) => {
        const select = document.getElementById(f.id);
        if (!select) return;
        const val = select.value;
        if (val) {
          filtered = filtered.filter((d) => {
            const v = f.getter(d);
            if (Array.isArray(v)) return v.includes(val);
            return v === val;
          });
        }
      });
    }
    if (currentRender) currentRender(container, filtered);
  }

  // ---------------------------
  // 切替ボタン
  // ---------------------------
  const buttons = document.querySelectorAll("button[data-target]");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const target = btn.dataset.target;

      if (target === "battle") {
        styleLink.href = "style_a.css";
        loadScript("js-data_Battle.js", () => {
          loadScript("js-script_Battle.js", () => {
            searchContainer.innerHTML = "";
            document.getElementById("detailedFilters").innerHTML = "";
            if (typeof renderBattle === "function")
              renderBattle(container, dataBattle);
          });
        });
      } else if (target === "scar") {
        styleLink.href = "style_b.css";
        loadScript("js-data_scar.js", () => {
          loadScript("js-script_scar.js", () => {
            currentData = window.dataScar;
            currentRender = window.renderScar;
            currentFilters = window.scarFilters || [];

            setupSearch(currentData, currentRender);
            buildFilterUI(currentFilters, "scarFavorites");
            populateFilters(currentData, currentFilters);
            attachFilterEvents(currentFilters);

            if (typeof currentRender === "function")
              currentRender(container, currentData);
          });
        });
      } else if (target === "miracle") {
        styleLink.href = "style_b.css";
        loadScript("js-data_miracle.js", () => {
          loadScript("js-script_miracle.js", () => {
            currentData = window.dataMiracle;
            currentRender = window.renderMiracle;
            currentFilters = window.miracleFilters || [];

            setupSearch(currentData, currentRender);
            buildFilterUI(currentFilters, "miracleFavorites");
            populateFilters(currentData, currentFilters);
            attachFilterEvents(currentFilters);

            if (typeof currentRender === "function")
              currentRender(container, currentData);
          });
        });
      }
    });
  });
});
