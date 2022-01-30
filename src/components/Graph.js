import ApexCharts from "apexcharts";

const options = {
    chart: {
        type: "line",
    },
    series: [
        {
            name: "total",
            data: [],
        },
    ],
    dataLabels: {
        enabled: true,
        formatter: (value) => {
            return new Intl.NumberFormat("pt-PT", {
                style: "currency",
                currency: "EUR",
            }).format(value);
        },
        style: {
            fontSize: "12px",
            fontWeight: "bold",
        },
        background: {
            enabled: true,
            foreColor: "#fff",
            borderRadius: 2,
            padding: 4,
            opacity: 1,
            borderWidth: 0,
            borderColor: "#777",
        },
    },
    yaxis: {
        labels: {
            formatter: (value) => {
                return new Intl.NumberFormat("pt-PT", {
                    style: "currency",
                    currency: "EUR",
                }).format(value);
            },
        },
    },
    xaxis: {
        labels: {
            formatter: (value) => {
                return value == 0
                    ? "Jan"
                    : value == 1
                    ? "Feb"
                    : value == 2
                    ? "Mar"
                    : value == 3
                    ? "Apr"
                    : value == 4
                    ? "May"
                    : value == 5
                    ? "Jun"
                    : value == 6
                    ? "Jul"
                    : value == 7
                    ? "Aug"
                    : value == 8
                    ? "Sep"
                    : value == 9
                    ? "Oct"
                    : value == 10
                    ? "Nov"
                    : "Dec";
            },
        },
    },
};

export default () => ({
    apexInstance: null,
    activeYear: null,
    data: [],
    init() {
        window.addEventListener("refresh", () => {
            this.updateSeries();
        });

        this.build();
    },
    updateGraph(options, activeYear) {
        let actionsContainer = document.getElementById("graph-actions-wrapper");
        actionsContainer
            .querySelectorAll("button")
            .forEach((btn) => btn.remove());

        Object.keys(this.data).forEach((year, i) => {
            let btn = document.createElement("button");
            btn.classList.add(
                "btn",
                year == activeYear ? "btn-primary" : "btn-secondary",
                "btn-sm"
            );
            btn.classList.add("me-1");
            btn.textContent = year;
            btn.addEventListener("click", () => this.setYear(year));

            actionsContainer.appendChild(btn);
        });

        options.series[0].data = Object.keys(this.data[activeYear]).map(
            (key) => ({
                x: key,
                y: this.data[activeYear][key].toFixed(0),
            })
        );

        return options;
    },
    setYear(year) {
        this.activeYear = year;
        this.apexInstance.updateOptions(this.updateGraph(options, year));
    },
    build() {
        this.$store.productsStore?.products
            .map((product) => ({
                date: new Date(Date.parse(product.created_at)),
                price: product.price,
            }))
            .forEach((product) => {
                if (!this.data[product.date.getUTCFullYear()]) {
                    this.data[product.date.getUTCFullYear()] = {
                        0: 0,
                        1: 0,
                        2: 0,
                        3: 0,
                        4: 0,
                        5: 0,
                        6: 0,
                        7: 0,
                        8: 0,
                        9: 0,
                        10: 0,
                        11: 0,
                    };

                    this.data[product.date.getUTCFullYear()][
                        product.date.getUTCMonth()
                    ] = product.price;
                } else {
                    this.data[product.date.getUTCFullYear()][
                        product.date.getUTCMonth()
                    ] += product.price;
                }
            });

        this.activeYear = Object.keys(this.data)[
            Object.keys(this.data).length - 1
        ];

        this.apexInstance = new ApexCharts(
            this.$refs["graph-ref"],
            this.updateGraph(options, this.activeYear)
        );

        this.apexInstance.render();
    },
    clean() {
        let actionsContainer = document.getElementById("graph-actions-wrapper");
        actionsContainer.querySelectorAll("button").forEach((btn) => {
            removeEventListener("click", btn);
            btn.remove();
        });
        this.data = [];
        this.apexInstance.destroy();
    },
    updateSeries() {
        this.clean();

        this.$store.productsStore?.products
            .map((product) => ({
                date: new Date(Date.parse(product.created_at)),
                price: product.price,
            }))
            .forEach((product) => {
                if (!this.data[product.date.getUTCFullYear()]) {
                    this.data[product.date.getUTCFullYear()] = {
                        0: 0,
                        1: 0,
                        2: 0,
                        3: 0,
                        4: 0,
                        5: 0,
                        6: 0,
                        7: 0,
                        8: 0,
                        9: 0,
                        10: 0,
                        11: 0,
                    };

                    this.data[product.date.getUTCFullYear()][
                        product.date.getUTCMonth()
                    ] = product.price;
                } else {
                    this.data[product.date.getUTCFullYear()][
                        product.date.getUTCMonth()
                    ] += product.price;
                }
            });

        this.activeYear = Object.keys(this.data)[
            Object.keys(this.data).length - 1
        ];

        this.$nextTick(() => {
            this.apexInstance = new ApexCharts(
                this.$refs["graph-ref"],
                this.updateGraph(options, this.activeYear)
            );

            this.apexInstance.render();
        });
    },
});
