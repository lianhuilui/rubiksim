<script>
    export let selected = "";
    export let colors;
</script>

<button
    on:click
    class="p-2 rounded-lg border-solid border-2 text-center"
    class:bg-gray-400={selected}
>
    <div class="flex border-[1px] border-black w-12">
        {#each colors as c}
            <div style="background-color: {c.color};" class="grow h-4">
            </div>
        {/each}
    </div>
</button>

<style>
</style>
