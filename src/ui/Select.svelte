<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let options;
	export let selected;
	export let search = false;
	export let placeholder = 'Select an option';
	
	let expanded = false;
	let filter = '';
	let name;
	let el;
	let input;
	
	$: regex = filter ? new RegExp(filter, 'i') : null;
	$: filtered = regex ? options.filter(option => regex.test(option.name)) : options;
	$: (selected || selected == null) && setName();

	function setName() {
		if (selected) {
			name = options.find(d => d.code == selected).name;
		} else {
			name = null;
		}
	}
	
	function toggle(ev) {
		ev.stopPropagation();
		filter = '';
		expanded = !expanded;
	}
	
	$: if (input && expanded) {
		input.focus();
	}
	
	function unSelect(ev) {
		dispatch('select', {
			code: null
		});
		ev.stopPropagation();
		selected = null;
		name = null;
	}

	function submit(ev) {
		if (ev.keyCode === 13 && filtered[0]) {
			ev.preventDefault();
			select(filtered[0]);
		}
	}
	
	function select(option) {
		dispatch('select', {
			code: option.code
		});
		selected = option.code;
		expanded = false;
	}
	
	$: document.onclick = function(e) {
		if(e.target !== el){
			expanded = false;
		}
	};
</script>

<style>
	a {
		text-decoration: none;
		display: block;
		padding: 0;
		border: 2px solid #206095 !important;
	}
	a span {
		display: inline-block;
		padding: 10px 5px;
	}
	#select {
		margin-bottom: 20px;
	}
	#dropdown ul {
		background: #eee;
		list-style: none;
		margin: 0;
		padding: 0;
		max-height: 200px;
		overflow-y: auto;
		overflow-x: hidden;
	}
	#dropdown li {
		line-height: 1em;
		padding: 6px 0;
	}
	#dropdown li:hover {
		color: #fff;
		background-color: #206095;
		font-weight: 500;
	}
	/* normalize the input elements, make them look like everything else */
	#select input {
		width: calc(100% - 40px);
		background: transparent;
		font-family: inherit;
		font-size: inherit;
		color: inherit;
		font-weight: inherit;
		line-height: inherit;
		display: inline-block;
		padding: 10px 5px;
		margin: 0;
		background-color: #fff;
		border: 2px solid #206095 !important;
		border-radius: 0px;
		-webkit-appearance: none;
		-moz-appearance: none;
	}
	#select input:focus {
		outline: none;
	}
	/* custom field (drop-down, text element) styling  */
	#select {
		display: block;
		width: 100%;
		position: relative;
	}
	.active {
		z-index: 1000;
	}
	/* the toggle is the visible part in the form */
	#toggle,
	#select input {
		line-height: inherit;
		color: #206095;
		font-weight: 500;
		cursor: pointer;
	}
	/* drop-down list / text element */
	#dropdown {
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
		opacity: 1;
	}
	.selected {
		color: #fff !important;
		background-color: #206095;
	}
	.button {
		color: #fff;
		background-color: #206095;
		background-repeat: no-repeat;
		background-position: center;
		display: inline-block;
		float: right;
	}
	.down {
		background-image: url("../icons/chevron-down.svg");
		width: 30px;
	}
	.search {
		background-image: url("../icons/search.svg");
		width: 30px;
	}
	.close {
		background-image: url("../icons/x-close.svg");
		width: 30px;
	}
</style>

<div id="select" class:active={expanded}>
	{#if selected}
	<a id="toggle" class="selected" on:click={toggle}>
		<span>{name}</span>
		<span class="button close" on:click={unSelect}>&nbsp;</span>
	</a>
	{:else}
	<a id="toggle" on:click={toggle}>
		<span>{placeholder ? placeholder : 'Select one'}</span>
		{#if search}
		<span class="button search">&nbsp;</span>
		{:else}
		<span class="button down">&nbsp;</span>
		{/if}
	</a>
	{/if}
	{#if expanded}
	<div id="dropdown" bind:this={el}>
		{#if search == true}
		<input type="text" placeholder="" bind:value={filter} autocomplete="false" bind:this={input} on:keyup={submit} />
		{/if}
		<ul>
			{#if filtered[0]}
			{#each filtered as option}
			<li on:click="{() => select(option)}">{option.name}</li>
			{/each}
			{:else}
			<li>No results</li>
			{/if}
		</ul>
	</div>
	{/if}
</div>