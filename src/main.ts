import { Dropdown } from "bootstrap";
import Alpine from "alpinejs";
import userStore from "./stores/user";
import viewStore from "./stores/view";
import productsStore from "./stores/products";
import themesStore from "./stores/themes";
import Main from "./components/Main";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import Dashboard from "./components/Dashboard";
import Graph from "./components/Graph";
import Table from "./components/Table";
import Stats from "./components/Stats";
import "tabulator-tables/dist/css/tabulator_bootstrap4.min.css";
import "pikaday/css/pikaday.css";
import "./style.scss";

window.Dropdown = Dropdown;

Alpine.store("viewStore", viewStore);
Alpine.store("userStore", userStore);
Alpine.store("productsStore", productsStore);
Alpine.store("themesStore", themesStore);

Alpine.data("main", Main);
Alpine.data("loginForm", LoginForm);
Alpine.data("signupForm", SignupForm);
Alpine.data("dashboard", Dashboard);
Alpine.data("graph", Graph);
Alpine.data("table", Table);
Alpine.data("stats", Stats);

Alpine.start();
