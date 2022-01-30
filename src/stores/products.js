export default {
    products: [],
    setProducts(products) {
        this.products = products;
    },
    addProduct(product) {
        this.products = [...this.products, product];
    },
};
