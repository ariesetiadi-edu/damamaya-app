$(function () {
    // Default property
    let kategori = $("#anggaran-kategori option:selected").val();
    let start_date = null;
    let end_date = null;

    // Ketika kategori dirubah, ambil selected value nya
    $("#anggaran-kategori").on("change", function () {
        kategori = $("#anggaran-kategori option:selected").val();
    });

    if ($("#anggaran-chart").length) {
        // Default property
        start_date = $("#start-date").val();
        end_date = $("#end-date").val();

        $("#anggaran-submit-period").click(function () {
            start_date = $("#start-date").val();
            end_date = $("#end-date").val();
            anggaran_report(start_date, end_date, kategori);
        });

        setInterval(() => {
            anggaran_report(start_date, end_date, kategori);
        }, 60000);
    }
});

function anggaran_report(start_date, end_date, kategori) {
    if ($("#anggaran-chart").length) {
        // Set new default font family and font color to mimic Bootstrap's default styling
        (Chart.defaults.global.defaultFontFamily = "Nunito"),
            '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
        Chart.defaults.global.defaultFontColor = "#858796";

        // Get dates Name
        let url = $('meta[name="anggaran-report-route"]').attr("content");
        let dates = [];
        let counts = [];
        let data = [];
        let anggaran_table_str = ``;

        $.ajaxSetup({
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
        });

        $.ajax({
            url: url,
            data: {
                start_date: start_date,
                end_date: end_date,
                kategori: kategori,
            },
            type: "POST",
            success: function (report) {
                counts = report["counts"];
                dates = report["dates"];
                data = report["data"];

                $("#anggaran-chart").remove();
                $("#anggaran-table").remove();

                let canvas_str = `<canvas id="anggaran-chart" style="display: block; height: 320px; width: 601px;" width="751" height="400" class="chartjs-render-monitor"></canvas>`;

                // Append new canvas
                $("#anggaran-chart-wrapper").append(canvas_str);

                // Jika ada data yang dihasilkan, maka tampilkan dalam bentuk table
                if (data.length > 0) {
                    anggaran_table_str = `
                    <table class="table table-hover" id="anggaran-table">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th class="w-custom-sm">Tanggal Pengaduan</th>
                                <th class="w-custom-sm">Nama Pelapor</th>
                                <th class="w-custom-sm">Topik</th>
                                <th class="w-custom-sm">Kategori</th>
                                <th>Nama Instansi / Perangkat Daerah</th>
                            </tr>
                        </thead>
                        <tbody>
                        `;

                    $.each(data, function (i, val) {
                        anggaran_table_str += `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${val.tanggal}</td>
                            <td>${val.nama_pelapor}</td>
                            <td>${val.topik}</td>
                            <td>${val.kategori}</td>
                            <td>${val.nama_pd}</td>
                        </tr>
                        `;
                    });

                    anggaran_table_str += `</tbody></table>`;

                    $("#anggaran-table-wrapper").append(anggaran_table_str);
                } else {
                    anggaran_table_str = `
                    <h4 id="anggaran-table" class="text-secondary text-center">Data Tidak Ditemukan</h4>
                    `;

                    $("#anggaran-table-wrapper").append(anggaran_table_str);
                }

                // Area Chart Example
                var ctx = document.getElementById("anggaran-chart");
                var myLineChart = new Chart(ctx, {
                    type: "line",
                    data: {
                        labels: dates,
                        datasets: [
                            {
                                label: "Aduan",
                                lineTension: 0,
                                backgroundColor: "rgba(78, 115, 223, 0.05)",
                                borderColor: "rgba(78, 115, 223, 1)",
                                pointRadius: 3,
                                pointBackgroundColor: "rgba(78, 115, 223, 1)",
                                pointBorderColor: "rgba(78, 115, 223, 1)",
                                pointHoverRadius: 3,
                                pointHoverBackgroundColor:
                                    "rgba(78, 115, 223, 1)",
                                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                                pointHitRadius: 10,
                                pointBorderWidth: 2,
                                data: counts,
                            },
                        ],
                    },
                    options: {
                        maintainAspectRatio: false,
                        layout: {
                            padding: {
                                left: 10,
                                right: 25,
                                top: 25,
                                bottom: 0,
                            },
                        },
                        scales: {
                            xAxes: [
                                {
                                    time: {
                                        unit: "date",
                                    },
                                    gridLines: {
                                        display: false,
                                        drawBorder: false,
                                    },
                                    ticks: {
                                        maxTicksLimit: 7,
                                    },
                                },
                            ],
                            yAxes: [
                                {
                                    ticks: {
                                        maxTicksLimit: 5,
                                        padding: 10,
                                        // Include a dollar sign in the ticks
                                        callback: function (
                                            value,
                                            index,
                                            values
                                        ) {
                                            return value;
                                        },
                                    },
                                    gridLines: {
                                        color: "rgb(234, 236, 244)",
                                        zeroLineColor: "rgb(234, 236, 244)",
                                        drawBorder: false,
                                        borderDash: [2],
                                        zeroLineBorderDash: [2],
                                    },
                                },
                            ],
                        },
                        legend: {
                            display: false,
                        },
                        tooltips: {
                            backgroundColor: "rgb(255,255,255)",
                            bodyFontColor: "#858796",
                            titleMarginBottom: 10,
                            titleFontColor: "#6e707e",
                            titleFontSize: 14,
                            borderColor: "#dddfeb",
                            borderWidth: 1,
                            xPadding: 15,
                            yPadding: 15,
                            displayColors: false,
                            intersect: false,
                            mode: "index",
                            caretPadding: 10,
                            callbacks: {
                                label: function (tooltipItem, chart) {
                                    var datasetLabel =
                                        chart.datasets[tooltipItem.datasetIndex]
                                            .label || "";
                                    return (
                                        datasetLabel + ": " + tooltipItem.yLabel
                                    );
                                },
                            },
                        },
                    },
                });
            },
        });
    }
}