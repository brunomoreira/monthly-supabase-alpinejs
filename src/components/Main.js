import supabase from "../db";

export default () => ({
    init() {
        let token = JSON.parse(window.sessionStorage.getItem("montlhy-jwt"));

        if (token) {
            let { expires_at, user } = token;

            if (expires_at * 1000 > Date.now()) {
                this.$store.userStore.setUser(user);
                this.$store.viewStore.setView("dashboard");
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
});
