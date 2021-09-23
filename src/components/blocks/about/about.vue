<template>
    <section class="about-block">
        <section class="about-block-overlay">
            <div class="about-block-container">
                <h1 class="covid-star-title">{{lng.aboutBlock.title}}</h1>

                <div>
                    <p class="covid-star-about-text" v-html="lng.aboutBlock.text"></p>
                </div>
            </div>
        </section>
    </section>
</template>

<script>

    import LNG from './../../../services/languages.js'

    export default {
        components: {},
        props: [],
        data() {
            return {
                lng: LNG.data,
            }
        },
        methods: {
        },
        mounted() {
            document.addEventListener("languageChange",() => {
                this.lng = LNG.data;
            },false);
        }
    }
</script>


<style src="./about.scss"></style>