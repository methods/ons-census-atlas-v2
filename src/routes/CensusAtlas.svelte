<script>
	import { geographicCodes } from '../stores.js';
	import { onMount } from "svelte";
	import { bbox } from "@turf/turf";
	import { ckmeans } from 'simple-statistics';
	import Panel from "../Panel.svelte";
	import Group from "../Group.svelte";
	import MapSource from "../MapSource.svelte";
	import MapLayer from "../MapLayer.svelte";
	import ColChart from "../charts/Histogram.svelte";
	import Loader from "../ui/Loader.svelte";
	import Select from "../ui/Select.svelte";
	import { getData, getNomis, getBreaks, getTopo, processData } from "../utils.js";
	import Map from "../Map.svelte"


	// CONFIG
	// const apiurl = "https://www.nomisweb.co.uk/api/v01/dataset/";
	// const apikey = "0x3cfb19ead752b37bb90da0eb3a0fe78baa9fa055";
	const geography = "TYPE298";
	const mapstyle = "https://bothness.github.io/ons-basemaps/data/style-omt.json";
	const tabledata = "https://bothness.github.io/census-atlas/data/indicators.json";
	const ladtopo = {
		url: "https://bothness.github.io/census-atlas/data/lad_boundaries_2020.json",
		layer: "LA2020EW",
		code: "AREACD",
		name: "AREANM"
	};
	const lsoabldg = {
		url: "https://cdn.ons.gov.uk/maptiles/buildings/v1/{z}/{x}/{y}.pbf",
		layer: "buildings",
		code: "lsoa11cd"
	};
	const lsoabounds = {
		url: "https://cdn.ons.gov.uk/maptiles/administrative/lsoa/v2/boundaries/{z}/{x}/{y}.pbf",
		layer: "lsoa",
		code: "areacd"
	};
	const ladvector = {
		url: "https://cdn.ons.gov.uk/maptiles/administrative/authorities/v1/boundaries/{z}/{x}/{y}.pbf",
		layer: "authority",
		code: "areacd"
	};
	const lsoadata = "https://bothness.github.io/census-atlas/data/lsoa2011_lad2020.csv";
	const colors = {
		base: ["#d5f690", "#5bc4b1", "#2e9daa", "#0079a2", "#005583", "#cccccc"],
		muted: ["#f5fce2", "#d7ede8", "#cbe2e5", "#c2d7e3", "#bdccd9", "#f0f0f0"]
	};

	// OBJECTS
	let map = null;

	// DATA
	let indicators;
	let ladbounds;
	let ladlookup;
	let ladlist;
	let lsoalookup;
	let data = {};
	let active = {
		lsoa: {
			selected: null,
			geometry: null,
			hovered: null
		},
		lad: {
			selected: null,
			selectedPrev: null,
			hovered: null,
			highlighted: null
		},
	};

	// STATE
	let selectCode = "QS119EW005";
	let mapLocation = null;

	let selectItem;
	let selectMeta;
	let selectData;
	let loading = true;

	let mapLoaded = false;
	let mapZoom = null;

	// FUNCTIONS
	function updateURL() {
		let hash = location.hash;
		let newhash = `#/${selectCode}/${active.lad.selected ? active.lad.selected : ''}/${active.lsoa.selected ? active.lsoa.selected : ''}/${mapLocation.zoom},${mapLocation.lon},${mapLocation.lat}`;
		if (hash != newhash) {
			history.pushState(undefined, undefined, newhash);
		}
	}

	function replaceURL() {
		let hash = `#/${selectCode}/${active.lad.selected ? active.lad.selected : ''}/${active.lsoa.selected ? active.lsoa.selected : ''}/${mapLocation.zoom},${mapLocation.lon},${mapLocation.lat}`;
		history.replaceState(undefined, undefined, hash);
	}

	function setIndicator(indicators, code) {
		indicators.forEach(indicator => {
			if (indicator.code && indicator.code == code) {
				selectItem = indicator;
			} else if (indicator.children) {
				setIndicator(indicator.children, code);
			}
		});
	}

	function initialise() {
		getTopo(ladtopo.url, ladtopo.layer)
			.then((geo) => {
				ladbounds = geo;

				let lookup = {};
				let list = [];
				geo.features.forEach((f) => {
					lookup[f.properties[ladtopo.code]] = {
						code: f.properties[ladtopo.code],
						name: f.properties[ladtopo.name]
					};
					list.push(lookup[f.properties[ladtopo.code]]);
				});

				list.sort((a, b) => a.name.localeCompare(b.name));
				ladlist = list;

				let location = geo.features[Math.floor(Math.random() * geo.features.length)];
				let bounds = bbox(location);
				mapLocation = {
					zoom: 11,
					lon: +((bounds[0] + bounds[2]) / 2).toFixed(5),
					lat: +((bounds[1] + bounds[3]) / 2).toFixed(5)
				};
				return lookup;
			})
			.then((lookup) => {
				ladlookup = lookup;

				getData(lsoadata)
					.then((data) => {
						let lookup = {};
						data.forEach((d) => {
							lookup[d.code] = {
								name: d.name,
								parent: d.parent,
							};

							if (!ladlookup[d.parent].children) {
								ladlookup[d.parent].children = [d.code];
							} else {
								ladlookup[d.parent].children.push(d.code);
							}
						});
						return lookup;
					})
					.then((lookup) => {
						lsoalookup = lookup;

						fetch(tabledata)
							.then((res) => res.json())
							.then((json) => {
								indicators = json;

								setIndicator(indicators, selectCode);

								if (!selectItem) {
									selectItem = indicators[0].children[0].children[0];
								}
							});
					});
			});
	}

	function setSelect() {
		if (!(selectMeta && selectItem && selectMeta.code == selectItem.code)) {
			let code = selectItem.code;
			let group = indicators.find((d) => d.code == code.slice(0, 3));
			let table = group.children.find((d) => d.code == code.slice(0, 7));
			let cell = +code.slice(7, 10);

			selectCode = code;

			selectMeta = {
				code: selectItem.code,
				group: group,
				table: table,
				cell: cell,
			};

			loadData();
			updateURL();
		}
	}

	function loadData() {
		console.log("loading data...");
		loading = true;
		if (data[selectItem.code]) {
			selectData = data[selectItem.code];
			console.log("data loaded from memory!");
			if (active.lad.selected) {
				setColors();
			}
			loading = false;
		} else {
			// let url = `${apiurl}${selectMeta.table.nomis}${selectMeta.cell}&geography=${geography}&uid=${apikey}`;
			let url = `https://bothness.github.io/census-atlas/data/lsoa/${selectMeta.code}.csv`;
			getNomis(url, geographicCodes, selectMeta.cell).then((res) => {
				let dataset = {
					lsoa: {},
					lad: {},
					ew: {},
				};
				res.sort((a, b) => a.perc - b.perc);
				dataset.lsoa.data = res;

				let vals = res.map(d => d.perc);
				let chunks = ckmeans(vals, 5);
				let breaks = getBreaks(chunks);
				dataset.lsoa.breaks = breaks;

				dataset.lsoa.data.forEach((d) => {
					if (d.perc <= breaks[1]) {
						d.color = colors.base[0];
						d.muted = colors.muted[0];
						d.fill = colors.base[0];
					} else if (d.perc <= breaks[2]) {
						d.color = colors.base[1];
						d.muted = colors.muted[1];
						d.fill = colors.base[1];
					} else if (d.perc <= breaks[3]) {
						d.color = colors.base[2];
						d.muted = colors.muted[2];
						d.fill = colors.base[2];
					} else if (d.perc <= breaks[4]) {
						d.color = colors.base[3];
						d.muted = colors.muted[3];
						d.fill = colors.base[3];
					} else {
						d.color = colors.base[4];
						d.muted = colors.muted[4];
						d.fill = colors.base[4];
					}
				});

				let proc = processData(res, lsoalookup);
				dataset.lsoa.index = proc.lsoa.index;

				dataset.lad.data = proc.lad.data;
				dataset.lad.index = proc.lad.index;

				let ladVals = proc.lad.data.map(d => d.perc);
				let ladChunks = ckmeans(ladVals, 5);
				dataset.lad.breaks = getBreaks(ladChunks);

				dataset.ew.data = proc.ew.data;

				data[selectItem.code] = dataset;
				selectData = dataset;
				console.log("data loaded from csv!");
				if (active.lad.selected) {
					setColors();
				}
				loading = false;
			});
		}
	}

	function doSelect() {
		if (active.lad.selected != active.lad.selectedPrev) {
			active.lad.selectedPrev = active.lad.selected;
			if (active.lad.selected && active.lsoa.selected && !ladlookup[active.lad.selected].children.includes(active.lsoa.selected)) {
				active.lsoa.selected = null;
			}
			setColors();
			updateURL();
		}
	}

	function setColors() {
		let newdata = JSON.parse(JSON.stringify(data[selectItem.code]));
		if (active.lad.selected) {
			// re-color dataset
			newdata.lsoa.data.forEach((d) => {
				if (lsoalookup[d.code].parent == active.lad.selected) {
					d.fill = d.color;
					d.selected = true;
				} else {
					d.fill = d.muted;
					d.selected = false;
				}
			});
			// zoom to district on map
			let geometry = ladbounds.features.find(f => f.properties[ladtopo.code] == active.lad.selected).geometry;
			let bounds = bbox(geometry);
			if (!active.lsoa.selected) {
				map.fitBounds(bounds, { padding: 20 });
			}
		}
		selectData = newdata;
	}

	function getSib(type, diff) {
		if (type == 'lad') {
			let index = selectData.lad.data.findIndex(d => d.code == active.lad.selected) + diff;
			if (index >= 0 && index < selectData.lad.data.length) {
				active.lsoa.selected = null;
				active.lad.selected = selectData.lad.data[index].code;
			}
		} else if (type == 'lsoa') {
			let filtered = selectData.lsoa.data.filter(d => ladlookup[active.lad.selected].children.includes(d.code));
			let index = filtered.findIndex(d => d.code == active.lsoa.selected) + diff;
			if (index >= 0 && index < filtered.length) {
				active.lsoa.selected = filtered[index].code;

				// Fit to parent LAD
				let geometry = ladbounds.features.find(f => f.properties[ladtopo.code] == active.lad.selected).geometry;
				let bounds = bbox(geometry);
				map.fitBounds(bounds, { padding: 20 });
			}
		}
	}

	// CODE
	// Update state based on URL
	let hash = location.hash == '' ? '' : location.hash.split('/');
	if (hash.length == 5) {
		selectCode = hash[1];
		active.lad.selected = hash[2] != '' ? hash[2] : '';
		active.lsoa.selected = hash[3] != '' ? hash[3] : '';
		let zxy = hash[4].split(',');
		mapLocation = {
			zoom: zxy[0],
			lon: zxy[1],
			lat: zxy[2]
		}
	}

	// Respond to URL change
	window.onpopstate = () => {
		let hash = location.hash == '' ? '' : location.hash.split('/');

		if (selectCode != hash[1]) {
			selectCode = hash[1];
			setIndicator(indicators, selectCode);
		}
		if (active.lsoa.selected != hash[3]) {
			active.lsoa.selected = hash[3] != '' ? hash[3] : null;
		} else if (active.lad.selected != hash[2]) {
			active.lad.selected = hash[2] != '' ? hash[2] : null;
		}
		if (`${mapLocation.zoom},${mapLocation.lon},${mapLocation.lat}` != hash[4]) {
			let loc = hash[4].split(',');
			mapLocation = {zoom: loc[0], center: [loc[1], loc[2]]};
			map.jumpTo(mapLocation);
		}
	}

	$: selectItem && setSelect(); // Update meta when selection updates
	$: active.lad.highlighted = lsoalookup && active.lsoa.hovered ? lsoalookup[active.lsoa.hovered].parent : null;
	$: active.lad.selected = lsoalookup && active.lsoa.selected ? lsoalookup[active.lsoa.selected].parent : active.lad.selected;
	$: (data[selectCode] && (active.lad.selected || active.lad.selected == null)) && doSelect();

	$: if (!mapLoaded && map) {
		mapLoaded = true;

		map.on('moveend', () => {
			let center = map.getCenter();
			mapLocation = {
				zoom: map.getZoom().toFixed(0),
				lon: center.lng.toFixed(5),
				lat: center.lat.toFixed(5)
			};
			replaceURL();
		});
	}

	onMount(() => initialise());
