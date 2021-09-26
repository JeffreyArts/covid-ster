<style src="./download.scss"></style>
<template>
    <figure :style="{'background-image':`url(${imageData.png})`, 'background-position-y': bgPos}" class="download-background"></figure>
    <div class="download-container">
        <h1 class="download-title">{{lng.downloadPage.title}}</h1>

        <header class="download-header">
            <div class="download-column">
                <p class="download-header-take-action-text" v-html="lng.downloadPage.headerText"></p>
            </div>
            <div class="download-card">
                <covid-star v-bind:seed="seed" v-bind:filetype="'png'" v-bind:outline="false" v-bind:output="imageData"></covid-star>
                <input type="text" name="seed" id="seed" v-model="seedInput" v-on:focus="stopAnimation" v-on:blur="updateCovidStar(seedInput)" v-on:keyup="processSeed">
            </div>
        </header>

        <div class="download-step">
            <div class="download-column">
                <header class="download-step-header">
                    <h2 class="download-step-header-text">{{lng.downloadPage.downloadSection.title}}</h2>
                    <svg class="download-step-header-icon" :class="[downloadStepComplete ? '__isCompleted' : '']" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48.1 48.1" style="enable-background:new 0 0 48.1 48.1;" xml:space="preserve">
                        <path class="unchecked" d="M24.1,0.1c-13.3,0-24,10.7-24,24s10.7,24,24,24s24-10.7,24-24S37.3,0.1,24.1,0.1z M21,36.5 L8.8,24.2l3.9-3.9l8.4,8.4L37,12.8l3.9,3.9L21,36.5z"/>
                        <polygon class="checked" points="21,36.5 8.8,24.2 12.6,20.4 21,28.8 37,12.8 40.8,16.7 "/>
                    </svg>
                </header>

                <p class="download-step-description" v-html="lng.downloadPage.downloadSection.description"></p>
            </div>

            <div class="download-step-row">
                <div class="download-step-covid-star-container">
                    <figure class="download-step-covid-star-image" id="covid-star-no-outline" ratio="1x1">
                        <covid-star v-bind:seed="seed" v-bind:filetype="'svg'" v-bind:outline="false" v-bind:output="noOutline"></covid-star>
                    </figure>
                    <span class="download-step-covid-star-text">{{lng.downloadPage.downloadSection.noOutline}}</span>

                    <div class="download-step-covid-star-buttons-container">
                        <button @click="downloadImage(noOutline, 'png')" class="button __isPrimary">
                            PNG
                        </button>
                        <button @click="downloadImage(noOutline, 'svg')" class="button __isPrimary">
                            SVG
                        </button>
                    </div>
                </div>


                <div class="download-step-covid-star-container">
                    <figure class="download-step-covid-star-image" id="covid-star-outline" ratio="1x1">

                        <covid-star v-bind:seed="seed" v-bind:filetype="'svg'" v-bind:outline="true" v-bind:output="outline"></covid-star>
                    </figure>
                    <span class="download-step-covid-star-text">{{lng.downloadPage.downloadSection.outline}}</span>

                    <div class="download-step-covid-star-buttons-container">
                        <button @click="downloadImage(outline, 'png', 'outline')" class="button __isPrimary">
                            PNG
                        </button>
                        <button @click="downloadImage(outline, 'svg', 'outline')" class="button __isPrimary">
                            SVG
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="diy-step">
            <div class="download-column">
                <header class="download-step-header">
                    <h2 class="download-step-header-text">{{lng.downloadPage.diySection.title}}</h2>
                    <svg class="download-step-header-icon" :class="[diyStepComplete ? '__isCompleted' : '']" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48.1 48.1" style="enable-background:new 0 0 48.1 48.1;" xml:space="preserve">
                        <path class="unchecked" d="M24.1,0.1c-13.3,0-24,10.7-24,24s10.7,24,24,24s24-10.7,24-24S37.3,0.1,24.1,0.1z M21,36.5 L8.8,24.2l3.9-3.9l8.4,8.4L37,12.8l3.9,3.9L21,36.5z"/>
                        <polygon class="checked" points="21,36.5 8.8,24.2 12.6,20.4 21,28.8 37,12.8 40.8,16.7 "/>
                    </svg>
                </header>

                <p class="download-step-description" v-html="lng.downloadPage.diySection.description"></p>

                <div class="diy-step-options">
                    <a :href="option.url" class="diy-step-option" target="_blank" @click="diyStepComplete = true" v-for="option in lng.downloadPage.diySection.options">
                        <figure class="diy-step-image-container" ratio="16x9">
                            <span class="diy-step-image-sample">{{lng.downloadPage.diySection.optionOverlay}}</span>
                            <div class="diy-step-image" :style="{'background-image':`url(${option.image})`}"></div>
                        </figure>
                        <span class="button">{{option.name}}</span>
                    </a>
                </div>
            </div>

        </div>

        <div class="connect-step">
            <div class="download-column">
                <header class="download-step-header">

                    <h2 class="download-step-header-text">{{lng.downloadPage.connectSection.title}}</h2>
                    <svg class="download-step-header-icon" :class="[connectStepComplete ? '__isCompleted' : '']" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48.1 48.1" style="enable-background:new 0 0 48.1 48.1;" xml:space="preserve">
                        <path class="unchecked" d="M24.1,0.1c-13.3,0-24,10.7-24,24s10.7,24,24,24s24-10.7,24-24S37.3,0.1,24.1,0.1z M21,36.5 L8.8,24.2l3.9-3.9l8.4,8.4L37,12.8l3.9,3.9L21,36.5z"/>
                        <polygon class="checked" points="21,36.5 8.8,24.2 12.6,20.4 21,28.8 37,12.8 40.8,16.7 "/>
                    </svg>
                </header>

                <p class="download-step-description" v-html="lng.downloadPage.connectSection.description"></p>
            </div>
        </div>
    </div>
