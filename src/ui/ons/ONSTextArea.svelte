<script>
    export let id;
    export let name = '';
    export let rows = 8;
    export let value = ''
    export let hint = ''
</script>

<div class="ons-field">
    <label class="ons-label  ons-label--with-description " for="{id}">
        <slot/>
    </label>
    {#if hint}
        <span id="{id}-description-hint" class="ons-label__description  ons-input--with-description">
            {hint}
        </span>
    {/if}
    <textarea id={id} class="ons-input ons-input--textarea   " name={name ? name : id} {rows}></textarea>
</div>