document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const lines = e.target.result.split('\n');
        const timeLabels = [];
        const datasets = {
            'Реактор 1': [], 'Реактор 2': [], 'Реактор 3': [], 'Куб': [], 'Холодильник': []
        };

        const regex = /(\d{2}:\d{2}:\d{2}) --- Реактор 1: ([\d\.]+) C° --- Реактор 2: ([\d\.]+) C° --- Реактор 3: ([\d\.]+) C° --- Куб: ([\d\.]+) C° --- Холодильник: ([\d\.]+) C°/;
        
        lines.forEach(line => {
            const match = regex.exec(line);
            if (match) {
                timeLabels.push(match[1]);
                datasets['Реактор 1'].push(parseFloat(match[2]));
                datasets['Реактор 2'].push(parseFloat(match[3]));
                datasets['Реактор 3'].push(parseFloat(match[4]));
                datasets['Куб'].push(parseFloat(match[5]));
                datasets['Холодильник'].push(parseFloat(match[6]));
            }
        });

        drawChart(timeLabels, datasets);
    };

    reader.readAsText(file);
});

function drawChart(labels, datasets) {
    const ctx = document.getElementById('chartCanvas').getContext('2d');

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: Object.keys(datasets).map((key, index) => ({
                label: key,
                data: datasets[key],
                borderColor: ['red', 'green', 'blue', 'orange', 'purple'][index],
                fill: false,
                pointRadius: 5,
                pointHoverRadius: 8
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { type: 'category', title: { display: true, text: 'Время' } },
                y: { title: { display: true, text: 'Значение' } }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `Время: ${tooltipItem.label}, Значение: ${tooltipItem.raw}`;
                        }
                    }
                },
                zoom: {
                    pan: { enabled: true, mode: 'x' },
                    zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' }
                }
            }
        }
    });
}