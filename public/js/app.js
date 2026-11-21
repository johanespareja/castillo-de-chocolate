
// ==========================================
// 1. CONFIGURACIÓN DE FIGURAS GEOMÉTRICAS
// ==========================================

const figures = {

    prisma: {
        name: "Prisma rectangular",
        formula: "A = 2(L × W + L × H + W × H) | V = L × W × H",

        fields: [
            { id: "length", label: "Largo" },
            { id: "width", label: "Ancho" },
            { id: "height", label: "Altura" }
        ]
    },

    cubo: {
        name: "Cubo",
        formula: "A = 6a² | V = a³",

        fields: [
            { id: "side", label: "Lado" }
        ]
    },

    cilindro: {
        name: "Cilindro",
        formula: "A = 2πr(r + h) | V = πr²h",

        fields: [
            { id: "radius", label: "Radio" },
            { id: "height", label: "Altura" }
        ]
    },

    esfera: {
        name: "Esfera",
        formula: "A = 4πr² | V = 4πr³/3",

        fields: [
            { id: "radius", label: "Radio" }
        ]
    },

    cono: {
        name: "Cono",
        formula: "A = πr(r + g) | V = πr²h/3",

        fields: [
            { id: "radius", label: "Radio" },
            { id: "height", label: "Altura" }
        ]
    }

};

// ==========================================
// 2. VARIABLES GENERALES
// ==========================================

let lastCalculation = null;

const figureSelect = document.getElementById("figure");
const unitSelect = document.getElementById("unit");

const inputsContainer =
    document.getElementById("inputs-container");

// ==========================================
// 3. MOSTRAR CAMPOS SEGÚN LA FIGURA
// ==========================================

function renderInputs() {

    const selectedFigure = figureSelect.value;

    const config = figures[selectedFigure];

    inputsContainer.innerHTML = "";

    config.fields.forEach(field => {

        const container = document.createElement("div");

        container.className = "field";

        const label = document.createElement("label");

        label.textContent = field.label;

        label.htmlFor = field.id;

        const input = document.createElement("input");

        input.type = "number";

        input.id = field.id;

        input.min = "0";

        input.step = "any";

        input.placeholder = "Ingresa " + field.label.toLowerCase();

        container.appendChild(label);

        container.appendChild(input);

        inputsContainer.appendChild(container);

    });

    document.getElementById("error-message").textContent = "";

}

// ==========================================
// 4. FORMATO DE NÚMEROS
// ==========================================

function formatNumber(value) {

    return new Intl.NumberFormat("es-CO", {
        maximumFractionDigits: 4
    }).format(value);

}

// ==========================================
// 5. CONVERSIÓN DE UNIDADES
// ==========================================

// Todas las operaciones internas se realizan en cm.

function convertToCm(value, unit) {

    if (unit === "mm") {
        return value / 10;
    }

    if (unit === "m") {
        return value * 100;
    }

    return value;

}

// ==========================================
// 6. OBTENER LAS MEDIDAS
// ==========================================

function getMeasurements(config) {

    const values = {};

    for (const field of config.fields) {

        const input = document.getElementById(field.id);

        const value = Number(input.value);

        if (
            input.value.trim() === "" ||
            !Number.isFinite(value) ||
            value <= 0
        ) {

            document.getElementById("error-message").textContent =
                "Por favor, ingresa una medida válida y mayor que cero para " +
                field.label.toLowerCase() + ".";

            input.focus();

            return null;

        }

        values[field.id] = convertToCm(
            value,
            unitSelect.value
        );

    }

    return values;

}

// ==========================================
// 7. CALCULADORA GEOMÉTRICA
// ==========================================

function calculateGeometry() {

    const selectedFigure = figureSelect.value;

    const config = figures[selectedFigure];

    const measurements = getMeasurements(config);

    if (!measurements) {
        return;
    }

    let area = 0;

    let volume = 0;

    let formula = config.formula;

    const pi = Math.PI;

    // PRISMA RECTANGULAR

    if (selectedFigure === "prisma") {

        const L = measurements.length;

        const W = measurements.width;

        const H = measurements.height;

        area = 2 * (
            L * W +
            L * H +
            W * H
        );

        volume = L * W * H;

    }

    // CUBO

    else if (selectedFigure === "cubo") {

        const a = measurements.side;

        area = 6 * Math.pow(a, 2);

        volume = Math.pow(a, 3);

    }

    // CILINDRO

    else if (selectedFigure === "cilindro") {

        const r = measurements.radius;

        const h = measurements.height;

        area = 2 * pi * r * (r + h);

        volume = pi * Math.pow(r, 2) * h;

    }

    // ESFERA

    else if (selectedFigure === "esfera") {

        const r = measurements.radius;

        area = 4 * pi * Math.pow(r, 2);

        volume = (4 / 3) * pi * Math.pow(r, 3);

    }

    // CONO

    else if (selectedFigure === "cono") {

        const r = measurements.radius;

        const h = measurements.height;

        const g = Math.sqrt(
            Math.pow(r, 2) + Math.pow(h, 2)
        );

        area = pi * r * (r + g);

        volume = (pi * Math.pow(r, 2) * h) / 3;

        formula +=
            " | g = √(r² + h²) = " +
            formatNumber(g) + " cm";

    }

    // GUARDAR RESULTADO

    lastCalculation = {

        name: config.name,

        area: area,

        volume: volume,

        formula: formula,

        measurements: measurements,

        unit: unitSelect.value,

        date: new Date().toLocaleString("es-CO")

    };

    // MOSTRAR RESULTADOS

    document.getElementById("result-name").textContent =
        config.name;

    document.getElementById("area-result").textContent =
        formatNumber(area) + " cm²";

    document.getElementById("volume-result").textContent =
        formatNumber(volume) + " cm³";

    document.getElementById("formula-result").textContent =
        formula;

    document.getElementById("error-message").textContent =
        "Cálculo realizado correctamente.";

    document.getElementById("print-result").disabled = false;

    document.getElementById("floating-print").disabled = false;

    saveHistory(lastCalculation);

}