</template>


<script>
import { saveAs } from 'file-saver';
import { saveSvgAsPng } from 'save-svg-as-png';
import cookie from 'js-cookie';
import covidStar from './../../components/covid-star/covid-star.vue';
import LNG from './../../services/languages.js';

export default {
    components: {covidStar},
    props: [],
    data() {
        return {
            lng: LNG.data,
            imageData: {png: "", svg:""},
            outline: {png: "", svg:""},
            noOutline: {png: "", svg:""},
            bgPos: 0,
            downloadStepComplete: false,
            diyStepComplete: false,
            connectStepComplete: false,
            updatingSeed: false,
            seedInput: "",
            seed: cookie.get('activeSeed') || "Covid*",
        }
    },
    methods: {
        updateCovidStar(seedValue) {
            cookie.set('activeSeed', this.seed, { expires: 3 });
            if ( seedValue == this.seed) {
                return;
            }
            this.seed = seedValue;
            this.seedInput = this.seed;
        },
        updateLanguage() {
            this.lng = LNG.data;
        },
        scrollBg() {
            var posY = Math.round((window.pageYOffset || document.querySelector("body").scrollTop)  - (document.querySelector("body").clientTop || 0));
            var height = document.querySelector("body").clientHeight - window.innerHeight;
            this.bgPos = `${posY / height * 100}%`;
        },
        processSeed() {
            if(this.updatingSeed || this.seedInput == this.seed) {
                clearTimeout(this.updatingSeed);
            }

            this.updatingSeed = setTimeout(() => {
                this.updateCovidStar(this.seedInput)
            }, 440);
        },
        downloadImage(blobObject, type, outline) {
            if (type == 'png') {
                // Ugly solution.. But hey.. Time!
                if (outline) {
                    saveSvgAsPng(document.getElementById('covid-star-outline').querySelector("svg"), `${this.seed}.png`);
                } else {
                    saveAs(blobObject.png, `${this.seed}.png`)
                }
            } else {
                saveAs(blobObject.svg, `${this.seed}.svg`)
            }
            this.downloadStepComplete = true;
        }
    },
    mounted() {
        document.addEventListener("languageChange",this.updateLanguage,false);
        window.addEventListener("scroll",this.scrollBg);
        this.seedInput = this.seed;
        document.querySelector("html").scrollTop = 0;
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        window.dispatchEvent(new Event("resize"));
    },
    unmounted() {
        document.removeEventListener("languageChange",this.updateLanguage);
        window.removeEventListener("scroll",this.scrollBg);
    }
}
</script>

