import { priceFormatter } from "../utilities";

const averageCalculator = (products) => {
    let data = [];

    products
        .map((product) => ({
            date: new Date(Date.parse(product.created_at)),
            price: product.price,
        }))
        .forEach((product) => {
            if (!data[product.date.getUTCFullYear()]) {
                data[product.date.getUTCFullYear()] = {
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

                data[product.date.getUTCFullYear()][
                    product.date.getUTCMonth()
                ] = product.price;
            } else {
                data[product.date.getUTCFullYear()][
                    product.date.getUTCMonth()
                ] += product.price;
            }
        });

    let totals = 0;

    for (let year in data) {
        totals +=
            Object.values(data[year]).reduce((sum, price) => sum + price, 0) /
            12;
    }

    return totals;
};

const getMostPopular = (products) => {
    let data = {
        products: [],
        types: [],
    };

    let mostPopularProduct = null;
    let mostPopularType = null;

    products.forEach((product) => {
        if (!data.products[product.name.replaceAll(" ", "-").toLowerCase()]) {
            data.products[product.name.replaceAll(" ", "-").toLowerCase()] = {
                name: product.name,
                total: 0,
            };

            if (!mostPopularProduct) {
                mostPopularProduct = { name: product.name, total: 0 };
            }
        } else {
            data.products[
                product.name.replaceAll(" ", "-").toLowerCase()
            ].total += product.price;

            if (
                data.products[product.name.replaceAll(" ", "-").toLowerCase()]
                    .total > mostPopularProduct.total
            ) {
                mostPopularProduct =
                    data.products[
                        product.name.replaceAll(" ", "-").toLowerCase()
                    ];
            }
        }

        if (!data.types[product.type.id]) {
            data.types[product.type.id] = {
                name: product.type.name,
                total: 0,
            };

            if (!mostPopularType) {
                mostPopularType = { name: product.type.name, total: 0 };
            }
        } else {
            data.types[product.type.id].total += 1;

            if (data.types[product.type.id].total > mostPopularType.total) {
                mostPopularType = data.types[product.type.id];
            }
        }
    });

    mostPopularProduct.total = priceFormatter(mostPopularProduct.total);

    return { mostPopularProduct, mostPopularType };
};

export default () => ({
    average: 0,
    mostPopular: null,
    init() {
        window.addEventListener("productsFetched", ({ detail: products }) => {
            this.buildStats(products);
        });
    },
    buildStats(products) {
        if (products.length !== 0) {
            this.average = priceFormatter(averageCalculator(products));
            this.mostPopular = getMostPopular(products);
        }
    },
});
