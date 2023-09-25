<script>
    export let color = "";
    export let selected = "";
    export let name = "default";

    let colors = color.split(",");
</script>

<button
    on:click
    class="p-2 rounded-lg border-solid border-2 text-center"
    class:bg-gray-200={selected == color}
>
    <span class="block">
    {name}
    </span>

    <div class="flex border-[1px] border-black">
        {#each colors as c}
            <div style="background-color: {c};" class="grow h-4">
            </div>
        {/each}
    </div>
</button>

<style>
</style>
