// キセキ描画スクリプト（miracle）
// 検索窓は main.js で生成されます

function renderMiracle(container, data) {
  container.innerHTML = ""; // 初期化

  data.forEach(d => {
    const div = document.createElement("div");
    div.className = "item";

    // 名前
    const nameSpan = document.createElement("span");
    nameSpan.className = "name";
    nameSpan.textContent = d.name;
    div.appendChild(nameSpan);

    // 種別
    if(d.種別){
      const span = document.createElement("span");
      span.className = "typeTag";
      span.textContent = d.種別;
      div.appendChild(span);
    }

    // タイミング・対象・取得
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
      // 取得をコピー用テキストに含めない
      const text = `《${d.name}》：${d.タイミング}／${d.対象}／${d.制限}\n${d.解説}`;
      navigator.clipboard.writeText(text);
      alert("コピーしました:\n" + text);
    };
    div.appendChild(p);

    // 最後にコンテナに追加
    container.appendChild(div);
  });
}
