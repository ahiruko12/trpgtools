function renderBattle(container, dataBattle){
  container.innerHTML = "";
  dataBattle.forEach(d=>{
    const div = document.createElement("div");
    div.className = "item";

    const name = document.createElement("strong");
    name.textContent = d.name;
    div.appendChild(name);

    const p = document.createElement("p");
    p.textContent = d.解説;
    p.className = "copyable";
    p.onclick = e=>{
      e.stopPropagation();
      navigator.clipboard.writeText(`${d.name}: ${d.解説}`).then(()=>{
        alert("コピーしました:\n" + d.解説);
      });
    };
    div.appendChild(p);

    container.appendChild(div);
  });
}
