<script>
	import { getContext } from 'svelte';

	const { data, xGet, yGet, yRange, yDomain, xScale } = getContext('LayerCake');
	
	$: min = {perc: $yDomain[0]};
	$: max = {perc: $yDomain[1]};
	
	export let selected = null;
	export let parent = null;
	export let siblings = null;
	export let dataIndex;

	/* --------------------------------------------
	 * Default styles
	 */
	export let fill = '#cccccc';
	export let stroke = '';
	export let strokeWidth = 1;
	
	let selectedElement = null;
	let parentElement = null;
	let siblingElements = null;
  
  function getSelected() {
    if (selected) {
      selectedElement = dataIndex[selected];
    } else {
      selectedElement = null;
    }
	}
	
	function getParent() {
    if (parent) {
      parentElement = dataIndex[parent];
    } else {
      parentElement = null;
    }
	}

	function getSiblings() {
		if (siblings) {
			let array = [];
			siblings.forEach(code => {
				if (dataIndex[code]) {
					array.push(dataIndex[code]);
				}
			});
			siblingElements = array;
		} else {
			siblingElements = null;
		}
	}

	$: (selected || selected == null) && getSelected();
	$: (parent || parent == null) && getParent();
	$: (siblings || siblings == null) && getSiblings();

</script>

{#if false}
<g class="column-group">
	{#each $data as d, i}
		<line
			data-id="{i}-under"
			x1="{$xGet(d)}"
			x2="{$xGet(d)}"
			y1="{$yGet(max)}"
			y2="{$yGet(min)}"
			stroke="{d.muted ? d.muted : fill}"
			stroke-width="{strokeWidth}"
			stroke-linecap="butt"
		/>
		<line
			data-id="{i}"
			x1="{$xGet(d)}"
			x2="{$xGet(d)}"
			y1="{$yGet(d)}"
			y2="{$yGet(min)}"
			stroke="{d.color ? d.color : fill}"
			stroke-width="{strokeWidth}"
			stroke-linecap="butt"
		/>
	{/each}
</g>
{/if}

{#if siblingElements}
<g class="siblings-group">
	{#each siblingElements as d, i}
	<line
		data-id="{d.code}"
		x1="{$xGet(d)}"
		x2="{$xGet(d)}"
		y1="{$yGet(max)}"
		y2="{$yGet(min)}"
		stroke="{d.muted}"
		stroke-width="1"
		stroke-linecap="butt"
	/>
	<line
		data-id="{d.code}"
		x1="{$xGet(d)}"
		x2="{$xGet(d)}"
		y1="{$yGet(d)}"
		y2="{$yGet(min)}"
		stroke="{d.color}"
		stroke-width="1"
		stroke-linecap="butt"
	/>
	{/each}
</g>
{/if}

<g class="ew-group">
	<line
		data-id="selected"
		x1="{$xGet($data[Math.floor($data.length / 2)])}"
		x2="{$xGet($data[Math.floor($data.length / 2)])}"
		y1="{$yGet(max)}"
		y2="{$yGet(min)}"
		stroke="#871A5B"
		stroke-width="2"
		stroke-linecap="butt"
	/>
</g>

{#if parentElement}
<g class="lad-group">
	<line
		data-id="parent"
		x1="{$xGet(parentElement)}"
		x2="{$xGet(parentElement)}"
		y1="{$yGet(max)}"
		y2="{$yGet(min)}"
		stroke="#27A0CC"
		stroke-width="2"
		stroke-linecap="butt"
	/>
</g>
{/if}

{#if selectedElement}
<g class="lsoa-group">
	<line
		data-id="selected"
		x1="{$xGet(selectedElement)}"
		x2="{$xGet(selectedElement)}"
		y1="{$yGet(max)}"
		y2="{$yGet(min)}"
		stroke="#000000"
		stroke-width="2"
		stroke-linecap="butt"
	/>
</g>
{/if}