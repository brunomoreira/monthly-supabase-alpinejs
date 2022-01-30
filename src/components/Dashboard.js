import supabase from "../db";

export default () => ({
    user: null,
    products: [],
    productsFetched: false,
    productsFetchError: false,
    init() {
        this.user = this.$store.userStore.user;

        if (!this.productsFetched) {
            this.fetchProducts();
        } else {
            this.products = this.$store.productsStore.products;
        }
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
});
