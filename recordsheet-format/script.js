// ==================== 基本操作 ====================
function toggleSection(header) {
  const content = header.nextElementSibling;
  if(content.style.display === "none" || !content.style.display){
    content.style.display = "block";
    header.classList.remove("collapsed");
  } else {
    content.style.display = "none";
    header.classList.add("collapsed");
  }
}

function removeBlock(id){
  const block = document.getElementById(id);
  if(block) block.remove();
}

function moveBlockUp(id){
  const block = document.getElementById(id);
  if(block && block.previousElementSibling){
    block.parentNode.insertBefore(block, block.previousElementSibling);
  }
}

function moveBlockDown(id){
  const block = document.getElementById(id);
  if(block && block.nextElementSibling){
    const next = block.nextElementSibling;
    block.parentNode.insertBefore(block, next.nextElementSibling);
  }
}

// ==================== DX3カウンター ====================
let abilityCount=0, skillCount=0, effectCount=0, memoryCount=0, itemCount=0, roisCount=0;

// ==================== DX3ブロック追加 ====================
function addAbility(){
  abilityCount++;
  const container = document.getElementById("growth-ability-container");
  const block = document.createElement("div");
  block.className = "growth-block";
  block.id = `ability-${abilityCount}`;
  block.innerHTML = `
    <div class="row">
      <select id="ability-type-${abilityCount}">
        <option value="肉体">肉体</option>
        <option value="感覚">感覚</option>
        <option value="精神">精神</option>
        <option value="社会">社会</option>
      </select>
    </div>
    <div class="row">
      <input type="number" class="small-number" id="ability-current-${abilityCount}" placeholder="現在値">
      <input type="number" class="small-number" id="ability-after-${abilityCount}" placeholder="成長後の値">
    </div>
    <div class="row actions">
      <button type="button" onclick="moveBlockUp('ability-${abilityCount}')">▲ 上へ</button>
      <button type="button" onclick="moveBlockDown('ability-${abilityCount}')">▼ 下へ</button>
      <button type="button" onclick="removeBlock('ability-${abilityCount}')">削除</button>
    </div>
  `;
  container.appendChild(block);
}

function addSkill(){
  skillCount++;
  const container = document.getElementById("growth-skill-container");
  const block = document.createElement("div");
  block.className = "growth-block";
  block.id = `skill-${skillCount}`;
  block.innerHTML = `
    <div class="row">
      <input type="text" id="skill-name-${skillCount}" placeholder="技能名">
    </div>
    <div class="row">
      <input type="number" class="small-number" id="skill-current-${skillCount}" placeholder="現在Lv">
      <input type="number" class="small-number" id="skill-after-${skillCount}" placeholder="成長後Lv">
    </div>
    <div class="row actions">
      <button type="button" onclick="moveBlockUp('skill-${skillCount}')">▲ 上へ</button>
      <button type="button" onclick="moveBlockDown('skill-${skillCount}')">▼ 下へ</button>
      <button onclick="removeBlock('skill-${skillCount}')">削除</button>
    </div>
  `;
  container.appendChild(block);
}

