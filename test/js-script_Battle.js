// 戦技用描画スクリプト（Battle）
// 検索窓は main.js で非表示に統一

function renderBattle(container, data) {
  container.innerHTML = `
    <div class="column" id="leftColumn">
      <h2>アタックPC用戦技</h2>
    </div>
    <div class="column" id="rightColumn">
      <h2>サポートPC用戦技</h2>
    </div>
  `;
  const leftColumn = container.querySelector("#leftColumn");
  const rightColumn = container.querySelector("#rightColumn");

  data.forEach(d => {
    const div = document.createElement("div");
    div.className = "item";

    const nameSpan = document.createElement("span");
    nameSpan.className = "name";
    nameSpan.textContent = d.name;
    div.appendChild(nameSpan);

    const typesDiv = document.createElement("div");
    typesDiv.className = "types";
    ['タイミング','対象','代償'].forEach(key => {
      if(d[key]){
        const span = document.createElement("span");
        span.className = "typeTag";
        span.textContent = d[key];
        typesDiv.appendChild(span);
      }
    });
    div.appendChild(typesDiv);

const p = document.createElement("p");
p.className = "copyable";
p.textContent = d.解説;
p.onclick = e => {
  e.stopPropagation();

  // コピーするテキストを変数に格納
  const textToCopy = `〈${d.name}〉：${d.タイミング}／${d.対象}／${d.代償}\n${d.解説}`;

  // クリップボードにコピー
  navigator.clipboard.writeText(textToCopy)
    .then(() => {
      // アラートでも同じテキストを表示
      alert("コピーしました:\n" + textToCopy);
    });
};
div.appendChild(p);

    if(d.種別 === "アタックPC用戦技") leftColumn.appendChild(div);
    else rightColumn.appendChild(div);
  });
}
