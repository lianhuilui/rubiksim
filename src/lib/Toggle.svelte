<script>
    export let checked = false;
    export let text = "O";
    export let toggleClass = "bg-green-600";

    let toggle = () => {
        console.log("toggle")
        checked = !checked;
    };
</script>

<div
    class="h-10 p-2 {checked
        ? toggleClass
        : ''} rounded-lg border-solid border-2 text-center"
    on:click={toggle}
    on:click
>
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
