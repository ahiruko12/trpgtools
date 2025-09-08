// キセキ描画スクリプト（miracle）

// miracle用フィルタ設定（決戦メイン）
window.miracleFilters = [
  {
    id: "filter-type",
    label: "種別",
    getter: d => d.種別 || []
  },
];

// 検索窓は main.js で生成されます

window.renderMiracle = function(container, data) {
  container.innerHTML = ""; // 初期化

  const favorites = window.loadFavorites("miracleFavorites");
  const sorted = window.sortByFavorites(data, favorites);

  sorted.forEach(d => {
    const div = document.createElement("div");
    div.className = "item";

    // 名前＋種別タグ＋★をまとめるヘッダー
    const headerDiv = document.createElement("div");
    headerDiv.style.display = "flex";
    headerDiv.style.alignItems = "center";
    headerDiv.style.gap = "5px"; // 要素間のスペース
    headerDiv.style.marginBottom = "4px"; // 下に少し余白

    // 名前
    const nameSpan = document.createElement("span");
    nameSpan.className = "name";
    nameSpan.textContent = d.name;
    headerDiv.appendChild(nameSpan);

    // 種別タグ（横並び）
    if(d.種別){
      const tagSpan = document.createElement("span");
      tagSpan.className = "typeTag";
      tagSpan.textContent = d.種別;
      headerDiv.appendChild(tagSpan);
    }

    // ★をタグの隣に追加
    const star = window.createFavoriteStar(d.name, favorites, "miracleFavorites");
    headerDiv.appendChild(star);

    div.appendChild(headerDiv);

    // タイミング・対象・取得・制限
    const typesDiv = document.createElement("div");
    typesDiv.className = "types";
    ['タイミング','対象','取得','制限'].forEach(key => {
      if(d[key]){
        const span = document.createElement("span");
        span.className = "typeTag";
        span.textContent = d[key];
        typesDiv.appendChild(span);
      }
    });
    div.appendChild(typesDiv);

    // 説明文
    const p = document.createElement("p");
    p.className = "copyable";
    p.textContent = d.解説;
    p.title = "クリックでコピー";
    p.onclick = e => {
      e.stopPropagation();
      const text = `《${d.name}》：${d.タイミング || ''}／${d.対象 || ''}／${d.制限 || ''}\n${d.解説}`;
      navigator.clipboard.writeText(text);
      alert("コピーしました:\n" + text);
    };
    div.appendChild(p);

    container.appendChild(div);
  });
}
