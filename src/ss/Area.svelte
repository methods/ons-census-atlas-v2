<script>
  import { getContext } from 'svelte';
  
  export let grey = false;
	
  const { data, xGet, yGet, xScale, yScale, extents } = getContext('LayerCake');

  const greys = ['#cccccc', '#f0f0f0'];

  let areas;

  $: if (grey) {
    let yRange = $yScale.range();
    areas = [];

    let bg = 'M' + $xGet($data[0]) + ',' + yRange[0] + 'L' +
      $xGet($data[0]) + ',' + yRange[1] + 'L' +
      $xGet($data[$data.length - 1]) + ',' + yRange[1] + 'L' +
      $xGet($data[$data.length - 1]) + ',' + yRange[0] + 'Z';
    areas.push({
      path: bg,
      color: greys[1]
    });

    let path = 'M' + $data
		.map(d => $xGet(d) + ',' + $yGet(d))
    .join('L');
    
    path += (
			'L' + $xGet($data[$data.length - 1]) + ',' + yRange[0] +
			'L' + $xGet($data[0]) + ',' + yRange[0] +
			'Z'
    );
    areas.push({
      path: path,
      color: greys[0]
    });
  } else {
    areas = [];

    let colors = [];
    let muted = [];
    let blocks = {};
    let yRange = $yScale.range();
    $data.forEach(d => {
      if (!colors.includes(d.color)) {
        colors.push(d.color);
        muted.push(d.muted);
        blocks[d.color] = [d];
      } else {
        blocks[d.color].push(d);
      }
    });
    colors.forEach((color, i) => {  
      let bg = 'M' + $xGet(blocks[color][0]) + ',' + yRange[0] + 'L' +
        $xGet(blocks[color][0]) + ',' + yRange[1] + 'L' +
        $xGet(blocks[color][blocks[color].length - 1]) + ',' + yRange[1] + 'L' +
        $xGet(blocks[color][blocks[color].length - 1]) + ',' + yRange[0] + 'Z';
      areas.push({
        path: bg,
        color: muted[i]
      });

      let path = 'M' + blocks[color]
      .map(d => $xGet(d) + ',' + $yGet(d))
      .join('L');
      path += (
        'L' + $xGet(blocks[color][blocks[color].length - 1]) + ',' + yRange[0] +
			  'L' + $xGet(blocks[color][0]) + ',' + yRange[0] +
			  'Z'
      );
      areas.push({
        path: path,
        color: color
      });
    });
  }
</script>

{#each areas as area}
<path class='path-area' d='{area.path}' fill={area.color} stroke-width='0'></path>
{/each}