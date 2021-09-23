<style src="./home.scss"></style>
<template>
    <div class="home">
        <header-block></header-block>
        <about-block></about-block>

    </div>
</template>


<script>

import aboutBlock from './../../components/blocks/about/about.vue'
import headerBlock from './../../components/blocks/header/header.vue'


export default {
    components: {headerBlock, aboutBlock},
    props: [],
    data() {
        return {
        }
    },
    methods: {
    },
    mounted() {


    }
}

</script>