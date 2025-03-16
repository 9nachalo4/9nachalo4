document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const lines = e.target.result.split('\n').filter(line => line.trim() !== '');
        const timeLabels = [];
        const datasets = {};

        lines.forEach(line => {
            const parts = line.split(' --- ');
            const time = parts[0].trim();
            if (!timeLabels.includes(time)) timeLabels.push(time);

            parts.slice(1).forEach(part => {
                const [name, value] = part.split(': ');
                const temp = parseFloat(value);
                if (!datasets[name]) datasets[name] = [];
                datasets[name].push(temp);
            });
        });

        const ctx = document.getElementById('chartCanvas').getContext('2d');
        if (window.myChart) window.myChart.destroy();

        window.myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timeLabels,
                datasets: Object.keys(datasets).map((key, i) => ({
                    label: key,
                    data: datasets[key],
                    borderColor: ['red', 'blue', 'green', 'orange', 'purple'][i % 5],
                    fill: false,
                    pointRadius: 3,
                    pointHoverRadius: 6
                }))
            },
            options: {
                responsive: true,
                scales: {
                    x: { ticks: { autoSkip: true, maxRotation: 45, minRotation: 45 } },
                    y: { beginAtZero: false }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return tooltipItem.dataset.label + ': ' + tooltipItem.raw + '°C';
                            }
                        }
                    }
                }
            }
        });
    };
    reader.readAsText(file);
});

function zoomIn() {
    if (window.myChart) {
        window.myChart.options.scales.x.min += 1;
        window.myChart.options.scales.x.max -= 1;
        window.myChart.update();
    }
}

function zoomOut() {
    if (window.myChart) {
        window.myChart.options.scales.x.min -= 1;
        window.myChart.options.scales.x.max += 1;
        window.myChart.update();
    }
}
