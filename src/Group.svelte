<script>
	import Radio from './Radio.svelte';

	export let expanded = false;
	export let props;
	export let selected;

	function toggle() {
		expanded = !expanded;
	}

	function radioClick(e) {
		e.stopPropagation();
	}
</script>

<style>
	span {
		position: relative;
		padding: 0 0 0 1.3em;
		background: url(../icons/arrow.svg) 0 0.1em no-repeat;
		background-size: 1em 1em;
		font-weight: bold;
		cursor: pointer;
	}
	.expanded {
		background-image: url(../icons/arrow-open.svg);
	}
	ul {
		padding: 0.2em 0 0 0.5em;
		margin: 0 0 0 0.5em;
		list-style: none;
		border-left: 1px solid #eee;
	}
	li {
		padding: 0.2em 0;
	}
	input {
		position: absolute;
		top: 3px;
		left: 1.2em;
	}
</style>

{#if props.type == 'group-radio'}
<span class:expanded on:click={toggle} style="padding-left: 2.3em">
	<input type="radio" bind:group={selected} value={props} on:click={radioClick} />
	{props.name}
</span>
{:else}
<span class:expanded on:click={toggle}>
	{props.name}
</span>
{/if}
{#if props.code && props.type != 'group-radio'}<small>({props.code})</small>{/if}

{#if expanded}
	<ul>
		{#each props.children as child}
			<li>
				{#if child.type === 'group' || child.type === 'group-radio'}
					<svelte:self props={child} bind:selected={selected}/>
				{:else}
					<Radio props={child} bind:selected={selected}/>
				{/if}
			</li>
		{/each}
	</ul>
{/if}