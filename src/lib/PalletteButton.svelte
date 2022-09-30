<script>
    export let color = "";
    export let selected = "";
    export let name = "default";

    let colors = color.split(",");
</script>

<button
    on:click
    class="h-10 p-2 rounded-lg border-solid border-2 text-center"
    class:bg-green-600={selected == color}
>
    {name}

    <div>
        {#each colors as c}
            <span style="background-color: {c}">&nbsp;</span>
        {/each}
    </div>
</button>

<style>
    div {
        display: inline;
        width: auto;
        border: 1px solid black;
    }
</style>
