export default {
    activeTheme: "flaty",
    themes: [
        "flaty",
        "cerulean",
        "cosmo",
        "cyborg",
        "darkly",
        "journal",
        "litera",
        "lumen",
        "lux",
        "materia",
        "minty",
        "morph",
        "pulse",
        "quartz",
        "regent",
        "sandstone",
        "simplex",
        "sketchy",
        "slate",
        "solar",
        "spacelab",
        "superhero",
        "united",
        "vapor",
        "yeti",
        "zephyr",
    ],
    change(theme) {
        document
            .getElementById("theme-ref")
            .setAttribute("href", `../src/themes/${theme}.min.css`);

        this.activeTheme = theme;

        window.localStorage?.setItem("monthly-theme", theme);
    },
};
