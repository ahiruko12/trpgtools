// ---------------------------
// キズアト表示用スクリプト
// ---------------------------
const container = document.getElementById("copy-container");

// サンプルデータ
// 実際は js-data_scar.js 内の dataScar を使用
// const dataScar = [...];

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

// ---------------------------
// 検索窓
// ---------------------------
const searchBox = document.getElementById("searchBox");

// Enterキーでフォーム送信やページリロードを防ぐ
searchBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter") e.preventDefault();
});

searchBox.addEventListener("input", () => {
  const query = searchBox.value.trim().toLowerCase();

  const filteredData = dataScar.filter(d => {
    const nameMatch = d.name.toLowerCase().includes(query);
    const dramaMatch = d.ドラマ.解説.toLowerCase().includes(query);
    const battleMatch = d.決戦.解説.toLowerCase().includes(query);

    return nameMatch || dramaMatch || battleMatch;
  });

  // フィルター後のデータを表示
  renderScar(container, filteredData);
});

// ---------------------------
// 種別タグ
// ---------------------------
if (d.種別 && d.種別.length > 0) {
  d.種別.forEach(tag => {
    const span = document.createElement("span");
    span.className = "typeTag";   // 既存の横並びタグ用クラスを流用
    span.textContent = tag;
    div.appendChild(span);
  });
}

// ---------------------------
// ドラマ
// ---------------------------
const dramaBlock = document.createElement("div");
dramaBlock.className = "label-types-copy-block"; // 新しいCSSブロック

// ラベル
const dramaLabel = document.createElement("span");
dramaLabel.className = "label";
dramaLabel.textContent = "- ドラマ";
dramaBlock.appendChild(dramaLabel);

// types
const dramaTypesDiv = document.createElement("div");
dramaTypesDiv.className = "types";
for (let key in d.ドラマ) {
  if (key !== "解説") {
    const span = document.createElement("span");
    span.className = "typeTag";
    span.textContent = d.ドラマ[key];
    dramaTypesDiv.appendChild(span);
  }
}
dramaBlock.appendChild(dramaTypesDiv);

// コピー用テキスト（名前は先頭のみ）
const dramaCopyText = `《${d.name}》：${d.ドラマ.タイミング}／${d.ドラマ.対象}／${d.ドラマ.制限}\n${d.ドラマ.解説}`;

// 表示用テキスト（本文のみ）
const dramaP = document.createElement("p");
dramaP.className = "copyable kizato";
dramaP.textContent = d.ドラマ.解説;
dramaP.title = "クリックでドラマコピー";
dramaP.onclick = (e) => {
  e.stopPropagation();
  navigator.clipboard.writeText(dramaCopyText)
    .then(() => alert("ドラマ効果をコピーしました:\n" + dramaCopyText));
};
dramaBlock.appendChild(dramaP);

// divに追加
div.appendChild(dramaBlock);

// ---------------------------
// 決戦
// ---------------------------
const battleBlock = document.createElement("div");
battleBlock.className = "label-types-copy-block";

const battleLabel = document.createElement("span");
battleLabel.className = "label";
battleLabel.textContent = "- 決戦";
battleBlock.appendChild(battleLabel);

const battleTypesDiv = document.createElement("div");
battleTypesDiv.className = "types";
for (let key in d.決戦) {
  if (key !== "解説") {
    const span = document.createElement("span");
    span.className = "typeTag";
    span.textContent = d.決戦[key];
    battleTypesDiv.appendChild(span);
  }
}
battleBlock.appendChild(battleTypesDiv);

// コピー用テキスト（名前は先頭のみ）
const battleCopyText = `《${d.name}》：${d.決戦.タイミング}／${d.決戦.対象}／${d.決戦.代償}／${d.決戦.制限}\n${d.決戦.解説}`;

// 表示用テキスト（本文のみ）
const battleP = document.createElement("p");
battleP.className = "copyable kizato";
battleP.textContent = d.決戦.解説;
battleP.title = "クリックで決戦コピー";
battleP.onclick = (e) => {
  e.stopPropagation();
  navigator.clipboard.writeText(battleCopyText)
    .then(() => alert("決戦効果をコピーしました:\n" + battleCopyText));
};
battleBlock.appendChild(battleP);
// divに追加
div.appendChild(battleBlock);

    // 最後にコンテナに追加
    container.appendChild(div);
  });
}

// 初回レンダリング（必要に応じて呼び出す）
// renderScar(container, dataScar);
