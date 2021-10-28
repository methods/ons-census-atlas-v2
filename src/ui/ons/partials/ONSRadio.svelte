<script>
    import {getContext} from 'svelte';

    export let id;
    export let value;
    export let checked = false;
    let name = getContext('name')
</script>

<p class="ons-radios__item">
          <span class="ons-radio">
            <input type="radio" id="{id}" class="ons-radio__input ons-js-radio" bind:value="{value}" name="{name}">
            <label class="ons-radio__label" for="{id}" id="{id}-label">
                <slot/>
            </label>
          </span>
</p>