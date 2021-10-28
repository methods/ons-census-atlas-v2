<script>
    export let phase = 'alpha';
</script>

<div class="ons-phase-banner">
    <div class="ons-container">
        <div class="ons-grid ons-grid--flex ons-grid--gutterless ons-grid--vertical-top ons-grid--no-wrap">
            <div class="ons-grid__col ons-col-auto ons-u-flex-no-grow ons-u-flex-no-shrink">
                <h3 class="ons-phase-banner__badge">{phase}</h3>
            </div>
            <div class="ons-grid__col ons-col-auto ons-u-flex-shrink">
                <p class="ons-phase-banner__desc ons-u-fs-s ons-u-mb-no"><slot /></p>
            </div>
        </div>
    </div>
</div>