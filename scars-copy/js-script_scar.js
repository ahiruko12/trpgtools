function renderScar(container, dataScar){
  container.innerHTML = "";
  dataScar.forEach(d=>{
    const div = document.createElement("div");
    div.className = "item";
    const name = document.createElement("strong"); name.textContent=d.name; div.appendChild(name);
    const p = document.createElement("p"); p.textContent=d.解説; p.className="copyable";
    p.onclick=e=>{e.stopPropagation(); navigator.clipboard.writeText(`${d.name}: ${d.解説}`); alert("コピーしました!");};
    div.appendChild(p);
    container.appendChild(div);
  });
}