function addEffect(){
  effectCount++;
  const container = document.getElementById("growth-effect-container");
  const block = document.createElement("div");
  block.className = "growth-block";
  block.id = `effect-${effectCount}`;
  block.innerHTML = `
    <div class="row">
      <select id="effect-type-${effectCount}">
        <option value="">選択</option>
        <option value="成長">成長</option>
        <option value="取得">取得</option>
      </select>
    </div>
    <div class="row">
      <input type="text" id="effect-name-${effectCount}" placeholder="エフェクト名" disabled>
    </div>
    <div class="row">
      <input type="number" class="small-number" id="effect-current-${effectCount}" placeholder="現在Lv" disabled>
      <input type="number" class="small-number" id="effect-after-${effectCount}" placeholder="成長後/取得後Lv" disabled>
    </div>
    <div class="row actions">
      <button type="button" onclick="moveBlockUp('effect-${effectCount}')">▲ 上へ</button>
      <button type="button" onclick="moveBlockDown('effect-${effectCount}')">▼ 下へ</button>
      <button type="button" onclick="removeBlock('effect-${effectCount}')">削除</button>
    </div>
  `;
  container.appendChild(block);

  const typeSelect = document.getElementById(`effect-type-${effectCount}`);
  const nameInput = document.getElementById(`effect-name-${effectCount}`);
  const curInput = document.getElementById(`effect-current-${effectCount}`);
  const afterInput = document.getElementById(`effect-after-${effectCount}`);
  typeSelect.addEventListener('change',()=>{
    const type = typeSelect.value;
    if(type==="成長"){
      nameInput.disabled=false; curInput.disabled=false; afterInput.disabled=false;
    } else if(type==="取得"){
      nameInput.disabled=false; curInput.disabled=true; afterInput.disabled=false;
    } else {
      nameInput.disabled=true; curInput.disabled=true; afterInput.disabled=true;
    }
  });
}

function addMemory(){
  memoryCount++;
  const container = document.getElementById("growth-memory-container");
  const block = document.createElement("div");
  block.className = "growth-block";
  block.id = `memory-${memoryCount}`;
  block.innerHTML = `
    <div class="row">
      <input type="text" id="memory-name-${memoryCount}" placeholder="関係：名前">
    </div>
    <div class="row actions">
      <button type="button" onclick="moveBlockUp('memory-${memoryCount}')">▲ 上へ</button>
      <button type="button" onclick="moveBlockDown('memory-${memoryCount}')">▼ 下へ</button>
      <button type="button" onclick="removeBlock('memory-${memoryCount}')">削除</button>
    </div>
  `;
  container.appendChild(block);
}

function addItem(){
  itemCount++;
  const container = document.getElementById("growth-item-container");
  const block = document.createElement("div");
  block.className = "growth-block";
  block.id = `item-${itemCount}`;
  block.innerHTML = `
    <div class="row">
      <select id="item-type-${itemCount}">
        <option value="">選択</option>
        <option value="武器">武器</option>
        <option value="防具">防具</option>
        <option value="ヴィークル">ヴィークル</option>
        <option value="コネ">コネ</option>
        <option value="一般アイテム">一般アイテム</option>
      </select>
    </div>
    <div class="row">
      <input type="text" id="item-name-${itemCount}" placeholder="名前" disabled>
    </div>
    <div class="row actions">
      <button type="button" onclick="moveBlockUp('item-${itemCount}')">▲ 上へ</button>
      <button type="button" onclick="moveBlockDown('item-${itemCount}')">▼ 下へ</button>
      <button type="button" onclick="removeBlock('item-${itemCount}')">削除</button>
    </div>
  `;
  container.appendChild(block);

  const typeSelect = document.getElementById(`item-type-${itemCount}`);
  const nameInput = document.getElementById(`item-name-${itemCount}`);
  typeSelect.addEventListener('change',()=>{ nameInput.disabled = !typeSelect.value; });
}

function addRois(){
  roisCount++;
  const container = document.getElementById("rois-container");
  const block = document.createElement("div");
  block.className = "growth-block";
  block.id = `rois-${roisCount}`;
  block.innerHTML = `
    <div class="row">
      <label><input type="checkbox" id="rois-d-${roisCount}" onchange="toggleRois(${roisCount})"> Dロイス</label>
    </div>
    <div class="row">
      <input type="text" id="rois-name-${roisCount}" placeholder="名前">
    </div>
    <div class="row">
      <input type="text" id="rois-pos-${roisCount}" placeholder="ポジティブ">
      <input type="text" id="rois-neg-${roisCount}" placeholder="ネガティブ">
    </div>
    <div class="row">
      <input type="text" id="rois-desc-${roisCount}" placeholder="説明" style="flex:2">
    </div>
    <div class="row">
      <label><input type="checkbox" id="rois-titus-${roisCount}"> タイタス</label>
    </div>
    <div class="row actions">
      <button type="button" onclick="moveBlockUp('rois-${roisCount}')">▲ 上へ</button>
      <button type="button" onclick="moveBlockDown('rois-${roisCount}')">▼ 下へ</button>
      <button type="button" onclick="removeBlock('rois-${roisCount}')">削除</button>
    </div>
  `;
  container.appendChild(block);
}

