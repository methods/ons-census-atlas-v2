<script>
    export let href = '/';
    export let title = 'title';
    export let id = 'card'
</script>

<div class="ons-card" id="{id}" aria-labelledBy="{id}-title" aria-describedBy="text">
    <h3 class="ons-u-fs-m" id="{id}-title">
        <a href="{href}">{title}</a>
    </h3>
    <p id="{id}-card"><slot /></p>
</div>