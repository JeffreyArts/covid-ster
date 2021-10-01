<style src="./newsletter-popup.scss"></style>
<template>
<div class="newsletter-popup" :class="[active ? '__isActive' : '']">
    <div class="newsletter-popup-container">
        <div class="newsletter-popup-form">
            <!-- Begin Mailchimp Signup Form -->
            <div id="mc_embed_signup">
                <form action="https://jeffreyarts.us5.list-manage.com/subscribe/post?u=34e290bd9025e9bddf41ce7a4&amp;id=bfb58917e0" method="post" @submit="closePopup(true)" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
                    <div id="mc_embed_signup_scroll">
                        <h2 class="newsletter-popup-form-title">{{lng.newsletterPopup.subscribe}}</h2>
                        <p>{{lng.newsletterPopup.description}} </p>
                        <div class="mc-field-group">
                            <label class="newsletter-popup-label" for="mce-EMAIL">{{lng.newsletterPopup.email}}</label>
                            <input class="newsletter-popup-input" type="email" value="" name="EMAIL" id="mce-EMAIL">
                        </div>
                        <div id="mce-responses" class="clear">
                            <div class="response" id="mce-error-response" style="display:none"></div>
                            <div class="response" id="mce-success-response" style="display:none"></div>
                        </div> <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
                        <div style="position: absolute; left: -6400px;" aria-hidden="true"><input type="text" name="b_34e290bd9025e9bddf41ce7a4_bfb58917e0" tabindex="-1" value=""></div>
                        <div class="newsletter-popup-button-container"><input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button __isPrimary"></div>
                    </div>
                </form>
            </div>
            <!--End mc_embed_signup-->
        </div>

        <div class="newsletter-popup-footer">
            <hr>
            <p>{{lng.newsletterPopup.footnote}}</p>
        </div>
    </div>

</div>
</template>

<script>

import LNG from './../../services/languages.js'

var closeNewsletterEvent = document.createEvent("Event");
closeNewsletterEvent.initEvent("closeNewsletter",true,true);
export default {
    props: ['active'],
    data() {
        return {
            lng: LNG.data,
        }
    },
    methods: {
        closePopup(event) {
            if (!this.active) return;
            if (event === true || (event.target && event.target.className == this.$el.className) || (event.path && event.path[0].className == this.$el.className)) {
                document.dispatchEvent(closeNewsletterEvent);
            }
        }

    },
    watch: {
    },
    mounted() {
        window.addEventListener("click", this.closePopup)
    },
    unmounted() {
        window.removeEventListener("click", this.closePopup)
    }

}

</script>