function toggleRois(i){
  const isChecked = document.getElementById(`rois-d-${i}`).checked;
  document.getElementById(`rois-pos-${i}`).disabled = isChecked;
  document.getElementById(`rois-neg-${i}`).disabled = isChecked;
  if(isChecked){
    document.getElementById(`rois-pos-${i}`).value = "";
    document.getElementById(`rois-neg-${i}`).value = "";
  }
}

// ==================== KIZカウンター ====================
let kizKizunaCount = 0;
let kizHibiCount = 0;
let kizHibiwareCount = 0;
let kizHitogaraCount = 0;

// ==================== KIZブロック追加 ====================
function addKizuna() {
  kizKizunaCount++;
  const container = document.getElementById("kiz-kizuna-container");
  const row = document.createElement("div");
  row.className = "growth-block";
  row.id = `kizuna-${kizKizunaCount}`;
  row.innerHTML = `
    <input type="text" name="kizuna-name" placeholder="キズナ名">
    <textarea name="kizuna-desc" rows="2" placeholder="説明・エピソード"></textarea>
    <div class="row actions">
      <button type="button" onclick="moveBlockUp('kizuna-${kizKizunaCount}')">▲ 上へ</button>
      <button type="button" onclick="moveBlockDown('kizuna-${kizKizunaCount}')">▼ 下へ</button>
      <button type="button" onclick="removeBlock('kizuna-${kizKizunaCount}')">削除</button>
    </div>
  `;
  container.appendChild(row);
  autoExpandTextarea(row.querySelector("textarea"));
}

// ヒビ追加
function addHibi() {
  kizHibiCount++;
  const container = document.getElementById("kiz-hibi-container");
  const row = document.createElement("div");
  row.className = "growth-block";
  row.id = `hibi-${kizHibiCount}`;
  row.innerHTML = `
    <input type="text" name="hibi-name" placeholder="ヒビ入りキズナ名">
    <textarea name="hibi-desc" rows="2" placeholder="説明・エピソード"></textarea>
    <div class="row actions">
      <button type="button" onclick="moveBlockUp('hibi-${kizHibiCount}')">▲ 上へ</button>
      <button type="button" onclick="moveBlockDown('hibi-${kizHibiCount}')">▼ 下へ</button>
      <button type="button" onclick="removeBlock('hibi-${kizHibiCount}')">削除</button>
    </div>
  `;
  container.appendChild(row);
  autoExpandTextarea(row.querySelector("textarea"));
}

// ヒビワレ追加
function addHibiware() {
  kizHibiwareCount++;
  const container = document.getElementById("kiz-hibiware-container");
  const row = document.createElement("div");
  row.className = "growth-block";
  row.id = `hibiware-${kizHibiwareCount}`;
  row.innerHTML = `
    <input type="text" name="hibiware-name" placeholder="ヒビワレしたキズナ名">
    <input type="text" name="hibiware-kizato" placeholder="取得キズアト">
    <textarea name="hibiware-epi" rows="2" placeholder="説明・エピソード"></textarea>
    <div class="row actions">
      <button type="button" onclick="moveBlockUp('hibiware-${kizHibiwareCount}')">▲ 上へ</button>
      <button type="button" onclick="moveBlockDown('hibiware-${kizHibiwareCount}')">▼ 下へ</button>
      <button type="button" onclick="removeBlock('hibiware-${kizHibiwareCount}')">削除</button>
    </div>
  `;
  container.appendChild(row);
  autoExpandTextarea(row.querySelector("textarea"));
}

