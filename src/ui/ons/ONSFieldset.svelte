<script>
    export let title;
</script>

<fieldset class="ons-fieldset">
    <legend class="ons-fieldset__legend">
        <h1 id="fieldset-legend-title" class="ons-fieldset__legend-title ">{title}</h1>
    </legend>
    <slot />
</fieldset>