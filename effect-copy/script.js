// ---------------------------
// フィルタ設定
// ---------------------------
const filterIds = ["filter1","filter2","filter3","filter4","filter5","filter6","filter7"];
const filterKeys = ["種別","シンドローム","タイミング","技能","対象","射程","制限"];

// selectの文字色管理関数
function updateSelectColor(select) {
  if (!select.value) {
    select.classList.add("defaultOption");
    select.style.color = "";
  } else {
    select.classList.remove("defaultOption");
    select.style.color = document.body.classList.contains("dark-mode") ? "#eee" : "#000";
  }
}

// selectの初期化とchangeイベントをまとめて設定
filterIds.forEach((id, i) => {
  const select = document.getElementById(id);
  const key = filterKeys[i];
  const uniqueValues = [...new Set(data.map(d => d[key]).filter(v => v && v !== "―"))];

  // ★ ここで uniqueValues をソートする
  if (key === "タイミング") {
    const order = ["マイナー", "メジャー", "リアクション","メジャー／リア", "オート","セットアップ","イニシアチブ","クリンナップ","常時","効果参照"];
    uniqueValues.sort((a, b) => {
      const ai = order.indexOf(a);
      const bi = order.indexOf(b);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1; // 未定義は最後
      if (bi === -1) return -1;
      return ai - bi;
    });
  } else if (key === "技能") {
    const order = ["シンドローム","〈白兵〉","〈射撃〉","〈RC〉","〈交渉〉","〈回避〉","〈運転:〉","〈知覚〉","〈芸術:〉","〈意志〉","〈知識:機械工学〉","〈調達〉","〈情報:〉","〈白兵〉〈射撃〉","〈白兵〉〈RC〉","〈RC〉〈交渉〉","【肉体】","【精神】","【社会】","【肉体】【感覚】","【精神】【社会】","《クロスアタック》","《血の戦馬》","《闇夜の呪い》","効果参照"];
    uniqueValues.sort((a, b) => {
      const ai = order.indexOf(a);
      const bi = order.indexOf(b);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  } else if (key === "対象") {
    const order = ["自身","単体","3体","[LV+1]体","範囲","範囲（選択）","シーン","シーン（選択）","効果参照"];
    uniqueValues.sort((a, b) => {
      const ai = order.indexOf(a);
      const bi = order.indexOf(b);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  } else if (key === "射程") {
    const order = ["至近", "視界", "武器"];
    uniqueValues.sort((a, b) => {
      const ai = order.indexOf(a);
      const bi = order.indexOf(b);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  } else if (key === "制限") {
    const order = ["80%", "100%", "120%","ピュア","リミット","RB","効果参照"];
    uniqueValues.sort((a, b) => {
      const ai = order.indexOf(a);
      const bi = order.indexOf(b);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }

  select.innerHTML = `<option class="defaultOption" value="">${key}</option>` +
                     uniqueValues.map(v => `<option value="${v}">${v}</option>`).join('');

  select.addEventListener("change", () => {
    updateSelectColor(select);
    renderList();
  });

  updateSelectColor(select);
});

// ---------------------------
// 詳細フィルタ表示/非表示
// ---------------------------
const toggleBtn = document.getElementById("toggleFilters");
const detailedFilters = document.getElementById("detailedFilters");
toggleBtn.addEventListener("click", () => {
  const isHidden = detailedFilters.classList.toggle("hidden");
  toggleBtn.classList.toggle("open", !isHidden);
});

// ---------------------------
// 検索窓
// ---------------------------
document.getElementById("searchBox").addEventListener("input", renderList);

// ---------------------------
// リスト表示
// ---------------------------
const list = document.getElementById("list");

function renderList() {
  list.innerHTML = "";
  const searchWords = document.getElementById("searchBox").value
                        .toLowerCase()
                        .split(/\s+/)
                        .filter(Boolean);
  const filters = filterIds.map(id => document.getElementById(id).value);

  data.forEach(d => {
    // フィルタ判定
    if (!filters.every((val, i) => !val || d[filterKeys[i]] === val)) return;

    // 検索判定
    if (!searchWords.every(word => 
        (d.name && d.name.toLowerCase().includes(word)) || 
        (d.効果2 && d.効果2.toLowerCase().includes(word))
    )) return;

    const div = document.createElement("div");
    div.className = "item";

    const info = document.createElement("div");
    info.className = "info";

    // 名称
    const name = document.createElement("span");
    name.className = "name";
    name.textContent = d.name;
    info.appendChild(name);

    // タグ
    const typesContainer = document.createElement("span");
    typesContainer.className = "types";

    // 表示順にデータを取得
    const tags = [
      d.種別,
      d.シンドローム,
      "Lv" + d.Lv,
      d.タイミング,
      d.技能,
      d.難易度,
      d.対象,
      d.射程,
      d.制限
    ];

    tags.forEach(t => {
      if (t && t !== "―") {
        const span = document.createElement("span");
        span.className = "typeTag";
        span.textContent = t;
        typesContainer.appendChild(span);
      }
    });

    info.appendChild(typesContainer);
    div.appendChild(info);

    // コピー部分
    const copy = document.createElement("div");
    copy.className = "copyable";
    copy.textContent = `${d.効果1}｜${d.効果2}`;
    copy.onclick = () => {
      const text = `名称：${d.name} (${d.Lv}) ` +
                   (d.種別 ? `種別：${d.種別} ` : "") +
                   `タイミング：${d.タイミング || "―"} ` +
                   `技能：${d.技能 || "―"} ` +
                   `難易度：${d.難易度 || "―"} ` +
                   `対象：${d.対象 || "―"} ` +
                   `射程：${d.射程 || "―"} ` +
                   `侵蝕値：${d.侵蝕値 || "―"} ` +
                   `制限：${d.制限 || "―"} ` +
                   `効果：${d.効果1}${d.効果2 ? "｜" + d.効果2 : ""}`;
      navigator.clipboard.writeText(text);
      alert("コピーしました:\n" + text);
    };
    div.appendChild(copy);

    list.appendChild(div);
  });
}

// 初回レンダリング
renderList();

// ---------------------------
// コードコピー機能（ページ上の独立ボタン用）
// ---------------------------
const codeToCopy = document.getElementById("code-to-copy");
const copyBtn = document.getElementById("button-book");

if (codeToCopy && copyBtn) {
  copyBtn.addEventListener("click", () => {
    const text = codeToCopy.innerText;
    navigator.clipboard.writeText(text)
      .then(() => alert("コードをコピーしました！ブックマークに追加してください。"))
      .catch(err => alert("コピー失敗: " + err));
  });
}

// ---------------------------
// ダークモード切替
// ---------------------------
const body = document.body;
const toggle = document.getElementById("darkModeToggle");

// 保存状態を反映
if (localStorage.getItem("dark-mode") === "enabled") {
  body.classList.add("dark-mode");
  toggle.checked = true;
}

// 切替時に select 文字色も自動更新
toggle.addEventListener("change", () => {
  body.classList.toggle("dark-mode", toggle.checked);
  filterIds.forEach(id => updateSelectColor(document.getElementById(id)));

  // 状態を保存
  if (toggle.checked) {
    localStorage.setItem("dark-mode", "enabled");
  } else {
    localStorage.setItem("dark-mode", "disabled");
  }
});


