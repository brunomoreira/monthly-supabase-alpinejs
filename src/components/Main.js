import supabase from "../db";
import { Modal } from "bootstrap";

export default () => ({
    profileModal: null,
    init() {
        window.addEventListener("user-login", () => {
            this.setupProfileModal();
        });

        let token = JSON.parse(window.sessionStorage.getItem("montlhy-jwt"));

        if (token) {
            let { expires_at, user } = token;

            if (expires_at * 1000 > Date.now()) {
                this.$store.userStore.setUser(user);
                this.$store.viewStore.setView("dashboard");
                this.setupProfileModal();
            }
        }

        let theme = window.localStorage.getItem("monthly-theme");

        if (theme) {
            this.$store.themesStore.change(theme);
        }

        document
            .getElementById("theme-ref")
            .setAttribute(
                "href",
                `../src/themes/${theme ? theme : "flaty"}.min.css`
            );
    },
    async onLogout() {
        try {
            const { error } = await supabase.auth.signOut();

            if (error) throw new Error(error);

            window.sessionStorage.removeItem("montlhy-jwt");
            this.$store.userStore.setUser(null);
            this.$store.viewStore.setView("login");
            this.$dispatch("user-logout");
        } catch (error) {
            console.error(error);
        }
    },
    setupProfileModal() {
        this.$nextTick(() => {
            this.profileModal = new Modal(this.$refs["profile-modal"], {
                backdrop: "static",
            });

            this.$refs["profile-modal"].style.zIndex = "-1";

            this.$refs["profile-modal"].addEventListener(
                "show.bs.modal",
                () => {
                    this.$refs["profile-modal"].style.zIndex = "9999999999";
                }
            );

            this.$refs["profile-modal"].addEventListener(
                "hidden.bs.modal",
                () => {
                    this.$refs["profile-modal"].style.zIndex = "-1";
                }
            );
        });
    },
    showProfileModal() {
        this.profileModal?.show();
    },
});
