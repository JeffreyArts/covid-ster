<template>
    <section class="take-action-block">
        <section class="take-action-block-overlay">
            <div class="take-action-block-container">
                <div class="take-action-title-container">
                    <h2 class="take-action-title">{{lng.takeActionBlock.callToAction}}</h2>
                </div>

                <div class="take-action-description-container">
                    <p class="covid-star-take-action-text" v-html="lng.takeActionBlock.text"></p>
                </div>
                <div class="take-action-list">
                    <article class="covid-star-card" v-for="card in cards">

                        <covid-star-view v-bind:seed="card.seed" class="covid-star" v-bind:type="'image'" :class="[!alternateSeed ? '__isVisible' : '']"></covid-star-view>

                        <input type="text" name="seed" :placeholder="card.placeholder" id="seed" v-model="card.seedInput" v-on:blur="updateCovidStar(card)" v-on:keyup="processSeed(card)">

                        <div class="covid-star-card-buttons-container">
                            <button type="button" name="order" class="button __isPrimary">{{lng.main.order}}</button>
                            <button type="button" name="download" class="button ">{{lng.main.download}}</button>
                        </div>
                    </article>
                </div>
                <div class="take-action-notice-container">
                    <strong class="take-action-notice-title" v-html="lng.takeActionBlock.noticeTitle"></strong>
                    <p class="take-action-notice-text" v-html="lng.takeActionBlock.notice"></p>
                </div>
            </div>
        </section>
    </section>
</template>

<script>

    import LNG from './../../../services/languages.js'
    import covidStarView from './../../../components/covid-star/covid-star.vue'

    export default {
        components: {covidStarView},
        props: [],
        data() {
            return {
                lng: LNG.data,
                updatingSeed: false,
                cards: [
                    {
                        placeholder: LNG.data.takeActionBlock.placeholders[0],
                        seedInput: "",
                        seed: "default"
                    },
                    {
                        placeholder: LNG.data.takeActionBlock.placeholders[1],
                        seedInput: "",
                        seed: "default"
                    },
                    {
                        placeholder: LNG.data.takeActionBlock.placeholders[2],
                        seedInput: "",
                        seed: "default"
                    }
                ]
            }
        },
        methods: {

            updateCovidStar(card) {
                console.log('card',card);
                if (card.seedInput == card.seed) {
                    return;
                }
                card.seed = card.seedInput;
            },
            processSeed(card) {
                if(this.updatingSeed || card.seedInput == card.seed) {
                    clearTimeout(this.updatingSeed);
                }

                this.updatingSeed = setTimeout(() => {
                    this.updateCovidStar(card)
                }, 440);
            },
        },
        mounted() {
            document.addEventListener("languageChange",() => {
                this.lng = LNG.data;

                this.cards[0].placeholder = LNG.data.takeActionBlock.placeholders[0];
                this.cards[1].placeholder = LNG.data.takeActionBlock.placeholders[1];
                this.cards[2].placeholder = LNG.data.takeActionBlock.placeholders[2];
            },false);

            window.addEventListener('resize', this.updateCanvasSize);
        }
    }
</script>


<style src="./take-action.scss"></style>