// ==========================================
// 8. LIMPIAR CALCULADORA
// ==========================================

function clearCalculator() {

    renderInputs();

    lastCalculation = null;

    document.getElementById("result-name").textContent =
        "Esperando cálculo";

    document.getElementById("area-result").textContent = "--";

    document.getElementById("volume-result").textContent = "--";

    document.getElementById("formula-result").textContent =
        "Selecciona una figura para comenzar.";

    document.getElementById("error-message").textContent =
        "Los campos han sido limpiados.";

    document.getElementById("print-result").disabled = true;

    document.getElementById("floating-print").disabled = true;

}

// ==========================================
// 9. IMPRIMIR RESULTADOS
// ==========================================

function printCalculation() {

    if (!lastCalculation) {

        alert("Primero debes realizar un cálculo.");

        return;

    }

    window.print();

}

// ==========================================
// 10. HISTORIAL DE CÁLCULOS
// ==========================================

const HISTORY_KEY = "castilloChocolateHistory";

function getHistory() {

    try {

        return JSON.parse(
            localStorage.getItem(HISTORY_KEY) || "[]"
        );

    } catch {

        return [];

    }

}

function saveHistory(calculation) {

    const history = getHistory();

    history.unshift(calculation);

    // Guardar máximo 10 resultados

    localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(history.slice(0, 10))
    );

    renderHistory();

}

function renderHistory() {

    const historyContainer =
        document.getElementById("history-container");

    const history = getHistory();

    if (history.length === 0) {

        historyContainer.innerHTML =
            "<p>No hay cálculos registrados.</p>";

        return;

    }

    historyContainer.innerHTML = history.map(item => {

        return `
            <div class="history-item">

                <span>
                    ${item.name}
                    <br>
                    <small>${item.date}</small>
                </span>

                <strong>
                    ${formatNumber(item.area)} cm²
                </strong>

            </div>
        `;

    }).join("");

}

document.getElementById("clear-history")
    .addEventListener("click", function() {

        localStorage.removeItem(HISTORY_KEY);

        renderHistory();

    });

// ==========================================
// 11. CALCULADORA DE COSTOS
// ==========================================

function money(value) {

    return "$" + new Intl.NumberFormat("es-CO", {
        maximumFractionDigits: 0
    }).format(value) + " COP";

}

function calculateProduction() {

    const input = document.getElementById("quantity");

    const quantity = Number(input.value);

    if (
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 1000000
    ) {

        alert("Ingresa una cantidad entera entre 1 y 1.000.000.");

        input.focus();

        return;

    }

    // Función original del documento

    const fixedCosts = 450000;

    const variableCost = 30500;

    const variableTotal = variableCost * quantity;

    const totalCost = fixedCosts + variableTotal;

    document.getElementById("total-cost").textContent =
        money(totalCost);

    document.getElementById("cost-details").textContent =
        "Costos fijos: " + money(fixedCosts) +
        " | Costos variables: " + money(variableTotal);

    // Actualizar gráficas

    updateCharts(quantity);

}

// ==========================================
// 12. GRÁFICA DE COSTOS
// ==========================================

