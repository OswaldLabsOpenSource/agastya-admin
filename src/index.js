import Vue from "vue";

import Buefy from "buefy";
Vue.use(Buefy);
import "buefy/lib/buefy.css";

import "babel-polyfill";
import "whatwg-fetch";

import router from "./modules/router.js";

import Navbar from "./components/Navbar.vue";

// Progressive Web App support
if (process.env.NODE_ENV === "production") {
	require("./modules/pwa");
}

// import "@oswaldlabs/agastya";
// window.a11ySettings = { token: "5rlsghx", bottom: 75 };

// App
const app = new Vue({
	el: "#app",
	router,
	mounted() {},
	methods: {},
	render() {
		return (
			<div>
				<Navbar />
				<transition name="fade" mode="out-in">
					<router-view />
				</transition>
				<footer class="footer">
					<div class="container">
						<div class="content has-text-centered">
							<p>
								&copy; 2018 <strong>Agastya</strong> by <a href="https://oswaldlabs.com">Oswald Labs</a>
							</p>
						</div>
					</div>
				</footer>
			</div>
		);
	}
});
