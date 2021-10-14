let graphValues = {};
let donutGraphValues = {};
let myChartLine = null;
let chartDonut = null;

renderLineGraph();
renderDonutGraph();

// NOTE Show info
document
    .getElementById('select-date-button')
    .addEventListener('click', async (e) => {
        e.preventDefault();

        graphValues = {};
        donutGraphValues = {};

        const value = document.getElementById('datePicker').value;

        if (value) {
            const res = await axios.get(`/orders/bydate/${value}`);
            const { orders, total, numberOfOrders } = res.data;
            renderInfoTiles(total, numberOfOrders);
            //graphValues = orders.map(order => order.total)
            sumDay(orders);
        }
    });

function renderInfoTiles(total, numberOfOrders) {
    document.querySelector(
        '.show-info > .norders'
    ).innerHTML = `Numero de ordenes: ${numberOfOrders}`;
    document.querySelector(
        '.show-info > .itotal'
    ).innerHTML = `Ingreso total: $${total}`;
    document.querySelector(
        '.show-info > .iavg'
    ).innerHTML = `Ingreso promedio: $${Math.floor(total / numberOfOrders)}`;
}

function sumDay(orders) {
    orders.map((order) => {
        const date = order.date.split('T')[0];

        if (graphValues.hasOwnProperty(date)) {
            graphValues[date] += order.total;
        } else {
            graphValues[date] = order.total;
        }

        order.products.map((product) => {
            const id = `${product.id}::${product.title}`;
            if (donutGraphValues.hasOwnProperty(id)) {
                donutGraphValues[id] += product.quantity;
            } else {
                donutGraphValues[id] = product.quantity;
            }
        });
    });

    renderLineGraph();
    renderDonutGraph();
}

function renderLineGraph() {
    const canva = document.getElementById('graph-canvas');
    canva.innerHTML = '';

    const data = {
        labels: Object.keys(graphValues),
        datasets: [
            {
                label: 'Ventas',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: Object.values(graphValues),
            },
        ],
    };

    if (myChartLine) myChartLine.destroy();

    myChartLine = new Chart(
        canva,
        (config = {
            type: 'line',
            data: data,
            options: {maintainAspectRatio: false},
        })
    );
}

// TODO Render donut dynamically
function renderDonutGraph() {
    const canva = document.getElementById('donut-graph');
    canva.innerHTML = '';

    const dValues = Object.values(donutGraphValues);
    const dKeys = Object.keys(donutGraphValues);

    for (let i = 0; i < dValues.length; i++) {
        for (let j = 0; j < dValues.length - i - 1; j++) {
            if (dValues[j] < dValues[j + 1]) {
                const tmpV = dValues[j];
                const tmpK = dKeys[j];
                dValues[j] = dValues[j + 1];
                dValues[j + 1] = tmpV;
                dKeys[j] = dKeys[j + 1];
                dKeys[j + 1] = tmpK;
            }
        }
    }

    const data = {
        labels: dKeys.slice(0, 5).map((k) => k.split('::')[1]),
        datasets: [
            {
                label: 'Productos mas vendidos',
                data: dValues.length > 0 ? dValues.slice(0, 5) : [50, 40, 10],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                    'rgb(107, 21, 209',
                    'rgb(21, 209, 185)',
                ],
                hoverOffset: 4,
            },
        ],
    };

    if (chartDonut) chartDonut.destroy();

    chartDonut = new Chart(
        canva,
        (config = {
            type: 'doughnut',
            data: data,
            options: {maintainAspectRatio: false},
        })
    );
}
