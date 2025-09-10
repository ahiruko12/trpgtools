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
  container.innerHTML = ""; // 初期化
  const favorites = window.loadFavorites("scarFavorites");
  const sorted = window.sortByFavorites(data, favorites);

  const cards = [];

  sorted.forEach(d => {
    const div = document.createElement("div");
    div.className = "scar-card";
    div.style.position = "relative";

    // ----------------- ヘッダー -----------------
    const headerDiv = document.createElement("div");
    headerDiv.className = "header"; // CSSで横並び＋中央揃え

    // 名前
    const nameSpan = document.createElement("span");
    nameSpan.className = "name";
    nameSpan.textContent = d.name;
    headerDiv.appendChild(nameSpan);

    // 種別タグ
    if (d.種別 && d.種別.length > 0) {
      d.種別.forEach(tag => {
        const tagSpan = document.createElement("span");
        tagSpan.className = "typeTag";
        tagSpan.textContent = tag;
        headerDiv.appendChild(tagSpan);
      });
    }

    // お気に入り★
    const star = window.createFavoriteStar(d.name, favorites, "scarFavorites");
    headerDiv.appendChild(star);

    // コピーアイコン＋テキスト
    const copyIconWrapper = document.createElement("span");
    copyIconWrapper.className = "copy-icon-wrapper";

    const copyIcon = document.createElement("i");
    copyIcon.className = "fa-solid fa-copy";

    const copyText = document.createElement("span");
    copyText.textContent = " Copy";

    copyIconWrapper.appendChild(copyIcon);
    copyIconWrapper.appendChild(copyText);

    copyIconWrapper.onclick = async e => {
      e.stopPropagation();
      try {
        const text = buildCopyText(d).trim();
        if (!text) throw new Error("コピー対象が空です");
        await navigator.clipboard.writeText(text);
        alert("コピーしました:\n" + text);
      } catch (err) {
        console.error("コピー失敗:", err);
        alert("コピーに失敗しました");
      }
    };

    // ヘッダーにコピーアイコン追加
    headerDiv.appendChild(copyIconWrapper);

    // カードにヘッダー追加
    div.appendChild(headerDiv);

    // ----------------- カード内左右2分割 -----------------
    const columnsDiv = document.createElement("div");
    columnsDiv.className = "columns";

    // ---------- ドラマ列 ----------
    const dramaCol = document.createElement("div");
    dramaCol.className = "column drama";

    if(d.ドラマ){
      const wrapper = document.createElement("div");
      wrapper.className = "column-label-tags";

      const dramaLabel = document.createElement("div");
      dramaLabel.className = "label";
      dramaLabel.textContent = "ドラマ";
      wrapper.appendChild(dramaLabel);

      const typesDiv = document.createElement("div");
      typesDiv.className = "tags";

      Object.keys(d.ドラマ).forEach(key => {
        if(key !== "解説" && d.ドラマ[key]){
          const span = document.createElement("span");
          span.className = "typeTag";
          span.textContent = d.ドラマ[key];
          typesDiv.appendChild(span);
        }
      });
      wrapper.appendChild(typesDiv);
      dramaCol.appendChild(wrapper);

      const dramaText = document.createElement("p");
      dramaText.className = "kizato";
      dramaText.textContent = d.ドラマ.解説 || "";
      dramaCol.appendChild(dramaText);
    }

    // ---------- 決戦列 ----------
    const battleCol = document.createElement("div");
    battleCol.className = "column battle";

    if(d.決戦){
      const wrapper = document.createElement("div");
      wrapper.className = "column-label-tags";

      const battleLabel = document.createElement("div");
      battleLabel.className = "label";
      battleLabel.textContent = "決戦";
      wrapper.appendChild(battleLabel);

      const typesDiv = document.createElement("div");
      typesDiv.className = "tags";

      Object.keys(d.決戦).forEach(key => {
        if(key !== "解説" && d.決戦[key]){
          const span = document.createElement("span");
          span.className = "typeTag";
          span.textContent = d.決戦[key];
          typesDiv.appendChild(span);
        }
      });
      wrapper.appendChild(typesDiv);
      battleCol.appendChild(wrapper);

      const battleText = document.createElement("p");
      battleText.className = "kizato";
      battleText.textContent = d.決戦.解説 || "";
      battleCol.appendChild(battleText);
    }

    columnsDiv.appendChild(dramaCol);
    columnsDiv.appendChild(battleCol);
    div.appendChild(columnsDiv);

    container.appendChild(div);
    cards.push(div);
  });

  // ----------------- カラム高さ揃え関数 -----------------
  function adjustColumnHeights() {
    const columnsPerRow = 2;
    for (let i = 0; i < cards.length; i += columnsPerRow) {
      const rowCards = cards.slice(i, i + columnsPerRow);
      let maxDramaHeight = 0;
      let maxBattleHeight = 0;

      // 高さをリセット
      rowCards.forEach(card => {
        const drama = card.querySelector('.column.drama');
        const battle = card.querySelector('.column.battle');
        if (drama) drama.style.height = 'auto';
        if (battle) battle.style.height = 'auto';
      });

      rowCards.forEach(card => {
        const drama = card.querySelector('.column.drama');
        const battle = card.querySelector('.column.battle');
        if (drama) maxDramaHeight = Math.max(maxDramaHeight, drama.offsetHeight);
        if (battle) maxBattleHeight = Math.max(maxBattleHeight, battle.offsetHeight);
      });

      rowCards.forEach(card => {
        const drama = card.querySelector('.column.drama');
        const battle = card.querySelector('.column.battle');
        if (drama) drama.style.height = maxDramaHeight + 'px';
        if (battle) battle.style.height = maxBattleHeight + 'px';
      });
    }
  }

  // ----------------- リアルタイム対応 -----------------
  function setupRealtimeColumnAdjustment() {
    window.addEventListener('resize', adjustColumnHeights);

    const observer = new MutationObserver(adjustColumnHeights);
    cards.forEach(card => observer.observe(card, { childList: true, subtree: true }));
  }

  // 初期高さ揃え＋リアルタイム対応
  adjustColumnHeights();
  setupRealtimeColumnAdjustment();
};
