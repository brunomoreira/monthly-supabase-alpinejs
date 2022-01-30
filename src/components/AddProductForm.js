import Joi from "joi";
import supabase from "../db";
import { Offcanvas } from "bootstrap";
import Pikaday from "pikaday";

let productSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required().min(0).precision(2),
    type_id: Joi.number().required(),
    created_at: Joi.date().required(),
});

export default () => ({
    addProductOffCanvas: null,
    pikadayInstance: null,
    errors: [],
    hasAddProductError: false,
    addProductErrorMessage: "",
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

        this.$watch("errors", (errors) => {
            errors.forEach((error) => {
                let { path, message } = error;

                console.log(path, message);

                this.$refs[`add-product-input-${path}`].classList.add(
                    "is-invalid"
                );
                this.$refs[`add-product-input-${path}-feedback`].textContent =
                    message;
            });
        });

        this.addProductOffCanvas = new Offcanvas(
            this.$refs["add-product-form"]
        );

        this.pikadayInstance = new Pikaday({
            field: this.$refs["add-product-input-date"],
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
        this.resetAddProductErrors();

        try {
            await productSchema.validateAsync({
                ...this.newProduct,
            });

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
            this.errors = error.details;
        }
    },
    resetAddProductErrors() {
        this.errors = [];
        this.hasAddProductError = false;
        this.addProductErrorMessage = "";
        this.$refs["add-product-input-name"].classList.remove("is-invalid");
        this.$refs["add-product-input-name-feedback"].textContent = "";
        this.$refs["add-product-input-price"].classList.remove("is-invalid");
        this.$refs["add-product-input-price-feedback"].textContent = "";
        this.$refs["add-product-input-type_id"].classList.remove("is-invalid");
        this.$refs["add-product-input-type_id-feedback"].textContent = "";
        this.$refs["add-product-input-date"].classList.remove("is-invalid");
        this.$refs["add-product-input-date-feedback"].textContent = "";
    },
    resetForm() {
        this.newProduct = {
            name: "",
            price: "",
            type_id: "",
            created_at: new Date(),
        };
        this.resetAddProductErrors();
    },
});
