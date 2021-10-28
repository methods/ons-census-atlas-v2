<script>
    import "../node_modules/@ons/design-system/css/census.css";
    import ONSCensusApp from "./ui/ons/ONSCensusApp.svelte"
    import ONSAccordion from "./ui/ons/ONSAccordion.svelte";
    import ONSBacklink from "./ui/ons/ONSBacklink.svelte";
    import ONSBreadcrumbs from "./ui/ons/ONSBreadcrumbs.svelte";
    import ONSBreadcrumb from "./ui/ons/partials/ONSBreadcrumb.svelte";
    import ONSButton from "./ui/ons/ONSButton.svelte";
    import ONSCard from "./ui/ons/ONSCard.svelte";
    import ONSCheckboxes from "./ui/ons/ONSCheckboxes.svelte";
    import ONSCheckbox from "./ui/ons/partials/ONSCheckbox.svelte";
    import ONSCollapsible from "./ui/ons/ONSCollapsible.svelte";
    import ONSTextField from "./ui/ons/ONSTextField.svelte";
    import ONSRadios from "./ui/ons/ONSRadios.svelte";
    import ONSRadio from "./ui/ons/partials/ONSRadio.svelte";
    import ONSTextArea from "./ui/ons/ONSTextArea.svelte";

    let hint = "This is a hint"
</script>

<ONSCensusApp>

    <h2>Backlink</h2>
    <ONSBacklink href="/monkeys"/>

    <h2>Breadcrumbs</h2>
    <ONSBreadcrumbs>
        <ONSBreadcrumb href="/home">Home</ONSBreadcrumb>
        <ONSBreadcrumb href="/home/layer-1">Layer 1</ONSBreadcrumb>
    </ONSBreadcrumbs>

    <h2>Button</h2>

    <p><ONSButton onClick={() => alert("Custom on click handler")}>Custom onclick handler</ONSButton></p>
    <p><ONSButton secondary>Secondary</ONSButton></p>
    <p><ONSButton small>Small</ONSButton></p>
    <p><ONSButton secondary small>Secondary small</ONSButton></p>
    <p><ONSButton disabled>Disabled</ONSButton></p>

    <h2>Card</h2>

    <ONSCard title="ONS Card" href="/home">Card</ONSCard>

    <h2>Checkboxes</h2>

    <ONSCheckboxes>
        <ONSCheckbox id="mobile">Mobile</ONSCheckbox>
        <ONSCheckbox id="laptop">Laptop</ONSCheckbox>
        <ONSCheckbox id="tablet">Tablet</ONSCheckbox>
    </ONSCheckboxes>

    <ONSCollapsible title="Collapsible">
        <span>here is the collapsible content</span>
    </ONSCollapsible>

    <h2>Input</h2>
    <ONSTextField id="text-field">Text field</ONSTextField>


    <h2>Text area</h2>
    <ONSTextArea id="text-area" hint="this is a hint for text area">Text area</ONSTextArea>

    <h2>Radios</h2>
    <ONSRadios name="ethnicity">
        <ONSRadio id="asian">Asian</ONSRadio>
        <ONSRadio id="black">Black</ONSRadio>
        <ONSRadio id="mixed">Mixed</ONSRadio>
        <ONSRadio id="white">White</ONSRadio>
        <ONSRadio id="other">Other</ONSRadio>
        <p>anything</p>
    </ONSRadios>
</ONSCensusApp>