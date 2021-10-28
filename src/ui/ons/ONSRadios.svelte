<script>
    import { setContext } from 'svelte';

    export let name;
    setContext('name', name)

</script>

<div class="ons-input-items">
    <div class="ons-radios__items">
        <slot />
    </div>
</div>