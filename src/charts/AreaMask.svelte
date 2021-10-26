<script>
  import { getContext } from 'svelte';
	import { line, curveCardinal } from 'd3-shape';

  const { data, xGet, yGet, xScale, yScale, extents } = getContext('LayerCake');
	const linefn = line().curve(curveCardinal);

	export let maskId = 'area-mask';
	
	function avg(arr) {
		let tot = 0;
		arr.forEach(d => {tot += +d});
		return tot / arr.length;
	}
	
	let path;
	
  $: {
		const yRange = $yScale.range();
		let startPt = [$xScale($extents.x ? $extents.x[0] : 0), yRange[0]];
		let dataPts = $data.map(d => {
      return [avg($xGet(d)), $yGet(d)];
    });
		let endPt = [$xScale($extents.x ? $extents.x[1] : 0), yRange[0]];
		path = linefn([startPt, ...dataPts, endPt]) + 'Z'; // Generate closed area curve
	};

</script>

<mask id="{maskId}">
	<rect
		class='mask-rect'
		x="{$xScale($extents.x[0])}"
		y="{$yScale($extents.y[1])}"
		width="{$xScale($extents.x[1])}"
		height="{$yScale($extents.y[0])}"
		fill="#444"
	/>
	<path class="mask-area" d="{path}" fill="#fff"></path>
</mask>