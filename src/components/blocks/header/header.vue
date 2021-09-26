<template>
    <section class="header-block">
        <h1 class="covid-star-label">{{lng.headerBlock.covidStarLabel}}</h1>
        <ul class="bulletpoints">
            <li v-for="listItem in lng.headerBlock.headerList">{{listItem}}</li>
        </ul>
        <language-select></language-select>
        <div class="mainstage-container">
            <div class="mainstage">
                <div class="covid-star-container">
                    <covid-star-view v-bind:seed="seed" v-bind:filetype="'svg'" v-bind:outline="true"></covid-star-view>
                </div>
                <input type="text" name="seed" id="seed" v-model="seedInput" v-on:focus="stopAnimation" v-on:blur="updateCovidStar(seedInput)" v-on:keyup="processSeed">

                <div class="buttons-container">
                    <button type="button" name="order" class="button __isPrimary">{{lng.main.order}}</button>
                    <button type="button" name="download" class="button" @click="download(seed)">{{lng.main.download}}</button>
                </div>
            </div>
        </div>
    </section>
</template>

<script>

    import seedrandom  from "seedrandom";
    import cookie from 'js-cookie';
    import router from './../../../routes'

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
                lng: LNG.data,
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
                if (seedValue == this.seed) {
                    return;
                }

                this.seed = seedValue
            },
            download(seed) {
                cookie.set('activeSeed', seed, { expires: 3 });
                router.push({ name: 'download'})
            },
            processSeed() {
                if(this.updatingSeed || this.seedInput == this.seed) {
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
            document.addEventListener("languageChange",() => {
                this.lng = LNG.data;
                this.defaults = LNG.data.headerBlock.inputSeeds;
            },false);
            setTimeout(this.animateInput, 3200);
        }
    }
</script>


<style src="./header.scss"></style>