<script>
    export let checked = false;
    export let text = "O";
    export let toggleClass = "bg-gray-200"
    export let type = "checkbox";
    export let bgcolor = "";

    let toggle = () => {
        checked = !checked;
    };
</script>

<div
    class="p-2 {checked
        ? toggleClass
        : ''} rounded-lg border-solid border-[1px]"
    on:click={toggle}
    on:click
    style={bgcolor ? `background-color: ${bgcolor}` : ""}
>

    <slot />

    {#if type == "checkbox"}
        <input type="checkbox" {checked} />
    {:else if type == "radio"}
        <input type="radio" {checked} />
    {/if}

    {text}
</div>

<style>
    div {
        cursor: pointer;
        user-select: none;
    }
</style>
