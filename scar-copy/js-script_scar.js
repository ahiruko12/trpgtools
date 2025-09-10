// --------------------
// キズアト描画スクリプト（scar）
// --------------------

// フィルタ―設定
window.scarFilters = [
  {
    id: "filter-type",
    key: "種別", label: "種別 / ネガイ",
    getter: d => d.種別 || [],
    options: ["ハウンド", "オーナー", "統一"]
  },
  {
    id: "filter-battle-timing",
    key: "タイミング", label: "決:タイミング",
    getter: d => d.決戦 ? d.決戦.タイミング : null,
    options: [ "なし","常時", "開始", "開始／終了", "準備", "攻撃", "威力の強化", "ダメージ軽減", "追加行動", "終了", "戦闘不能", "効果参照"]
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
      if(!d.決戦?.代償) return "なし";
      if(d.決戦.代償.includes("耐久値")) return "耐久値";
      if(d.決戦.代償.includes("励起値")) return "励起値";
      return "なし";
    },
    options: [ "なし","耐久値", "励起値"]
  },
  { 
    id: "filterLimit", 
    key: "制限", label: "決:制限", 
    getter: d => d.決戦?.制限,
    options: ["なし","ラウンド1回", "シナリオ1回", "シナリオ2回", "シナリオ3回"]
  }
];

// ----------------- コピー用テキスト生成関数 -----------------
function buildCopyText(d) {
  const title = (d.UniqueName && d.UniqueName.trim() !== "") ? d.UniqueName.trim() : (d.name || "");

  let dramaText = "";
  if (d.ドラマ) {
    dramaText = "[ドラマ] ";
    const dramaKeys = ["ヒトガラ", "タイミング", "対象", "制限", "解説"];
    dramaKeys.forEach(key => {
      if (d.ドラマ[key]) {
        dramaText += `${key}:${d.ドラマ[key]} `;
      }
    });
    dramaText = dramaText.trim();
  }

  let battleText = "";
  if (d.決戦) {
    battleText = "[決戦] ";
    const battleKeys = ["タイミング", "対象", "代償", "制限", "解説"];
    battleKeys.forEach(key => {
      if (d.決戦[key]) {
        battleText += `${key}:${d.決戦[key]} `;
      }
    });
    battleText = battleText.trim();
  }

  return `[名称] ${title}\n${dramaText}\n${battleText}`;
}



// ----------------- 描画関数 -----------------
window.renderScar = function(container, data) {
  container.innerHTML = "";

  data.forEach(d => {
    const card = document.createElement("div");
    card.className = "scar-card";

    // ----- ヘッダー -----
    const header = document.createElement("div");
    header.className = "header";

    // 名前
    const nameSpan = document.createElement("span");
    nameSpan.className = "name";
    nameSpan.textContent = d.name;
    header.appendChild(nameSpan);

    // 種別タグ
    if(d.種別 && d.種別.length > 0){
      d.種別.forEach(tag => {
        const tagSpan = document.createElement("span");
        tagSpan.className = "typeTag";
        tagSpan.textContent = tag;
        header.appendChild(tagSpan);
      });
    }

    // コピーアイコン
    const copyIconWrapper = document.createElement("span");
    copyIconWrapper.className = "copy-icon-wrapper";
    const copyIcon = document.createElement("i");
    copyIcon.className = "fa-solid fa-copy";
    copyIconWrapper.appendChild(copyIcon);
    copyIconWrapper.style.cursor = "pointer";

    copyIconWrapper.onclick = async () => {
      const text = buildCopyText(d);

      try {
        await navigator.clipboard.writeText(text);
        alert("コピーしました:\n" + text);
      } catch(err){
        console.error(err);
        alert("コピーに失敗しました");
      }
    };

    header.appendChild(copyIconWrapper);
    card.appendChild(header);

    // ----- 内容 -----
    const content = document.createElement("div");
    content.className = "card-content";

// ドラマテキスト
if(d.ドラマ){
  const dramaP = document.createElement("p");

  const labelSpan = document.createElement("span");
  labelSpan.className = "label"; 
  const dramaSummary = ["ヒトガラ","タイミング","対象","制限"]
    .filter(k => d.ドラマ[k])
    .join(" / ");
  labelSpan.textContent = `[ドラマ] ${dramaSummary}`;
  dramaP.appendChild(labelSpan);

  const descSpan = document.createElement("span");
  descSpan.className = "description";
  descSpan.textContent = ` ${d.ドラマ.解説 || ""}`;
  dramaP.appendChild(descSpan);

  content.appendChild(dramaP);
}

// 決戦テキスト
if(d.決戦){
  const battleP = document.createElement("p");

  const labelSpan = document.createElement("span");
  labelSpan.className = "label"; 
  const battleSummary = ["解説","対象","代償","制限"]
    .filter(k => d.決戦[k])
    .join(" / ");
  labelSpan.textContent = `[決戦] ${battleSummary}`;
  battleP.appendChild(labelSpan);

  const descSpan = document.createElement("span");
  descSpan.className = "description";
  descSpan.textContent = ` ${d.決戦.解説 || ""}`;
  battleP.appendChild(descSpan);

  content.appendChild(battleP);
}


    card.appendChild(content);
    container.appendChild(card);
  });
};
