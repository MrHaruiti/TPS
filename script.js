let timetable = [];
let tpsConfig = [];
let positions = {};
let refreshIntervalSec = 1;
let lastTriggered = new Set();

function pad(n){ return n<10?'0'+n:''+n; }
function nowStr(){ const d=new Date(); return pad(d.getHours())+':'+pad(d.getMinutes())+':'+pad(d.getSeconds()); }
function updateClock(){ document.getElementById('clock').textContent = nowStr(); }
setInterval(updateClock,1000);
updateClock();

function buildPositions(){
  positions = {};
  for(const t of tpsConfig){
    for(let p=t.start;p<=t.end;p++){
      positions[p]={tps:t.name, subs:[{occupied:false,flight:null},{occupied:false,flight:null},{occupied:false,flight:null}]};
    }
  }
}

function renderMap(){
  const area=document.getElementById('mapArea');
  if(!area) return;
  area.innerHTML='';
  for(const t of tpsConfig){
    const header=document.createElement('div');
    header.className='tps-header';
    header.textContent=t.name+' — '+t.start+' A '+t.end;
    area.appendChild(header);
    for(let p=t.start;p<=t.end;p++){
      const row=document.createElement('div');
      row.className='position-row';
      const colPos=document.createElement('div');
      colPos.innerHTML='<strong>'+p+'</strong><div class="small">sub-posições: 3</div>';
      const colInfo=document.createElement('div');
      const subwrap=document.createElement('div');
      subwrap.className='subcells';
      positions[p].subs.forEach((s,i)=>{
        const sc=document.createElement('div');
        sc.className='subcell';
        sc.dataset.pos=p;
        sc.dataset.sub=i;
        sc.textContent=s.occupied?s.flight.airline:'livre';
        sc.addEventListener('click',()=>{selectPosition(p,i);});
        subwrap.appendChild(sc);
      });
      colInfo.appendChild(subwrap);
      row.appendChild(colPos);
      row.appendChild(colInfo);
      row.appendChild(document.createElement('div'));
      row.appendChild(document.createElement('div'));
      area.appendChild(row);
    }
  }
}

function selectPosition(pos,sub){
  document.getElementById('selectedDetails').innerHTML='Posição: <b>'+pos+'</b> — sub: '+(sub+1);
}

// --- Inicializar TPS ---
document.getElementById('applyTps').addEventListener('click',()=>{
  const txt=document.getElementById('tpsConfig').value.trim();
  tpsConfig=txt.split('\n').map(l=>{
    const p=l.split(',').map(x=>x.trim());
    return {name:p[0], start:parseInt(p[1]), end:parseInt(p[2])};
  });
  buildPositions();
  renderMap();
});
document.getElementById('applyTps').click();
