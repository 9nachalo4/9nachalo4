let parsedData = null;

document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        console.log("Файл загружен");
        const lines = e.target.result.split("\n");
        const timeLabels = [];
        const data = {
            reactor1: [],
            reactor2: [],
            reactor3: [],
            cube: [],
            fridge: []
        };

        const regex = /(\d{2}:\d{2}:\d{2}) --- Реактор 1: ([\d\.]+) C° --- Реактор 2: ([\d\.]+) C° --- Реактор 3: ([\d\.]+) C° --- Куб: ([\d\.]+) C° --- Холодильник: ([\d\.]+) C°/;
        
        lines.forEach(line => {
            const match = regex.exec(line);
            if (match) {
                timeLabels.push(match[1]);
                data.reactor1.push(parseFloat(match[2]));
                data.reactor2.push(parseFloat(match[3]));
                data.reactor3.push(parseFloat(match[4]));
                data.cube.push(parseFloat(match[5]));
                data.fridge.push(parseFloat(match[6]));
            }
        });

        console.log("Данные загружены:", data);
        parsedData = { labels: timeLabels, values: data };
    };

    reader.readAsText(file);
});

document.getElementById('drawChartButton').addEventListener('click', function() {
    if (!parsedData) {
        console.error("Нет загруженных данных!");
        return;
    }
    drawChart(parsedData.labels, parsedData.values);
});

function drawChart(labels, data) {
    const ctx = document.getElementById('chartCanvas').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { label: "Реактор 1", data: data.reactor1, borderColor: "red", fill: false },
                { label: "Реактор 2", data: data.reactor2, borderColor: "green", fill: false },
                { label: "Реактор 3", data: data.reactor3, borderColor: "blue", fill: false },
                { label: "Куб", data: data.cube, borderColor: "orange", fill: false },
                { label: "Холодильник", data: data.fridge, borderColor: "purple", fill: false }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}