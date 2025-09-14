// APIを叩いてデータを取得
fetch("/.netlify/functions/battle")
  .then(res => res.json())
  .then(data => {
    const app = document.getElementById("app");
    renderBattle(app, data);
  });

// 戦技用描画スクリプト（Battle）
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
      const textToCopy = `〈${d.name}〉：${d.タイミング}／${d.対象}／${d.代償}\n${d.解説}`;
      navigator.clipboard.writeText(textToCopy).then(() => {
        alert("コピーしました:\n" + textToCopy);
      });
    };
    div.appendChild(p);

    if(d.種別 === "アタックPC用戦技") leftColumn.appendChild(div);
    else rightColumn.appendChild(div);
  });
}
