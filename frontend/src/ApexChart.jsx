import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChart = ({ items }) => {
    const options = {
        chart: {
            type: 'bar',
            height: 350
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: true,
            }
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: items.map(item => item.name),
        }
    };

    const series = [{
        data: items.map(item => item.age)
    }];

    return (
        <div id="chart">
            <ReactApexChart options={options} series={series} type="bar" height={350} />
        </div>
    );
}

export default ApexChart;
