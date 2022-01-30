import supabase from "../db";
import { Offcanvas } from "bootstrap";
import Pikaday from "pikaday";

export default () => ({
    addProductOffCanvas: null,
    pikadayInstance: null,
    newProduct: {
        name: "",
        price: "",
        type_id: "",
        created_at: new Date(),
    },
    init() {
        window.addEventListener("open-add-product-form", () => {
            this.openAddProduct();
        });

        this.addProductOffCanvas = new Offcanvas(
            this.$refs["add-product-form"]
        );

        this.pikadayInstance = new Pikaday({
            field: this.$refs["add-product-date-input"],
            defaultDate: this.newProduct.created_at,
            setDefaultDate: true,
            format: "DD-MM-YYYY",
            onSelect: (date) => {
                this.newProduct.created_at = date.toISOString();
            },
        });
    },
    closeAddProduct() {
        this.addProductOffCanvas?.hide();
    },
    openAddProduct() {
        this.addProductOffCanvas?.show();
    },
    async addProduct() {
        try {
            const { data: values } = await supabase
                .from("products")
                .select("id")
                .order("id", { ascending: false })
                .limit(1);

            const { data: product, error } = await supabase
                .from("products")
                .insert({
                    id: +values[0].id + 1,
                    ...this.newProduct,
                    slug: this.newProduct.name
                        .replaceAll(" ", "-")
                        .toLowerCase(),
                    user_id: this.user.id,
                })
                .single();

            if (error) throw new Error(error);

            this.resetForm();

            this.addProductOffCanvas?.hide();

            this.$store.productsStore.addProduct(product);

            this.$dispatch("refresh", product);
        } catch (error) {
            console.log(error);
        }
    },
    resetForm() {
        this.newProduct = {
            name: "",
            price: "",
            type_id: "",
            created_at: new Date(),
        };
    },
});
