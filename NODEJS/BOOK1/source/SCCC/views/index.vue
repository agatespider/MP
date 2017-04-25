<template lang="html">
    <div>
        <h1>{{title}}</h1>

        <ol>
            <li v-for="movie in movies">
                {{movie.name}}
            </li>
        </ol>

        <button v-on:click="plus">click me!</button>

    </div>
</template>

<script>
export default {
    data: function() {
        return {
            a: 1
        }
    },
    methods: {
        plus: function() {
            console.log("PPPPPPPPPPPPPPPP");
        }
    }
}
</script>

<style lang="css">
</style>