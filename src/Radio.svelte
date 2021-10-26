<script>
	export let props;
	export let selected;
</script>

<style>
	div {
		position: relative;
	}
	span {
		padding: 0 0 0 1.3em;
	}
	input {
		position: absolute;
		top: 3px;
		left: 2px;
	}
</style>

<div>
	<input type="radio" bind:group={selected} value={props} />
	<span>{props.name}</span>
</div>