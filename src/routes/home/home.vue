<style src="./home.scss"></style>
<template>
    <div class="home">
        <header-block></header-block>
        <about-block></about-block>
        <take-action-block></take-action-block>
        <footer-block></footer-block>

    </div>
</template>


<script>

import aboutBlock from './../../components/blocks/about/about.vue'
import headerBlock from './../../components/blocks/header/header.vue'
import footerBlock from './../../components/blocks/footer/footer.vue'
import takeActionBlock from './../../components/blocks/take-action/take-action.vue'


export default {
    components: {headerBlock, aboutBlock,footerBlock, takeActionBlock},
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