function drawCostChart(quantity) {

    const canvas = document.getElementById("cost-chart");

    const ctx = canvas.getContext("2d");

    const width = canvas.clientWidth;

    const height = 260;

    const ratio = window.devicePixelRatio || 1;

    canvas.width = width * ratio;

    canvas.height = height * ratio;

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    ctx.clearRect(0, 0, width, height);

    const left = 70;

    const right = 15;

    const top = 20;

    const bottom = 45;

    const chartWidth = width - left - right;

    const chartHeight = height - top - bottom;

    const maxQuantity = Math.max(
        50,
        Math.ceil(quantity / 10) * 10
    );

    const maxCost = 450000 + 30500 * maxQuantity;

    // LÍNEAS DE REFERENCIA

    ctx.font = "10px Arial";

    for (let i = 0; i <= 4; i++) {

        const y = top + chartHeight * i / 4;

        ctx.strokeStyle = "#eadfd5";

        ctx.beginPath();

        ctx.moveTo(left, y);

        ctx.lineTo(width - right, y);

        ctx.stroke();

        ctx.fillStyle = "#806d60";

        const value = maxCost * (1 - i / 4);

        ctx.fillText(
            "$" + Math.round(value / 1000) + " mil",
            3,
            y + 4
        );

    }

    // DIBUJAR FUNCIÓN DE COSTOS

    ctx.beginPath();

    ctx.strokeStyle = "#d77b39";

    ctx.lineWidth = 3;

    for (let i = 0; i <= 50; i++) {

        const n = maxQuantity * i / 50;

        const cost = 450000 + 30500 * n;

        const x = left + chartWidth * n / maxQuantity;

        const y = top + chartHeight -
            (cost / maxCost) * chartHeight;

        if (i === 0) {

            ctx.moveTo(x, y);

        } else {

            ctx.lineTo(x, y);

        }

    }

    ctx.stroke();

    // PUNTO DE LA CANTIDAD SELECCIONADA

    const selectedX =
        left + chartWidth * quantity / maxQuantity;

    const selectedCost =
        450000 + 30500 * quantity;

    const selectedY =
        top + chartHeight -
        (selectedCost / maxCost) * chartHeight;

    ctx.fillStyle = "#432319";

    ctx.beginPath();

    ctx.arc(selectedX, selectedY, 5, 0, Math.PI * 2);

    ctx.fill();

    // ETIQUETA DEL EJE

    ctx.fillStyle = "#806d60";

    ctx.fillText(
        "Cantidad de castillos",
        width / 2 - 55,
        height - 8
    );

}

// ==========================================
// 13. GRÁFICA DE COMPARACIÓN DE EMPAQUES
// ==========================================

function drawPackagingChart(quantity) {

    const canvas = document.getElementById("packaging-chart");

    const ctx = canvas.getContext("2d");

    const width = canvas.clientWidth;

    const height = 260;

    const ratio = window.devicePixelRatio || 1;

    canvas.width = width * ratio;

    canvas.height = height * ratio;

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    ctx.clearRect(0, 0, width, height);

    // Valores del documento Word

    const conventional = 12000 * quantity;

    const pet = 5500 * quantity;

    const maxValue = Math.max(conventional, 1) * 1.2;

    const chartHeight = 180;

    const barWidth = Math.min(85, width * 0.23);

    const gap = width * 0.18;

    const positions = [
        width / 2 - gap / 2 - barWidth,
        width / 2 + gap / 2
    ];

    const values = [conventional, pet];

    const labels = [
        "Metacrilato",
        "PET"
    ];

    const colors = [
        "#95674c",
        "#d77b39"
    ];

    values.forEach((value, index) => {

        const barHeight =
            chartHeight * value / maxValue;

        const x = positions[index];

        const y = 205 - barHeight;

        ctx.fillStyle = colors[index];

        ctx.fillRect(
            x,
            y,
            barWidth,
            barHeight
        );

        ctx.fillStyle = "#432319";

        ctx.textAlign = "center";

        ctx.font = "bold 11px Arial";

        ctx.fillText(
            money(value).replace(" COP", ""),
            x + barWidth / 2,
            y - 8
        );

        ctx.fillStyle = "#806d60";

        ctx.font = "11px Arial";

        ctx.fillText(
            labels[index],
            x + barWidth / 2,
            230
        );

    });

    ctx.textAlign = "start";

    // MOSTRAR AHORRO

    const saving = (12000 - 5500) * quantity;

    document.getElementById("total-saving").textContent =
        money(saving);

    document.getElementById("saving-description").textContent =
        "Ahorro estimado para " + quantity + " castillos";

}

// ==========================================
// 14. ACTUALIZAR LAS GRÁFICAS
// ==========================================

function updateCharts(quantity) {

    drawCostChart(quantity);

    drawPackagingChart(quantity);

}

// ==========================================
// 15. EVENTOS DE LA PÁGINA
// ==========================================

figureSelect.addEventListener(
    "change",
    renderInputs
);

document.getElementById("calculate")
    .addEventListener(
        "click",
        calculateGeometry
    );

document.getElementById("clear")
    .addEventListener(
        "click",
        clearCalculator
    );

document.getElementById("print-result")
    .addEventListener(
        "click",
        printCalculation
    );

document.getElementById("floating-print")
    .addEventListener(
        "click",
        printCalculation
    );

document.getElementById("calculate-cost")
    .addEventListener(
        "click",
        calculateProduction
    );

document.getElementById("quantity")
    .addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {
                calculateProduction();
            }

        }
    );

// ==========================================
// 16. INICIAR LA APLICACIÓN
// ==========================================

renderInputs();

renderHistory();

calculateProduction();