// 追加ヒトガラ
function addHitogara() {
  kizHitogaraCount++;
  const container = document.getElementById("kiz-hitogara-container");
  const row = document.createElement("div");
  row.className = "growth-block";
  row.id = `hitogara-${kizHitogaraCount}`;
  row.innerHTML = `
    <input type="text" name="hitogara-title" placeholder="ヒトガラ名">
    <textarea name="hitogara-desc" rows="2" placeholder="説明・エピソード"></textarea>
    <div class="row actions">
      <button type="button" onclick="moveBlockUp('hitogara-${kizHitogaraCount}')">▲ 上へ</button>
      <button type="button" onclick="moveBlockDown('hitogara-${kizHitogaraCount}')">▼ 下へ</button>
      <button type="button" onclick="removeBlock('hitogara-${kizHitogaraCount}')">削除</button>
    </div>
  `;
  container.appendChild(row);
  autoExpandTextarea(row.querySelector("textarea"));
}

// ==================== 共通：textarea自動拡張＋リサイズ可能 ====================
function autoExpandTextarea(textarea) {
  if (!textarea) return;
  textarea.style.resize = "vertical";    // 縦リサイズ可能
  textarea.style.overflowY = "hidden";   // 自動拡張用にスクロール非表示

  const resize = () => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  // 初期サイズ調整
  resize();

  // 入力時に自動調整
  textarea.addEventListener('input', resize);
}

// ページロード時に全 textarea に適用
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('textarea').forEach(autoExpandTextarea);
});

// ==================== フォーマット切り替え ====================
let currentFormat="DX3";
function switchFormat(fmt){
  const dx3Btn = document.getElementById('dx3-btn');
  const kizBtn = document.getElementById('kiz-btn');

  currentFormat = fmt;
  document.getElementById('DX3-form').style.display = (fmt==='DX3') ? 'block' : 'none';
  document.getElementById('KIZ-form').style.display = (fmt==='KIZ') ? 'block' : 'none';

  if(fmt === 'DX3'){
    dx3Btn.classList.add('active');
    kizBtn.classList.remove('active');
  } else {
    dx3Btn.classList.remove('active');
    kizBtn.classList.add('active');
  }
}


// ==================== 生成 ====================
function generate(){
  if(currentFormat==='DX3'){
    generateDX3();
  } else {
    generateKIZ();
  }
}

