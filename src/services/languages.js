import cookie from 'js-cookie';
import {getUserLocales} from 'get-user-locale';
import NL from "./../languages/NL.json"
import EN from "./../languages/EN.json"

const acceptedLanguages = ["NL"];
const lngTable = {
    en: EN,
    nl: NL,
}
var languageEvent = document.createEvent("Event");
languageEvent.initEvent("languageChange",true,true);

const LNG =  {
    current: null,
    data: null,
    setLanguage: (languageCode) => {

        if (languageCode) {
            LNG.current = languageCode;
            cookie.set('lng', languageCode, { expires: 1 })
        }

        // First check if language is stored in cookie
        if (cookie.get('lng')) {
            LNG.current = cookie.get('lng');
        }


        // Get language from browser
        if (!LNG.current) {
            var locales = getUserLocales();
            locales.forEach( locale => {
                if (LNG.current) {
                    return;
                }

                if (locale.indexOf("-") != -1) {
                    locale = locale.split("-")[0]
                }
                if (lngTable[locale]) {
                    LNG.current = locale;
                    cookie.set('lng', locale, { expires: 1 })
                    return
                }
            })
        }


        if (lngTable[LNG.current]) {
            LNG.data = lngTable[LNG.current];
            document.dispatchEvent(languageEvent);
        } else {
            console.error("Invalid language code")
        }

    }
}
LNG.setLanguage()

export default LNG