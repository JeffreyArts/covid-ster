<template>
    <section class="header-block">
        <h1 class="covid-star-label">{{lng.covidStarLabel}}</h1>
        <ul class="bulletpoints">
            <li v-for="listItem in lng.headerList">{{listItem}}</li>
        </ul>
        <language-select></language-select>
        <div class="mainstage">
            <div class="covid-star-container" ratio="1x1">
                <img class="placeholder" src="/images/not-a-tracking-pixel.gif"/>
                <covid-star-view v-bind:seed="seed" class="covid-star" :class="[alternateSeed ? '__isVisible' : '']"></covid-star-view>
                <covid-star-view v-bind:seed="seeed" class="covid-star" :class="[!alternateSeed ? '__isVisible' : '']"></covid-star-view>
            </div>
            <input type="text" name="seed" id="seed" v-model="seedInput" v-on:focus="stopAnimation" v-on:blur="updateCovidStar(seedInput)" v-on:keyup="processSeed">

            <div class="buttons-container">
                <button type="button" name="order" class="button __isPrimary">{{lng.order}}</button>
                <button type="button" name="download" class="button ">{{lng.download}}</button>
            </div>
        </div>
    </section>
</template>

<script>

    import seedrandom  from "seedrandom";
    import covidStarView from './../../../components/covid-star/covid-star.vue'
    import languageSelect from './../../../components/language-select/language-select.vue'
    import LNG from './../../../services/languages.js'

    export default {
        components: {covidStarView, languageSelect},
        props: [],
        data() {
            return {
                defaults: LNG.data.headerBlock.inputSeeds,
                seedInput: "",
                updatingSeed: false,
                seed: "",
                seeed: "",
                lng: {
                    covidStarLabel: LNG.data.headerBlock.covidStarLabel,
                    headerList: LNG.data.headerBlock.headerList,
                    order: LNG.data.main.order,
                    download: LNG.data.main.download,
                },
                alternateSeed: true,
                inputAnimation: {
                    active: true,
                    index: 1,
                    charIndex: 1,
                    speed: 320
                }
            }
        },
        methods: {
            updateCovidStar(seedValue) {
                if (seedValue == this.seeed || seedValue == this.seed) {
                    return;
                }

                if (this.alternateSeed) {
                    this.seeed = seedValue
                } else {
                    this.seed = seedValue
                }

                this.alternateSeed = !this.alternateSeed
            },
            processSeed() {
                if(this.updatingSeed || this.seedInput == this.seeed || this.seedInput == this.seed) {
                    clearTimeout(this.updatingSeed);
                }

                this.updatingSeed = setTimeout(() => {
                    this.updateCovidStar(this.seedInput)
                }, 440);
            },
            stopAnimation() {
                this.seedInput = "";
                this.inputAnimation = false;
            },
            animateInput() {
                if (this.inputAnimation) {
                    // var i = this.inputAnimation.index;
                    var word = this.defaults[this.inputAnimation.index];
                    this.seedInput = word.substr(0,this.inputAnimation.charIndex);
                    this.inputAnimation.charIndex++;

                    // If character exceeds word length, update star and prepare for next word.
                    if (this.inputAnimation.charIndex > word.length) {
                        this.inputAnimation.index++;
                        this.inputAnimation.charIndex = 1;

                        if (this.inputAnimation.index >= this.defaults.length) {
                            this.inputAnimation.index = 0
                        }

                        setTimeout(() => {
                            this.updateCovidStar(this.seedInput)
                        }, this.inputAnimation.speed);

                        setTimeout(this.animateInput, 3200);
                    } else {

                        setTimeout(this.animateInput, this.inputAnimation.speed - Math.random()*120);
                    }
                }

            }
        },
        mounted() {
            this.seed = this.defaults[0];
            this.seedInput = this.seed;

            setTimeout(this.animateInput, 2400)
        }
    }
</script>


<style src="./header.scss"></style>