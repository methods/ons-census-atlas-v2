<script>
	import { LayerCake, Svg } from 'layercake';
	import { histogram } from 'd3-array';
	import { scalePow } from 'd3-scale';

	import AreaMask from './AreaMask.svelte';
	import Stack from './Stack.svelte';
	import Marker from './Marker.svelte';
	import AxisX from './AxisX.svelte';
	import { getThresholds } from '../utils.js';

	export let data;
	export let dataIndex;
	export let breaks;
	export let avg = null;
	export let selected = null;
	export let parent = null;
	export let siblings = null;
	export let key = 'perc';

	const xKey = ['x0', 'x1'];
	const yKey = 'length';
	const maskId = 'area-mask';
	const binCount = 32; // number of bins for histogram chart

	let sibData = null;

	$: domain = [breaks[0], breaks[breaks.length - 1]];

	$: scale = (breaks[1] - domain[0]) / (domain[1] - domain[0]) < 1 / 20 ? 0.5 : (breaks[4] - domain[0]) / (domain[1] - domain[0]) > 19 / 20 ? 2 : 1;

	$: formatTick = d => d.toFixed(Math.abs(breaks[1] - domain[0]) < 0.1 ? 2 : Math.abs(breaks[1] - domain[0]) < 1 ? 1 : 0);

	$: scaleActive = scalePow().exponent(scale);
	
	$: thresh = getThresholds(domain, scale, binCount);
	
	$: hist = histogram()
		.domain([thresh[0], thresh[thresh.length - 1]])
		.thresholds(thresh);

	$: if (siblings) {
		let sibs = [];
		siblings.forEach(code => {
			sibs.push(dataIndex[code]);
		});
		sibData = sibs;
	} else {
		sibData = null;
	}

	$: parData = parent ? dataIndex[parent] : null;

	$: selData = selected ? dataIndex[selected] : null;
</script>

<style>
	.chart-container {
		width: 100%;
		height: 100px;
	}
	.input-container {
		text-align: right;
	}
	input {
		height: auto;
	}
	label {
		display: inline-block;
		margin-right: 5px;
	}
</style>

{#if scaleActive}
<div class="chart-container">
	<LayerCake
		padding={{ top: 0, right: 0, bottom: 30, left: 0 }}
		x={xKey}
		xDomain={domain}
		xScale={scaleActive}
		y={yKey}
		yDomain={[0, null]}
		data={hist(data.map(d => d[key]))}
	>
		<Svg>
			<defs>
				<AreaMask
					{maskId}
				/>
			</defs>
			<Stack
				ticks={breaks}
				muted={sibData ? true : false}
				{maskId}
			/>
			<Marker
				values={sibData}
				breaks={breaks.slice(1,breaks.length)}
				avg={avg}
				parent={parData}
				selected={selData}
				{maskId}
				{key}
			/>
			<AxisX
				gridlines={true}
				baseline={true}
				snapTicks={true}
				ticks={breaks}
				dyTick={5}
				{formatTick}
			/>
		</Svg>
	</LayerCake>
</div>
{/if}