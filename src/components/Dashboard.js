import supabase from "../db";
import { Offcanvas } from "bootstrap";
import Pikaday from "pikaday";

export default () => ({
    addProductOffCanvas: null,
    pikadayInstance: null,
    user: null,
    products: [],
    productsFetched: false,
    productsFetchError: false,
    newProduct: {
        name: "",
        price: "",
        type_id: "",
        created_at: new Date(),
    },
    init() {
        this.user = this.$store.userStore.user;

        if (!this.productsFetched) {
            this.fetchProducts();
        } else {
            this.products = this.$store.productsStore.products;
        }

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
    async fetchProducts() {
        this.productsFetchError = false;

        try {
            const { data, error } = await supabase.from("products").select(`
                id,
                name,
                price,
                created_at,
                user:user_id (
                    id,
                    username
                ),
                type:type_id (
                    id,
                    name
                )
            `);

            if (error) throw new Error(error);

            this.productsFetched = true;
            this.products = data;
            this.$store.productsStore.setProducts(data);
            this.$dispatch("productsFetched", this.products);
        } catch (error) {
            this.productsFetchError = true;
        }
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
