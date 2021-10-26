<script>
	import { LayerCake, Svg, Html } from 'layercake';
	import { scaleBand } from 'd3-scale';

	import Column from './Column.svelte';
	import AxisY from './AxisY.svelte';
	import Area from './Area.svelte'

	export let data;
	export let dataIndex;
	export let yMax = null;
	export let yMin = 0;
	export let selected;
	export let parent;
	export let siblings;

  export let xKey = 'code';
  export let yKey = 'perc';
	
	$: yMin = yMin > 0 ? 0 : yMin;

	let xDomain;

	function setDomain() {
		xDomain = null;
		xDomain = data.map(d => d[xKey]);
	}

	$: data && setDomain();
	
</script>

<style>
	.chart-container {
		width: 100%;
		height: 100px;
		margin-top: 25px;
	}
</style>

<div class="chart-container">
	{#if xDomain}
	<LayerCake
		padding={{ top: 0, right: 0, bottom: 20, left: 20 }}
		x={xKey}
		y={yKey}
		xScale={scaleBand()}
	  xDomain={xDomain}
		yDomain={[yMin, yMax]}
		data={data}
	>
		<Svg>
			<Area
				grey={siblings ? true : false}
			/>
			<Column
				{selected}
				{parent}
				{siblings}
				{dataIndex}
			/>
			<AxisY
				ticks={2}
			/>
		</Svg>
	</LayerCake>
	{/if}
</div>