<style>
	main {
		box-sizing: border-box;
		padding: 24px;
		z-index: 2;
		width: 40%;
		position: absolute;
	}
	@media (max-width: 900px) {
		main {
			width: 50%;
		}
	}
	@media (max-width: 670px) {
		main {
			width: 100%;
			top: 70%;
		}
	}
</style>

<main>
	<slot></slot>
</main>