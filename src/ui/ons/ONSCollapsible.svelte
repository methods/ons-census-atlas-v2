<script>
    export let title = '';
</script>

<div id="collapsible" class="ons-collapsible ons-js-collapsible" data-btn-close="Hide this">
    <div class="ons-collapsible__heading ons-js-collapsible-heading">
        <div class="ons-collapsible__controls">
            <h2 class="ons-collapsible__title">{title ? title : ''}</h2>
            <span class="ons-collapsible__icon">
        <svg class="ons-svg-icon " viewBox="0 0 8 13" xmlns="http://www.w3.org/2000/svg" focusable="false" fill="currentColor">
          <path d="M5.74,14.28l-.57-.56a.5.5,0,0,1,0-.71h0l5-5-5-5a.5.5,0,0,1,0-.71h0l.57-.56a.5.5,0,0,1,.71,0h0l5.93,5.93a.5.5,0,0,1,0,.7L6.45,14.28a.5.5,0,0,1-.71,0Z" transform="translate(-5.02 -1.59)" />
        </svg>
      </span>
        </div>
    </div>
    <div id="collapsible-content" class="ons-collapsible__content ons-js-collapsible-content">
        <slot />
        <button type="button" class="ons-btn ons-js-collapsible-button ons-u-d-no ons-btn--secondary ons-btn--small" aria-hidden="true">
            <span class="ons-btn__inner ons-js-collapsible-button-inner">Hide this</span>
            <span class="ons-btn__context ons-u-vh">What is a photovoltaic system? content</span>
        </button>
    </div>
</div>