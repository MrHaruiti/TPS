// Relógio
function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// Estrutura de posições (exemplo)
const positions = {
    101: { subs: [{occupied:false}, {occupied:false}, {occupied:false}] },
    102: { subs: [{occupied:false}, {occupied:false}, {occupied:false}] },
    103: { subs: [{occupied:false}, {occupied:false}, {occupied:false}] }
};

function renderMap() {
    const layout = document.getElementById('layout');
    layout.innerHTML = '';
    Object.keys(positions).forEach(pos => {
        const card = document.createElement('div');
        card.className = 'card';
        card.textContent = pos;
        layout.appendChild(card);
        positions[pos].subs.forEach((sub, i) => {
            const subCard = document.createElement('div');
            subCard.className = 'card';
            subCard.textContent = sub.occupied ? 'X' : pos + String(i+1);
            layout.appendChild(subCard);
        });
    });
}
renderMap();

// Modais
function showModal(id) { document.getElementById(id).style.display='block'; }
function closeModal(id) { document.getElementById(id).style.display='none'; }

document.getElementById('closeModal').onclick = () => closeModal('modal');
document.getElementById('closeManualModal').onclick = () => closeModal('manualModal');

// Aceitar chegada voo
function acceptArrival() {
    const reg = document.getElementById('regInput').value;
    const posInput = document.getElementById('posInput').value;

    if(/^\d+$/.test(posInput)) {
        const pos = positions[posInput];
        if(pos) {
            pos.subs.forEach(s => s.occupied = true);
            renderMap();
            alert(`Voo registrado em ${posInput} (todas sub-posições ocupadas)`);
            closeModal('modal');
            return;
        }
    }
    alert('Posição inválida');
}

document.getElementById('acceptArrivalBtn').onclick = acceptArrival;

// Upload Excel
document.getElementById('loadExcel').onclick = () => {
    const fileInput = document.getElementById('fileInput');
    if(fileInput.files.length === 0) { alert('Selecione um arquivo'); return; }
    const file = fileInput.files[0];
    document.getElementById('fileName').textContent = file.name;

    const reader = new FileReader();
    reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type:'array'});
        alert('Excel carregado: ' + workbook.SheetNames.join(', '));
    };
    reader.readAsArrayBuffer(file);
};