// ==================== DX3生成 ====================
function generateDX3() {
  let date = document.getElementById("date").value;
  let scenario = document.getElementById("scenario").value.trim();
  let pc = document.getElementById("pc").value.trim();
  let handout = document.getElementById("handout").value.trim();
  let memo = document.getElementById("memo").value;
  let text = "";

  // 基本情報
  // 日付
if(date){
  const formattedDate = date.replace(/-/g, "/"); // 2025-09-08 → 2025/09/08
  text += formattedDate + "\n";
}

// シナリオ名（空でも [>] を出力）
text += "[>]" + (scenario || "") + "\n";

// シナリオ名の下に ---- を生成する条件
if(pc || handout || memo){
  text += "----\n";
}

// PC番号・HO名 とハンドアウト
if(handout){ 
  // ハンドアウトに入力がある場合
  text += "\n"; // 改行
  if(pc){
    text += "[>]" + pc + "\n"; // PC番号がある場合はそのまま
  } else {
    text += "[>]\n"; // PC番号が空の場合も [>] を出す
  }
  text += handout + "\n[---]\n\n";
} else if(pc){
  // ハンドアウトなし、PC番号あり
  text += pc + "\n";
}
// 両方空なら何も出力しない

if(memo) {
  text += "\n";                    // メモ前に必ず改行
  text += "[>]memo\n" + memo + "\n[---]\n\n";
}
text += "----\n\n▼成長\n";

  // ◇能力値
  document.querySelectorAll("#growth-ability-container .growth-block").forEach(block => {
    const id = block.id.split("-")[1];
    const type = document.getElementById(`ability-type-${id}`).value;
    const cur = document.getElementById(`ability-current-${id}`).value;
    const after = document.getElementById(`ability-after-${id}`).value;
    if(type && cur && after) text += `【${type}】${cur}→${after}\n`;
  });

  // ◇技能
  document.querySelectorAll("#growth-skill-container .growth-block").forEach(block => {
    const id = block.id.split("-")[1];
    const name = document.getElementById(`skill-name-${id}`).value.trim();
    const cur = document.getElementById(`skill-current-${id}`).value;
    const after = document.getElementById(`skill-after-${id}`).value;
    if(name && cur && after) text += `〈${name}〉Lv${cur}→${after}\n`;
  });

  // ◇エフェクト
  document.querySelectorAll("#growth-effect-container .growth-block").forEach(block => {
    const id = block.id.split("-")[1];
    const type = document.getElementById(`effect-type-${id}`).value;
    const name = document.getElementById(`effect-name-${id}`).value.trim();
    const cur = document.getElementById(`effect-current-${id}`).value;
    const after = document.getElementById(`effect-after-${id}`).value;

    if(type && name && after){
      if(type==="取得"){
        text += `《${name}》Lv${after}で取得\n`;
      } else if(type==="成長" && cur){
        text += `《${name}》Lv${cur}→${after}\n`;
      }
    }
  });

  // ◇メモリー
  document.querySelectorAll("#growth-memory-container .growth-block").forEach(block => {
    const id = block.id.split("-")[1];
    const memory = document.getElementById(`memory-name-${id}`).value.trim();
    if(memory) text += `メモリー「${memory}」を取得\n`;
  });

  // ◇アイテム
  document.querySelectorAll("#growth-item-container .growth-block").forEach(block => {
    const id = block.id.split("-")[1];
    const type = document.getElementById(`item-type-${id}`).value;
    const name = document.getElementById(`item-name-${id}`).value.trim();
    if(type && name) text += `${type}「${name}」を常備化\n`;
  });

  // ◇残り経験値
  const exp = document.getElementById("exp").value;
  if(exp) text += `${exp}点保持\n`;

  // ▼ロイス
  text += "\n▼ロイス\n";
  document.querySelectorAll("#rois-container .growth-block").forEach(block => {
    const id = block.id.split("-")[1];
    const dlois = document.getElementById(`rois-d-${id}`).checked;
    const name = document.getElementById(`rois-name-${id}`).value.trim();
    const pos = document.getElementById(`rois-pos-${id}`).value.trim();
    const neg = document.getElementById(`rois-neg-${id}`).value.trim();
    const desc = document.getElementById(`rois-desc-${id}`).value.trim();
    const titus = document.getElementById(`rois-titus-${id}`).checked;

    if(!name) return;
    if(dlois){
      text += `Dロイス『${name}』\n`;
    } else {
let line = `『${name}』`;
if(pos || neg) line += `${pos}/${neg}`;
if(titus){
  if(desc){
    line += ` … タイタス｜${desc}`;
  } else {
    line += ` … タイタス`;
  }
} else if(desc){
  line += ` … ${desc}`;
}
text += line + "\n";
    }
  });

// 最後の区切り
text += "　\n";      // 全角空白＋改行
text += "----\n";
text += "[---]\n";
text += "　\n";    // 全角空白＋改行

  document.getElementById("output").textContent = text;
}


