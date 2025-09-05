// ---------------------------
// フィルタ設定（既存のまま）
// ここで data → battleData に置き換え
const filterIds = ["filter1","filter2","filter3","filter4","filter5","filter6","filter7"];
const filterKeys = ["種別","シンドローム","タイミング","技能","対象","射程","制限"];

function updateSelectColor(select) {
  if (!select.value) {
    select.classList.add("defaultOption");
    select.style.color = "";
  } else {
    select.classList.remove("defaultOption");
    select.style.color = document.body.classList.contains("dark-mode") ? "#eee" : "#000";
  }
}

filterIds.forEach((id, i) => {
  const select = document.getElementById(id);
  const key = filterKeys[i];
  const uniqueValues = [...new Set(battleData.map(d => d[key]).filter(v => v && v !== "―"))];

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
const toggleBtn = document.getElementById("toggleFilters");
const detailedFilters = document.getElementById("detailedFilters");
toggleBtn.addEventListener("click", () => {
  const isHidden = detailedFilters.classList.toggle("hidden");
  toggleBtn.classList.toggle("open", !isHidden);
});

// ---------------------------
// 検索窓
document.getElementById("searchBox").addEventListener("input", renderList);

// ---------------------------
// リスト表示
const list = document.getElementById("list");

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

  const searchWords = document.getElementById("searchBox").value
                        .toLowerCase()
                        .split(/\s+/)
                        .filter(Boolean);

  data.forEach(d => {
    if (!searchWords.every(word => d.name.toLowerCase().includes(word) || d.解説.toLowerCase().includes(word))) return;

    const div = document.createElement("div");
    div.className = "item";

    const nameSpan = document.createElement("span");
    nameSpan.className = "name";
    nameSpan.textContent = d.name;
    div.appendChild(nameSpan);

    const typesDiv = document.createElement("div");
    typesDiv.className = "types";
    ['タイミング','対象','代償'].forEach(key => {
      if (d[key]) {
        const span = document.createElement("span");
        span.className = "typeTag";
        span.textContent = d[key];
        typesDiv.appendChild(span);
      }
    });
    div.appendChild(typesDiv);

    const p = document.createElement("p");
    p.textContent = d.解説;
    p.className = "copyable";
    div.appendChild(p);

    p.onclick = (e) => {
      e.stopPropagation();
      const text = `〈${d.name}〉：${d.タイミング}／${d.対象}／${d.代償}\n${d.解説}`;
      navigator.clipboard.writeText(text).then(() => {
        alert("コピーしました:\n" + text);
      });
    };

    if (d.種別 === "アタックPC用戦技") leftColumn.appendChild(div);
    else rightColumn.appendChild(div);
  });
}

// 初回レンダリング
renderList();
