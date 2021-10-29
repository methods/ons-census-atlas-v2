<script>
	
	import DesignSystemApp from "./routes/DesignSystemApp.svelte";
	import CensusAtlas from "./routes/CensusAtlas.svelte";
	import { Router, Link, Route } from "svelte-routing";

	export let url = "";

</script>

<Router url="{url}">
	<nav>
	  <Link to="/">Census Atlas</Link>
	  <Link to="design-system">Design System</Link>
	</nav>
	<div>
	  <Route path="design-system" component="{DesignSystemApp}" />
	  <Route path="/"><CensusAtlas /></Route>
	</div>
  </Router>
