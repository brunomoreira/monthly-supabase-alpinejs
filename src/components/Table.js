import { TabulatorFull as Tabulator } from "tabulator-tables";
import { priceFormatter, debounce } from "../utilities";

const cellFormatter = (cell) => {
    return cell.getValue();
};

export default () => ({
    tableInstance: null,
    search: "",
    init() {
        this.$watch(
            "search",
            debounce((value) => {
                this.tableInstance.setFilter("name", "like", value);
            }, 300)
        );

        let data = this.$store.productsStore?.products.map(this.productBuilder);

        window.addEventListener("refresh", ({ detail: product }) => {
            data.push(this.productBuilder(product));
            this.tableInstance.recalc();
        });

        this.tableInstance = new Tabulator(this.$refs["table-ref"], {
            data,
            reactiveData: true,
            groupBy: "year",
            groupClosedShowCalcs: true,
            columns: [
                {
                    title: "Name",
                    field: "name",
                    sorter: "string",
                    formatter: cellFormatter,
                },
                {
                    title: "Price",
                    field: "price",
                    sorter: "number",
                    bottomCalc: (values) => {
                        return priceFormatter(
                            values.reduce((sum, value) => sum + value, 0)
                        );
                    },
                    formatter: (cell) => priceFormatter(cell.getValue()),
                },
                { title: "Date", field: "date", sorter: "date" },
                { title: "User", field: "user.username" },
                { title: "Type", field: "type.name" },
            ],
            layout: "fitColumns",
            pagination: true,
            paginationSize: 10,
        });

        this.tableInstance.on("cellEdited", this.updateProductName);
    },
    productBuilder(product) {
        return {
            year: new Date(Date.parse(product.created_at)).getFullYear(),
            date: new Date(Date.parse(product.created_at)).toLocaleDateString(),
            ...product,
        };
    },
});
