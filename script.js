// === script.js ===

// Função para atualizar o relógio
function updateClock() {
    const clock = document.getElementById('clock');
    if (!clock) return;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    clock.innerText = `${h}:${m}:${s}`;
}
setInterval(updateClock, 1000);
updateClock();

// Função para ler arquivo Excel
async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    populateMap(jsonData);
}

// Popula o mapa com os dados do Excel
function populateMap(data) {
    // Supondo que a primeira linha seja cabeçalho
    const positions = data.slice(1); // Ignora o cabeçalho

    positions.forEach(row => {
        const posicao = String(row[0]).trim(); // Ex: 102, 102A
        const aircraft = row[1] ? row[1].trim() : '';
        const type = row[2] ? row[2].trim() : ''; // Narrow ou Wide

        if (!posicao) return;

        if (posicao.length === 3) {
            // Widebody ocupa 3 subposições automaticamente
            ['A', 'B', 'C'].forEach(suffix => {
                const id = `${posicao}${suffix}`;
                const cell = document.getElementById(id);
                if (cell) cell.innerText = aircraft;
            });
        } else {
            // Subposição específica
            const cell = document.getElementById(posicao);
            if (cell) cell.innerText = aircraft;
        }
    });
}

// Conecta o input de arquivo
const fileInput = document.getElementById('excelFileInput');
if (fileInput) {
    fileInput.addEventListener('change', handleFileUpload);
}

// Renderização inicial do mapa, caso precise
function renderMap() {
    const mapContainer = document.getElementById('mapContainer');
    if (!mapContainer) return;

    // Exemplo de como gerar as células de posição
    const rows = 5; // ajuste conforme seu mapa
    const cols = 10; // ajuste conforme seu mapa
    mapContainer.innerHTML = '';

    for (let r = 0; r < rows; r++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'map-row';

        for (let c = 1; c <= cols; c++) {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'map-cell';
            const posNum = 101 + c + r * cols; // exemplo de numeração
            ['A', 'B', 'C'].forEach(suffix => {
                const subCell = document.createElement('div');
                subCell.id = `${posNum}${suffix}`;
                subCell.className = 'sub-cell';
                subCell.innerText = ''; // vazio inicialmente
                cellDiv.appendChild(subCell);
            });
            rowDiv.appendChild(cellDiv);
        }
        mapContainer.appendChild(rowDiv);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderMap();
});
