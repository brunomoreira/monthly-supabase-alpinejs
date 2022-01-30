import Joi from "joi";
import supabase from "../db";

let loginSchema = Joi.object({
    email: Joi.string()
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    password: Joi.string().required(),
});

export default () => ({
    email: "",
    password: "",
    errors: [],
    hasLoginError: false,
    loginErrorMessage: "",
    init() {
        this.$watch("errors", (errors) => {
            errors.forEach((error) => {
                let { path, message } = error;
                this.$refs[`login-input-${path}`].classList.add("is-invalid");
                this.$refs[`login-input-${path}-feedback`].textContent =
                    message;
            });
        });
    },
    resetLoginErrors() {
        this.errors = [];
        this.hasLoginError = false;
        this.loginErrorMessage = "";
        this.$refs["login-input-email"].classList.remove("is-invalid");
        this.$refs["login-input-email-feedback"].textContent = "";
        this.$refs["login-input-password"].classList.remove("is-invalid");
        this.$refs["login-input-password-feedback"].textContent = "";
    },
    async onLogin() {
        this.resetLoginErrors();
        try {
            await loginSchema.validateAsync({
                email: this.email,
                password: this.password,
            });

            const { user, session, error } = await supabase.auth.signIn({
                email: this.email,
                password: this.password,
            });

            if (error) {
                this.hasLoginError = true;
                this.loginErrorMessage = error.message;
            } else {
                window.sessionStorage.setItem(
                    "montlhy-jwt",
                    JSON.stringify(session)
                );
                this.$store.userStore.setUser(user);
                this.$store.viewStore.setView("dashboard");
                this.$dispatch("user-login");
            }
        } catch (error) {
            this.errors = error.details;
        }
    },
});
