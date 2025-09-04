const data = [
  {
    name: "残花の一輪",
    sections: [
      {
        title: "ドラマ",
        tags: ["ヒトガラ:苦手:孤独", "タイミング:調査", "対象:単体", "制限:ドラマ1回"],
        description: "対象が［調査判定］を行った直後に使用する。「苦手なもの：孤独」をロールプレイすること。その後、あなたは対象がロールしたダイスから1個を選び、出目に＋1する。自身不可。"
      },
      {
        title: "決戦",
        tags: ["タイミング:解説参照", "対象:単体※", "代償:【励起値】2", "制限:ラウンド1回"],
        description: "［ダメージ算出］の直後に使用する。対象に与えられるダメージをあなたに変更する。対象が［バレット］の場合、受けるダメージを5点軽減する。自身不可。"
      }
    ]
  }
];

const list = document.getElementById("list");

data.forEach(d => {
  const itemDiv = document.createElement("div");
  itemDiv.className = "item";

  const nameDiv = document.createElement("span");
  nameDiv.className = "name";
  nameDiv.textContent = d.name;
  itemDiv.appendChild(nameDiv);

  d.sections.forEach(sec => {
    const titleDiv = document.createElement("span");
    titleDiv.className = "title";
    titleDiv.textContent = sec.title;
    itemDiv.appendChild(titleDiv);

    const tagsDiv = document.createElement("span");
    tagsDiv.className = "tags";
    tagsDiv.textContent = "タグ：" + sec.tags.join("、");
    itemDiv.appendChild(tagsDiv);

    const descDiv = document.createElement("span");
    descDiv.className = "description";
    descDiv.textContent = "解説：" + sec.description;
    itemDiv.appendChild(descDiv);
  });

  itemDiv.addEventListener("click", () => {
    let copyText = `[名称]${d.name} `;
    d.sections.forEach(sec => {
      copyText += `[${sec.title}]${sec.tags.join(" ")} 解説：${sec.description} `;
    });
    navigator.clipboard.writeText(copyText);
    alert("コピーしました:\n" + copyText);
  });

  list.appendChild(itemDiv);
});
