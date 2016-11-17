window.onload = function() {
    function getInternetStatusData(interval, samples) {
        return fetch(`http://localhost/api/internet-status?interval=${interval}&samples=${samples}`)
            .then(function(res) {
                return res.json()
            });
    }

    function turnOffTVLight() {
        return fetch(`http://localhost/api/lights`);
    }

    function convertTime(obj) {
        var date = new Date(obj.time);
        return date.toLocaleDateString()+' '+date.toLocaleTimeString();
        
    }

    function displayChart(data) {
        var myChart = new Chart(document.getElementById("internetChart"), {
            type: 'line',
            data: {
                labels: _.map(data, convertTime),
                datasets: [{
                    label: 'Internet Status',
                    data: _.map(data, 'value'),
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
    }

    document.querySelector("#b1").addEventListener('click', function() {
        getInternetStatusData(3600000, 24)
            .then(displayChart);
    });

    document.querySelector("#b2").addEventListener('click', function() {
        getInternetStatusData(60000, 60)
            .then(displayChart);
    });

    document.querySelector("#b3").addEventListener('click', function() {
        turnOffTVLight();
    });
    
    getInternetStatusData(3600000, 24)
        .then(displayChart);
};