</script>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
	h1 {
		margin-top: 0;
	}
	hr {
		border: none;
		border-top: 3px solid grey;
	}
	#infobox {
		min-height: 160px;
		padding-bottom: 18px;
	}
	.text-med {
		font-size: 1.5em;
		font-weight: bold;
	}
	.text-lrg {
		font-size: 2em;
		font-weight: bold;
	}
	.grid {
		display: grid;
		grid-gap: 12px;
		grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
		justify-items: stretch;
		width: 100%;
		margin: 0;
	}
	.next {
		height: 24px;
		cursor: pointer;
	}
</style>

{#if loading}
	<Loader
		height="100vh"
		width="100vw"
		position="fixed"
		bgcolor="rgba(255, 255, 255, 0.7)" />
{/if}

<Panel>
	<h1>2011 Census Atlas Demo</h1>
	{#if indicators && selectItem}
		{#if selectData}
			<ColChart
				data={selectData.lsoa.data}
				dataIndex={selectData.lsoa.index}
				breaks={selectData.lsoa.breaks}
				avg={selectData.ew.data}
				selected={active.lsoa.hovered ? active.lsoa.hovered : active.lsoa.selected}
				parent={active.lad.hovered ? selectData.lad.index[active.lad.hovered].median.code : active.lad.highlighted ? selectData.lad.index[active.lad.highlighted].median.code : active.lad.selected ? selectData.lad.index[active.lad.selected].median.code : null}
				siblings={active.lad.selected ? ladlookup[active.lad.selected].children : null}
				key="perc" />
		{/if}
		<div id="infobox">
			{selectMeta.table.name}
			<small>({selectMeta.table.code})</small><br />
			<strong class="text-med">{selectItem.name}</strong>
			<div class="grid">
				{#if selectData}
					<div>
						<hr style="border-top-color: #871A5B" />
						<strong>England & Wales</strong><br />
						<strong
							class="text-lrg">{selectData.ew.data.perc.toFixed(1)}%</strong><br />
						<small>{selectData.ew.data.value.toLocaleString()}
							of
							{selectData.ew.data.count.toLocaleString()}
							{selectItem.unit.toLowerCase()}s</small>
					</div>
					{#if active.lad.hovered || active.lad.highlighted || active.lad.selected}
						<div>
							<hr style="border-top-color: #27A0CC" />
							<strong>{active.lad.hovered ? ladlookup[active.lad.hovered].name : active.lad.highlighted ? ladlookup[active.lad.highlighted].name : ladlookup[active.lad.selected].name}</strong><br />
							<strong class="text-lrg">
								{#if active.lad.selected}<img src="./icons/chevron-left.svg" class="next" on:click={() => getSib('lad', -1)}>{/if}
								{active.lad.hovered ? selectData.lad.index[active.lad.hovered].perc.toFixed(1) : active.lad.highlighted ? selectData.lad.index[active.lad.highlighted].perc.toFixed(1) : selectData.lad.index[active.lad.selected].perc.toFixed(1)}%
								{#if active.lad.selected}<img src="./icons/chevron-right.svg" class="next" on:click={() => getSib('lad', 1)}>{/if}
							</strong><br />
							<small>{active.lad.hovered ? selectData.lad.index[active.lad.hovered].value.toLocaleString() : active.lad.highlighted ? selectData.lad.index[active.lad.highlighted].value.toLocaleString() : selectData.lad.index[active.lad.selected].value.toLocaleString()}
								of
								{active.lad.hovered ? selectData.lad.index[active.lad.hovered].count.toLocaleString() : active.lad.highlighted ? selectData.lad.index[active.lad.highlighted].count.toLocaleString() : selectData.lad.index[active.lad.selected].count.toLocaleString()}
								{selectItem.unit.toLowerCase()}s</small>
						</div>
					{:else}
						<div />
					{/if}
					{#if active.lsoa.hovered || active.lsoa.selected}
						<div>
							<hr style="border-top-color: #000000" />
							<strong>{active.lsoa.hovered ? lsoalookup[active.lsoa.hovered].name.slice(-4) : lsoalookup[active.lsoa.selected].name.slice(-4)}</strong><br />
							<strong class="text-lrg">
								{#if active.lsoa.selected}<img src="./icons/chevron-left.svg" class="next" on:click={() => getSib('lsoa', -1)}>{/if}
								{active.lsoa.hovered ? selectData.lsoa.index[active.lsoa.hovered].perc.toFixed(1) : selectData.lsoa.index[active.lsoa.selected].perc.toFixed(1)}%
								{#if active.lsoa.selected}<img src="./icons/chevron-right.svg" class="next" on:click={() => getSib('lsoa', 1)}>{/if}
							</strong><br />
							<small>{active.lsoa.hovered ? selectData.lsoa.index[active.lsoa.hovered].value.toLocaleString() : selectData.lsoa.index[active.lsoa.selected].value.toLocaleString()}
								of
								{active.lsoa.hovered ? selectData.lsoa.index[active.lsoa.hovered].count.toLocaleString() : selectData.lsoa.index[active.lsoa.selected].count.toLocaleString()}
								{selectItem.unit.toLowerCase()}s</small>
						</div>
					{:else}
						<div />
					{/if}
				{/if}
			</div>
		</div>

		{#if ladlist}
			<Select
				options={ladlist}
				bind:selected={active.lad.selected}
				search={true}
				placeholder="Find a district..."
				on:select={() => active.lsoa.selected = null} />
		{/if}

		<Group
			props={{ name: '2011 Census Tables', children: indicators.slice(0, 8) }}
			bind:selected={selectItem}
			expanded />
	{/if}
</Panel>

{#if mapLocation}
<Map bind:map style={mapstyle} minzoom={4} maxzoom={14} bind:zoom={mapZoom} location={mapLocation}>
	{#if selectData}
		<MapSource
			id="lsoa"
			type="vector"
			url={lsoabldg.url}
			layer={lsoabldg.layer}
			promoteId={lsoabldg.code}
			maxzoom={13}>
			<MapLayer
				id="lsoa"
				source="lsoa"
				sourceLayer={lsoabldg.layer}
				data={selectData}
				type="fill"
				paint={{
					'fill-color': ['case',
						['!=', ['feature-state', 'color'], null], ['feature-state', 'color'],
						'rgba(255, 255, 255, 0)'
					]
				}}
				order="tunnel_motorway_casing" />
		</MapSource>
		<MapSource
			id="lsoa-bounds"
			type="vector"
			url={lsoabounds.url}
			layer={lsoabounds.layer}
			promoteId={lsoabounds.code}
			minzoom={9}
			maxzoom={12}>
			<MapLayer
				id="lsoa-fill"
				source="lsoa-bounds"
				sourceLayer={lsoabounds.layer}
				type="fill"
				paint={{ 'fill-color': 'rgba(255, 255, 255, 0)' }}
				hover={true}
				bind:hovered={active.lsoa.hovered}
				click={true}
				clickCenter={true}
				bind:selected={active.lsoa.selected} />
			<MapLayer
				id="lsoa-bounds"
				source="lsoa-bounds"
				sourceLayer={lsoabounds.layer}
				type="line"
				paint={{
					'line-color': ['case',
						['==', ['feature-state', 'selected'], true], 'rgba(0, 0, 0, 1)',
						['==', ['feature-state', 'hovered'], true], 'rgba(0, 0, 0, 1)',
						'rgba(0, 0, 0, 0)'
					],
					'line-width': ['case',
						['==', ['feature-state', 'selected'], true], 2,
						['==', ['feature-state', 'hovered'], true], 2,
						0
					]
				}} />
		</MapSource>
	{/if}
	{#if ladbounds}
		<MapSource
			id="lad"
			type="vector"
			url={ladvector.url}
			layer={ladvector.layer}
			promoteId={ladvector.code}>
			<MapLayer
				id="lad"
				source="lad"
				sourceLayer={ladvector.layer}
				type="line"
				highlight={true}
				highlighted={active.lad.highlighted}
				filter={[
					"all",
					["==", "lower", "true"],
					["in", "country", "E", "W"]
				]}
				paint={{
					'line-color': ['case',
						['==', ['feature-state', 'selected'], true], '#27A0CC',
						['==', ['feature-state', 'hovered'], true], '#27A0CC',
						['==', ['feature-state', 'highlighted'], true], '#27A0CC',
						'rgba(192, 192, 192, 1)'
					],
					'line-width': ['case',
						['==', ['feature-state', 'selected'], true], 2,
						['==', ['feature-state', 'hovered'], true], 2,
						['==', ['feature-state', 'highlighted'], true], 2,
						0.75
					]
				}}
				order="place_other" />
			<MapLayer
				id="lad-fill"
				source="lad"
				sourceLayer={ladvector.layer}
				type="fill"
				filter={[
					"all",
					["==", "lower", "true"],
					["in", "country", "E", "W"]
				]}
				paint={{ 'fill-color': 'rgba(255, 255, 255, 0)' }}
				hover={true}
				bind:hovered={active.lad.hovered}
				click={true}
				bind:selected={active.lad.selected}
				maxzoom={8.99}
				on:select={() => active.lsoa.selected = null} />
		</MapSource>
	{/if}
</Map>
{/if}