/******************** Estrutura de dados ********************/
let timetable = [];
let tpsConfig = [];
let positions = {};
let refreshIntervalSec = 1;

/******************** Utils ********************/
function pad(n){ return n<10 ? '0'+n : ''+n; }
function nowStr(){
    const d = new Date();
    return pad(d.getHours())+':'+pad(d.getMinutes())+':'+pad(d.getSeconds());
}

/******************** Clock ********************/
function updateClock(){
    const clockEl = document.getElementById('clock');
    if(clockEl) clockEl.textContent = nowStr();
}
setInterval(updateClock,1000);
updateClock();

/******************** Construção de posições ********************/
function buildPositions(){
    positions = {};
    for(const t of tpsConfig){
        for(let p=t.start;p<=t.end;p++){
            positions[p] = {tps:t.name, subs:[{occupied:false,flight:null},{occupied:false,flight:null},{occupied:false,flight:null}]};
        }
    }
}

/******************** Renderização do mapa ********************/
function renderMap(){
    const area = document.getElementById('mapArea');
    if(!area) return;
    area.innerHTML='';

    for(const t of tpsConfig){
        const header = document.createElement('div');
        header.className='tps-header';
        header.textContent = `${t.name} — ${t.start} a ${t.end}`;
        area.appendChild(header);

        for(let p=t.start;p<=t.end;p++){
            const row = document.createElement('div');
            row.className='position-row';

            const colPos = document.createElement('div');
            colPos.innerHTML = `<strong>${p}</strong><div class="small">sub-posições: 3</div>`;

            const colInfo = document.createElement('div');
            const subwrap = document.createElement('div');
            subwrap.className='subcells';
            positions[p].subs.forEach((s,i)=>{
                const sc = document.createElement('div');
                sc.className='subcell';
                sc.dataset.pos = p;
                sc.dataset.sub = i;
                if(s.occupied){
                    sc.classList.add('occupied');
                    sc.textContent = `${s.flight.airline || ''} ${s.flight.reg || ''}\n${s.flight.aircraft || ''}`;
                } else sc.textContent = 'livre';
                sc.addEventListener('click',()=> selectPosition(p,i));
                subwrap.appendChild(sc);
            });
            colInfo.appendChild(subwrap);

            const colAircraft = document.createElement('div');
            colAircraft.className='small';
            colAircraft.textContent = '—';

            const colEvent = document.createElement('div');
            colEvent.className='small';
            colEvent.textContent = '—';

            row.appendChild(colPos);
            row.appendChild(colInfo);
            row.appendChild(colAircraft);
            row.appendChild(colEvent);
            area.appendChild(row);
        }
    }
}

/******************** Seleção ********************/
function selectPosition(pos,sub){
    const details = document.getElementById('selectedDetails');
    if(!details) return;
    const subData = positions[pos].subs[sub];
    details.innerHTML = `Posição: <b>${pos}</b> — sub: ${sub+1}<br/>${JSON.stringify(subData.flight || 'livre')}`;
}

/******************** Inicialização ********************/
document.addEventListener('DOMContentLoaded', ()=>{
    const applyBtn = document.getElementById('applyTps');
    if(applyBtn){
        applyBtn.addEventListener('click', ()=>{
            const txt = document.getElementById('tpsConfig').value.trim();
            const lines = txt.split('\n').map(l=>l.trim()).filter(Boolean);
            tpsConfig = [];
            for(const l of lines){
                const parts = l.split(',').map(p=>p.trim());
                if(parts.length>=3){
                    tpsConfig.push({name:parts[0], start:parseInt(parts[1]), end:parseInt(parts[2])});
                }
            }
            buildPositions();
            renderMap();
        });
        applyBtn.click(); // aplica TPS inicial
    }

    // render inicial caso já haja TPS default
    if(tpsConfig.length>0) {
        buildPositions();
        renderMap();
    }
});