// ==================== KIZ生成 ====================
function generateKIZ() {
  let output = "";

// シナリオ名
const scenario = document.getElementById("kiz-scenario").value.trim();
output += `[>]***　${scenario}\n`;
output += "----\n";

  // 日付
  const date = document.getElementById("kiz-date").value.trim();
  if (date) {
    output += `Date：${date}\n`;
    output += "----\n";
  }

// 成長ブロックがあるかチェック
const hasGrowth = 
    document.querySelectorAll("#kiz-kizuna-container .growth-block, #kiz-hibi-container .growth-block, #kiz-hibiware-container .growth-block, #kiz-hitogara-container .growth-block")
    .length > 0;

// ▼成長ブロック出力前に改行を追加
if (hasGrowth) output += "\n";

  // ==================== キズナ生成 ====================
  const kizunaBlocks = document.querySelectorAll("#kiz-kizuna-container .growth-block");
  const validKizuna = Array.from(kizunaBlocks).map(block => {
    const name = block.querySelector("input[name='kizuna-name']").value.trim();
    const desc = block.querySelector("textarea[name='kizuna-desc']").value.trim();
    if (!name && !desc) return null; // 未入力はスキップ
    return {name, desc};
  }).filter(Boolean);

if (validKizuna.length > 0) {
  output += "[>]キズナ\n";
  validKizuna.forEach((k, i) => {
    // 2個目以降、前の項目に内容(desc)がある場合のみ改行
    if(i > 0 && validKizuna[i-1].desc) output += "\n";
    if(k.name) output += `「${k.name}」\n`;
    if(k.desc) output += k.desc + "\n";
  });
  output += "[---]\n\n";
  }

  // ==================== ヒビ生成 ====================
  const hibiBlocks = document.querySelectorAll("#kiz-hibi-container .growth-block");
  const validHibi = Array.from(hibiBlocks).map(block => {
    const name = block.querySelector("input[name='hibi-name']").value.trim();
    const desc = block.querySelector("textarea[name='hibi-desc']").value.trim();
    if (!name && !desc) return null; // 未入力はスキップ
    return {name, desc};
  }).filter(Boolean);

if (validHibi.length > 0) {
  output += "[>]ヒビ\n";
  validHibi.forEach((h, i) => {
    // 2個目以降、前の項目に内容(desc)がある場合のみ改行
    if(i > 0 && validHibi[i-1].desc) output += "\n";
    if(h.name) output += `「${h.name}」\n`;
    if(h.desc) output += h.desc + "\n";
  });
  output += "[---]\n\n";
  }


// ヒビワレ
const hibiwareBlocks = document.querySelectorAll("#kiz-hibiware-container .growth-block");
let hasHibiwareBlock = false;
let tempHibiware = "";

hibiwareBlocks.forEach(block => {
  const name = block.querySelector("input[name='hibiware-name']").value.trim();
  const kizato = block.querySelector("input[name='hibiware-kizato']").value.trim();
  const epi = block.querySelector("textarea[name='hibiware-epi']").value.trim();

  if (name || kizato || epi) {
    if (epi) {
      // 内容がある場合：[>] + 内容 + [---]
      tempHibiware += `[>]ヒビワレ「${name}」→ キズアト《${kizato}》\n`;
      tempHibiware += epi + "\n";
      tempHibiware += "[---]\n\n";
    } else {
      // 内容がない場合：名前のみ
      tempHibiware += `ヒビワレ「${name}」→ キズアト《${kizato}》\n`;
    }
    hasHibiwareBlock = true;
  }
});



// 追加ヒトガラ
const hitogaraBlocks = document.querySelectorAll("#kiz-hitogara-container .growth-block");
let hasHitogara = false;
let tempHitogara = "";

hitogaraBlocks.forEach(block => {
  const title = block.querySelector("input[name='hitogara-title']").value.trim();
  const desc = block.querySelector("textarea[name='hitogara-desc']").value.trim();

  // タイトルがある場合のみ処理
  if (title) {
    if (desc) {
      // 内容がある場合：[>]追加ヒトガラ「タイトル」 + 内容 + [---]
      tempHitogara += `[>]追加ヒトガラ「${title}」\n`;
      tempHitogara += desc + "\n";
      tempHitogara += "[---]\n\n";
    } else {
      // 内容がない場合：追加ヒトガラ「タイトル」のみ
      tempHitogara += `追加ヒトガラ「${title}」\n`;
    }
    hasHitogara = true;
  }
});

// まずヒビワレ個別エピソードを出力（ヒトガラの上）
if (hasHibiwareBlock) output += tempHibiware;

// 追加ヒトガラを出力
if (hasHitogara) output += tempHitogara;

// ヒビワレ「なし／肩代わり」
const hibiwareNone = document.getElementById("hibiware-none").checked;
const hibiwareKaradawari = document.getElementById("hibiware-karadawari-checkbox")?.checked;
if (hibiwareNone) {
  output += "ヒビワレ≫ " + (hibiwareKaradawari ? "肩代わり" : "なし") + "\n";
}

  // メモ
  const memo = document.getElementById("kiz-memo").value;
  if (memo) {
    if (hasGrowth) output += "----\n";
    output += "\n" + memo + "\n";
    output += "　\n";
  }

  // 最後の固定枠
  output += "----\n[---]\n";

  document.getElementById("output").textContent = output;
}



