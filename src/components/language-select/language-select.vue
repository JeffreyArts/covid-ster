<template>
    <div class="language-select-container" :class="[openMenu ? '__isOpen' : '']">
        <header class="language-select-container-header">
            <strong class="current-language" @click="toggleMenu">{{currentLanguage}}</strong>
            <svg class="dropdown-icon" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 16 16" style="enable-background:new 0 0 16 16;" xml:space="preserve">
            <path class="st0" d="M0.6,1.7h14.9c0.3,0,0.4,0.3,0.3,0.5L8.3,14.1c-0.1,0.3-0.5,0.3-0.6,0L0.3,2.2C0.1,2,0.3,1.7,0.6,1.7z"/>
            </svg>
        </header>
        <ul class="language-select-dropdown">
            <li class="language-select-dropdown-item" @click="selectLanguage(languageCode)" v-for="(language, languageCode) in languageList">{{language}}</li>
        </ul>
    </div>
</template>

<script>

    import LNG from './../../services/languages.js'

    export default {
        components: {},
        props: [],
        data() {
            return {
                openMenu: false,
                currentLanguage: null,
                languageList: {
                    "en":"English",
                    "nl":"Nederlands",
                }
            }
        },
        methods: {
            closeMenu(event) {
                console.log('aaaa',event.target.className.indexOf("language"));
                if (event.target.className.indexOf("language") == -1){
                    this.openMenu = false;
                    window.removeEventListener("click", this.closeMenu);
                }
            },
            toggleMenu() {
                this.openMenu = !this.openMenu
                if (this.openMenu) {
                    window.addEventListener("click", this.closeMenu)
                }
            },
            selectLanguage(languageCode) {
                LNG.setLanguage(languageCode)
                this.currentLanguage = this.languageList[LNG.current]
                this.openMenu = false
            }
        },
        mounted() {
            this.currentLanguage = this.languageList[LNG.current]
        },
        unmounted() {

            window.removeEventListener("click", this.toggleMenu)
        }
    }
</script>


<style src="./language-select.scss"></style>