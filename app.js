import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore, collection, onSnapshot, query, orderBy, limit, getDocs, where
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const demoData = {
  cargas: [
    {codigo:"AL-1001", cliente:"Posto Petrobras,Tanabi", origem:"Agulha", destino:"Tanabi", status:"Em trânsito", motorista:"LarissaR27", nfe:"788977", cte:"202462805"},
  ],
  motoristas: [
    {nome:"LarissaR27", pontos:120, cargo:"Motorista"}
  ],
  notas: [{numero:"788977"}],
  ocorrencias: []
};

let db = null;
let online = false;

try {
  if (!firebaseConfig.apiKey.includes("COLE_AQUI")) {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    online = true;
    startRealtime();
  } else {
    renderDemo();
  }
} catch (err) {
  console.warn("Firebase não configurado. Rodando em modo demonstração.", err);
  renderDemo();
}

function el(id){return document.getElementById(id)}

function renderDemo(){
  el("totalCargas").textContent = demoData.cargas.length;
  el("totalMotoristas").textContent = demoData.motoristas.length;
  el("totalNotas").textContent = demoData.notas.length;
  el("totalOcorrencias").textContent = demoData.ocorrencias.length;
  el("cargoList").innerHTML = demoData.cargas.map(c => cardCarga(c)).join("");
  el("rankingList").innerHTML = demoData.motoristas.map(m => `<div class="item"><b>${m.nome}</b><p>${m.cargo} • ${m.pontos} pontos</p></div>`).join("");
}

function startRealtime(){
  onSnapshot(collection(db,"cargas"), snap => {
    const cargas = snap.docs.map(d => ({id:d.id, ...d.data()}));
    el("totalCargas").textContent = cargas.length;
    el("cargoList").innerHTML = cargas.slice(0,10).map(c => cardCarga(c)).join("") || "<p>Nenhuma carga.</p>";
  });

  onSnapshot(collection(db,"motoristas"), snap => {
    const motoristas = snap.docs.map(d => ({id:d.id, ...d.data()})).sort((a,b)=>(b.pontos||0)-(a.pontos||0));
    el("totalMotoristas").textContent = motoristas.length;
    el("rankingList").innerHTML = motoristas.slice(0,10).map(m => `<div class="item"><b>${m.nome}</b><p>${m.cargo||"Motorista"} • ${m.pontos||0} pontos</p></div>`).join("");
  });

  onSnapshot(collection(db,"notas"), snap => el("totalNotas").textContent = snap.size);
  onSnapshot(collection(db,"ocorrencias"), snap => el("totalOcorrencias").textContent = snap.size);
}

function cardCarga(c){
  return `<div class="item"><b>${c.codigo||c.id}</b><p>${c.origem||"-"} → ${c.destino||"-"}</p><p>Status: ${c.status||"-"} | Motorista: ${c.motorista||"-"}</p></div>`;
}

el("trackForm").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const code = el("trackCode").value.trim();

  if (!online) {
    const found = demoData.cargas.find(c => [c.codigo,c.nfe,c.cte].includes(code));
    el("trackResult").innerHTML = found ? cardCarga(found) : "<p>Nenhum registro encontrado no modo demonstração.</p>";
    return;
  }

  const cargasRef = collection(db, "cargas");
  const queries = [
    query(cargasRef, where("codigo","==",code), limit(1)),
    query(cargasRef, where("nfe","==",code), limit(1)),
    query(cargasRef, where("cte","==",code), limit(1))
  ];

  for (const q of queries) {
    const snap = await getDocs(q);
    if (!snap.empty) {
      const c = {id:snap.docs[0].id, ...snap.docs[0].data()};
      el("trackResult").innerHTML = cardCarga(c);
      return;
    }
  }
  el("trackResult").innerHTML = "<p>Nenhum registro encontrado.</p>";
});
