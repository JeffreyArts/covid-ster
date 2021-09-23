<template>
    <section class="footer-block">
        <section class="footer-block-overlay">
            <div class="footer-block-container">
                <h1 class="footer-block-title">{{lng.footerBlock.title}}</h1>

                <div class="footer-block-text-container">
                    <p class="footer-block-text" v-html="lng.footerBlock.text"></p>
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


<style src="./footer.scss"></style>