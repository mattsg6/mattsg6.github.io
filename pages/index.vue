<template>
    <v-container fluid class="pa-0 ma-0 d-flex flex-column h-screen overflow-hidden">
        <v-row class="w-100 d-flex justify-center pb-5 pt-10 ma-0" style="max-height: 6.25rem;">
            <span class="text-h3" style="text-align: center;">Matthew Gilmore</span>
        </v-row>
        <v-row class="w-100 d-flex justify-center ga-6 flex-wrap ma-0" style="max-height: 1.5rem;">
            <template v-for="item in menu">
                <a target="_blank" :href="item.src">{{ item.name }}</a>
            </template>
        </v-row>
        <v-row class="pa-0 ma-0 w-100 flex-grow-1" style="min-height: 0; height: 100%;">
            <scene></scene>
        </v-row>
    </v-container>
</template>
<script setup>
const menu = [
    {
        name: "resume",
        src: "https://drive.google.com/file/d/17XL5SOfTuHCNtBIhBewOrafVjPcFQ_4H/view?usp=sharing"
    },
    {
        name: "github",
        src: "https://github.com/mattsg6"
    },
    {
        name: "photography",
        src: "https://mattsg6.github.io/mgphotography"
    }
]
</script>
<style scoped>
a {
    text-decoration: none;
    color: black;
}
a:hover {
    text-decoration: underline;
}
</style>