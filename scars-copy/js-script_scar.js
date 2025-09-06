// キズアト描画スクリプト（scar）

// フィルタ―設定
const scarFilters = [
  {
    id: "filter-type",
    key: "種別", label: "種別 / ネガイ",
    getter: d => d.種別 || [],
    options: ["ハウンド", "オーナー", "統一"]
  },
  {
    id: "filter-drama-timing",
    key: "タイミング", label: "決:タイミング",
    getter: d => d.決戦 ? d.決戦.タイミング : null,
    options: [ "なし","常時", "開始", "準備", "攻撃", "威力の強化", "ダメージ軽減", "追加行動", "終了", "戦闘不能", "効果参照"]
  },
  {
    id: "filter-battle-target",
    key: "対象", label: "決:対象",
    getter: d => d.決戦 ? d.決戦.対象 : null,
    options: [ "なし","自身", "単体", "単体※", "単体（バレット）", "単体（アタック）", "単体（サポート）", "エネミー", "場面", "場面（選択）", "効果参照"]
  },
  { 
    id: "filterCost", 
    key: "代償", label: "決:代償", 
    getter: d => {
    if(!d.決戦?.代償) return "なし"; // データがない場合
    if(d.決戦.代償.includes("耐久値")) return "耐久値";
    if(d.決戦.代償.includes("励起値")) return "励起値";
    return "なし";
    },
    options: [ "なし","耐久値", "励起値"] // ← この順番で表示される
  },
  { 
    id: "filterLimit", 
    key: "制限", label: "決:制限", 
    getter: d => d.決戦?.制限,
    options: ["なし","ラウンド1回", "シナリオ1回", "シナリオ3回"]
  }
];

// 検索窓は main.js で生成

function renderScar(container, data) {
  container.innerHTML = ""; // 初期化

  data.forEach(d => {
    const div = document.createElement("div");
    div.className = "item";

    // 名前
    const nameSpan = document.createElement("span");
    nameSpan.className = "name";
    nameSpan.textContent = d.name;
    div.appendChild(nameSpan);

    // 種別タグ
    if(d.種別 && d.種別.length > 0){
      d.種別.forEach(tag => {
        const span = document.createElement("span");
        span.className = "typeTag";
        span.textContent = tag;
        div.appendChild(span);
      });
    }

    // ドラマ
    const dramaBlock = document.createElement("div");
    dramaBlock.className = "label-types-copy-block";
    const dramaLabel = document.createElement("span");
    dramaLabel.className = "label";
    dramaLabel.textContent = "- ドラマ";
    dramaBlock.appendChild(dramaLabel);

    const dramaTypesDiv = document.createElement("div");
    dramaTypesDiv.className = "types";
    for(let key in d.ドラマ){
      if(key !== "解説"){
        const span = document.createElement("span");
        span.className = "typeTag";
        span.textContent = d.ドラマ[key];
        dramaTypesDiv.appendChild(span);
      }
    }
    dramaBlock.appendChild(dramaTypesDiv);

    const dramaP = document.createElement("p");
    dramaP.className = "copyable kizato";
    dramaP.textContent = d.ドラマ.解説;
    dramaP.title = "クリックでドラマコピー";
    dramaP.onclick = e => {
      e.stopPropagation();
      navigator.clipboard.writeText(`《${d.name}》：${d.ドラマ.タイミング}／${d.ドラマ.対象}／${d.ドラマ.制限}\n${d.ドラマ.解説}`);
      alert("ドラマ効果をコピーしました");
    };
    dramaBlock.appendChild(dramaP);
    div.appendChild(dramaBlock);

    // 決戦
    const battleBlock = document.createElement("div");
    battleBlock.className = "label-types-copy-block";
    const battleLabel = document.createElement("span");
    battleLabel.className = "label";
    battleLabel.textContent = "- 決戦";
    battleBlock.appendChild(battleLabel);

    const battleTypesDiv = document.createElement("div");
    battleTypesDiv.className = "types";
    for(let key in d.決戦){
      if(key !== "解説"){
        const span = document.createElement("span");
        span.className = "typeTag";
        span.textContent = d.決戦[key];
        battleTypesDiv.appendChild(span);
      }
    }
    battleBlock.appendChild(battleTypesDiv);

    const battleP = document.createElement("p");
    battleP.className = "copyable kizato";
    battleP.textContent = d.決戦.解説;
    battleP.title = "クリックで決戦コピー";
    battleP.onclick = e => {
      e.stopPropagation();
      navigator.clipboard.writeText(`《${d.name}》：${d.決戦.タイミング}／${d.決戦.対象}／${d.決戦.代償}／${d.決戦.制限}\n${d.決戦.解説}`);
      alert("決戦効果をコピーしました");
    };
    battleBlock.appendChild(battleP);
    div.appendChild(battleBlock);

    container.appendChild(div);
  });
}
