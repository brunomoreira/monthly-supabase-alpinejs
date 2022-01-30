import Joi from "joi";
import supabase from "../db";

let signupSchema = Joi.object({
    email: Joi.string()
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    username: Joi.string().required(),
    password: Joi.string().required(),
    password_confirmation: Joi.ref("password"),
});

export default () => ({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    errors: [],
    hasSignupError: false,
    signupErrorMessage: "",
    init() {
        this.$watch("errors", (errors) => {
            errors.forEach((error) => {
                let { path, message } = error;
                this.$refs[`signup-input-${path}`].classList.add("is-invalid");
                this.$refs[`signup-input-${path}-feedback`].textContent =
                    message;
            });
        });
    },
    resetSignupErrors() {
        this.errors = [];
        this.hasSignupError = false;
        this.signupErrorMessage = "";
        this.$refs["signup-input-email"].classList.remove("is-invalid");
        this.$refs["signup-input-email-feedback"].textContent = "";
        this.$refs["signup-input-username"].classList.remove("is-invalid");
        this.$refs["signup-input-username-feedback"].textContent = "";
        this.$refs["signup-input-password"].classList.remove("is-invalid");
        this.$refs["signup-input-password-feedback"].textContent = "";
        this.$refs["signup-input-password_confirmation"].classList.remove(
            "is-invalid"
        );
        this.$refs["signup-input-password_confirmation-feedback"].textContent =
            "";
    },
    async onSignup() {
        this.resetSignupErrors();
        try {
            await signupSchema.validateAsync({
                email: this.email,
                username: this.username,
                password: this.password,
                password_confirmation: this.password_confirmation,
            });

            let { user, session, error } = await supabase.auth.signUp(
                {
                    email: this.email,
                    password: this.password,
                },
                {
                    data: {
                        username: this.username,
                    },
                }
            );

            if (error) {
                this.hasSignupError = true;
                this.signupErrorMessage = error.message;
            } else {
                window.sessionStorage.setItem(
                    "montlhy-jwt",
                    JSON.stringify(session)
                );
                this.$store.userStore.setUser(user);
            }
        } catch (error) {
            this.errors = error.details;
        }
    },
});
