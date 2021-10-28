<script>
    export let onClick = () => alert('Button clicked');
    export let secondary = false;
    export let small = false;
    export let disabled = false;
</script>

<button on:click={onClick}
        class="ons-btn
               {secondary ? 'ons-btn--secondary' : ''}
                {small ? 'ons-btn--small' : ''}
                {disabled ? 'ons-btn--disabled': ''}"
        disabled={disabled}>
    <span class="ons-btn__inner"><slot>Okay</slot></span>
</button>

