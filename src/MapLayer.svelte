<script>
	import { getContext } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import { centroid } from "@turf/turf";

	const dispatch = createEventDispatcher();
	
	export let id;
	export let source;
	export let sourceLayer = null;
	export let type;
	export let filter = null;
	export let layout = {};
	export let paint = {};
	export let data = null;
	export let colors = null;
	export let selected = null;
	export let highlighted = null;
	export let hovered = null;
	export let click = false;
	export let clickCenter = false;
	export let hover = false;
	export let highlight = false;
	export let order = null;
	export let maxzoom;
	export let minzoom;
	
	const { getMap } = getContext('map');
	const map = getMap();
	
	let selectedPrev = null;
	let highlightedPrev = null;
	let selectedGeo = null;
	
	if (map.getLayer(id)) {
    map.removeLayer(id);
	}
	
	let options = {
		'id': id,
		'type': type,
		'source': source,
		'paint': paint,
		'layout': layout
	};

	if (filter) {
		options['filter'] = filter;
	}
	
	if (sourceLayer) {
		options['source-layer'] = sourceLayer;
	}
	if (maxzoom) {
		options['maxzoom'] = maxzoom;
	}
	if (minzoom) {
		options['minzoom'] = minzoom;
	}
	
	map.addLayer(options, order);

	function updateData() {
		console.log('updating colours...');

		data.lsoa.data.forEach(d => {
			map.setFeatureState({
				source: source,
				sourceLayer: sourceLayer,
				id: d.code
			}, {
				color: d.fill
			});
		});
	}

	$: data && updateData();
	
	$: if (click && selected != selectedPrev) {
		if (selectedPrev) {
			map.setFeatureState(
				{ source: source, sourceLayer: sourceLayer, id: selectedPrev },
				{ selected: false }
			);
		}
		if (selected) {
			map.setFeatureState(
				{ source: source, sourceLayer: sourceLayer, id: selected },
				{ selected: true }
			);
		}
		selectedPrev = selected;
	}

	$: if (highlight && highlighted != highlightedPrev) {
		if (highlightedPrev) {
			map.setFeatureState(
				{ source: source, sourceLayer: sourceLayer, id: highlightedPrev },
				{ highlighted: false }
			);
		}
		if (highlighted) {
			map.setFeatureState(
				{ source: source, sourceLayer: sourceLayer, id: highlighted },
				{ highlighted: true }
			);
		}
		highlightedPrev = highlighted;
	}
	
	if (click) {
		map.on('click', id, (e) => {
      if (e.features.length > 0) {
				selected = e.features[0].id;

				dispatch('select', {
					code: selected
				});
				
				if (selectedPrev) {
					map.setFeatureState(
            { source: source, sourceLayer: sourceLayer, id: selectedPrev },
            { selected: false }
          );
				}
				
				map.setFeatureState(
          { source: source, sourceLayer: sourceLayer, id: selected },
          { selected: true }
				);

				if (clickCenter) {
					let center = centroid(e.features[0].toJSON().geometry);
					map.flyTo({
						center: center.geometry.coordinates
					});
				}
				
				selectedPrev = selected;
			} else {
				selectedPrev = selected = null;
				dispatch('select', {
					code: null
				});
			}
    });
	}
	
	if (hover) {
		map.on('mousemove', id, (e) => {
      if (e.features.length > 0) {
        if (hovered) {
          map.setFeatureState(
            { source: source, sourceLayer: sourceLayer, id: hovered },
            { hovered: false }
          );
        }
				hovered = e.features[0].id;
				
        map.setFeatureState(
          { source: source, sourceLayer: sourceLayer, id: hovered },
          { hovered: true }
        );

        // Change the cursor style as a UI indicator.
				map.getCanvas().style.cursor = 'pointer';
      }
		});
		
		map.on('mouseleave', id, (e) => {
			if (hovered) {
        map.setFeatureState(
          { source: source, sourceLayer: sourceLayer, id: hovered },
          { hovered: false }
				);
      }
			hovered = null;
    });
	}
	
</script>