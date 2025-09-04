// ---------------------------
// データ例
// ---------------------------
const data = [
  {
    名称: "残花の一輪",
    ドラマ: { ヒトガラ: "苦手：孤独", タイミング: "調査", 対象: "単体", 制限: "ドラマ1回", 解説: "対象が［調査判定］を行った直後に使用する。「苦手なもの：孤独」をロールプレイすること。その後、あなたは対象がロールしたダイスから1個を選び、出目に＋1する。自身不可。" },
    決戦: { タイミング: "解説参照", 対象: "単体※", 代償: "【励起値】2", 制限: "ラウンド1回", 解説: "［ダメージ算出］の直後に使用する。対象に与えられるダメージをあなたに変更する。対象が［バレット］の場合、受けるダメージを5点軽減する。自身不可。" }
  },
  {
    名称: "紅蓮の刃",
    ドラマ: { ヒトガラ: "得意：戦闘", タイミング: "戦闘開始", 対象: "単体", 制限: "ドラマ1回", 解説: "戦闘開始時に使用する。対象が攻撃した後、自身に+1ダメージを付与する。" },
    決戦: { タイミング: "戦闘中", 対象: "全体", 代償: "【励起値】3", 制限: "ラウンド1回", 解説: "戦闘中に発動。対象全員に追加ダメージを与える。" }
  }
];

// ---------------------------
// リスト表示
// ---------------------------
const list = document.getElementById("list");

function renderList() {
  list.innerHTML = "";

  data.forEach(d => {
    const item = document.createElement("div");
    item.className = "item";

    // 名称
    const nameEl = document.createElement("div");
    nameEl.className = "name";
    nameEl.textContent = d.名称;
    item.appendChild(nameEl);

    // ドラマ
    const dramaEl = document.createElement("div");
    dramaEl.className = "tags";
    dramaEl.innerHTML = Object.entries(d.ドラマ)
      .filter(([key, val]) => key !== "解説")
      .map(([key, val]) => `<span class="typeTag">${key}: ${val}</span>`).join(' ');
    item.appendChild(dramaEl);

    const dramaDesc = document.createElement("div");
    dramaDesc.className = "description";
    dramaDesc.textContent = "解説：" + d.ドラマ.解説;
    item.appendChild(dramaDesc);

    // 決戦
    const battleEl = document.createElement("div");
    battleEl.className = "tags";
    battleEl.innerHTML = Object.entries(d.決戦)
      .filter(([key, val]) => key !== "解説")
      .map(([key, val]) => `<span class="typeTag">${key}: ${val}</span>`).join(' ');
    item.appendChild(battleEl);

    const battleDesc = document.createElement("div");
    battleDesc.className = "description";
    battleDesc.textContent = "解説：" + d.決戦.解説;
    item.appendChild(battleDesc);

    // クリックでコピー
    item.addEventListener("click", () => {
      const text = `[名称]${d.名称} ` +
                   `[ドラマ]` + Object.entries(d.ドラマ)
                     .map(([key, val]) => key !== "解説" ? `${key}:${val}` : "").filter(Boolean).join(' ') +
                   ` 解説:${d.ドラマ.解説} ` +
                   `[決戦]` + Object.entries(d.決戦)
                     .map(([key, val]) => key !== "解説" ? `${key}:${val}` : "").filter(Boolean).join(' ') +
                   ` 解説:${d.決戦.解説}`;
      navigator.clipboard.writeText(text);
      alert("コピーしました:\n" + text);
    });

    list.appendChild(item);
  });
}

// 初回レンダリング
renderList();