//コピペ部分
function copyText() {
  const text = document.getElementById("output").textContent;
  if(!text) { 
    alert("まずは『生成！』を押してください。"); 
    return; 
  }

  // Clipboard APIを使ってコピー
  navigator.clipboard.writeText(text)
    .then(() => {
      // コピー成功時
      alert("コピーしました！");
    })
    .catch(err => {
      // 失敗時
      console.error(err);
      alert("コピーに失敗しました…");
    });
}

// ==================== ヒビワレの「なし」チェックボックス初期化 ====================
document.addEventListener('DOMContentLoaded', () => {
  const hibiwareOptions = document.getElementById("hibiware-options");
  const addButton = document.getElementById("addHibiwareBtn");

  // 「なし」チェック
  const noneBlock = document.createElement("div");
  noneBlock.className = "hibiware-checkbox-block";
  noneBlock.innerHTML = `<input type="checkbox" id="hibiware-none">なし`;

  // 「肩代わり」チェック（初期は非表示）
  const karadawariBlock = document.createElement("div");
  karadawariBlock.className = "hibiware-checkbox-block";
  karadawariBlock.id = "hibiware-karadawari";
  karadawariBlock.style.display = "none";
  karadawariBlock.innerHTML = `<input type="checkbox" id="hibiware-karadawari-checkbox">肩代わり`;

  hibiwareOptions.appendChild(noneBlock);
  hibiwareOptions.appendChild(karadawariBlock);

  const noneCheckbox = document.getElementById("hibiware-none");

  noneCheckbox.addEventListener('change', () => {
    if (noneCheckbox.checked) {
      addButton.disabled = true;
      karadawariBlock.style.display = "inline-flex";
    } else {
      addButton.disabled = false;
      karadawariBlock.style.display = "none";
      karadawariBlock.querySelector("input").checked = false;
    }
  });
});


// ==================== DX3フォームの textarea 自動拡張 ====================
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#DX3-form textarea#handout, #DX3-form textarea#memo').forEach(textarea => {
    const resize = () => {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    };
    // 初期サイズ調整
    resize();
    // 入力時に自動調整
    textarea.addEventListener('input', resize);
  });
});

// ページロード時にKIZフォームのtextareaを自動拡張対応に
document.querySelectorAll('#KIZ-form textarea').forEach(textarea => {
  const resizeTextarea = e => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };
  // 初期サイズ調整
  resizeTextarea({ target: textarea });

  // 入力時に自動調整
  textarea.addEventListener('input', resizeTextarea);
});

//ダークモード用
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("darkModeToggle");
  const body = document.body;

  // ページ読み込み時に状態を復元
  if (localStorage.getItem("dark-mode") === "enabled") {
    body.classList.add("dark-mode");
    toggle.checked = true;
  }

  // 切替イベント
  toggle.addEventListener("change", () => {
    // ダークモードの切替
    body.classList.toggle("dark-mode", toggle.checked);

    // 状態を保存
    localStorage.setItem("dark-mode", toggle.checked ? "enabled" : "disabled");

  });
});
