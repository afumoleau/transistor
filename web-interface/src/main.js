window.onload = function() {
    fetch("http://localhost/api/internet-status")
       .then(function(res) {
            return res.json()
        }).then(function(data) {
            console.log('parsed json', data)
            var myChart = new Chart(document.getElementById("internetChart"), {
            type: 'line',
            data: {
                labels: _.map(data, 'time'),
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
        });
    /*
    */
};