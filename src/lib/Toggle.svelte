<script>
    export let checked = false;
    export let text = "O";
    export let toggleClass = "bg-gray-200"
    export let type = "checkbox";

    let toggle = () => {
        checked = !checked;
    };
</script>

<div
    class="p-2 {checked
        ? toggleClass
        : ''} rounded-lg border-solid border-[1px] text-center"
    on:click={toggle}
    on:click
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
        transition-property: "background-color";
        transition-duration: 200ms;
    }
</style>
