// 1. Inicialización del idioma
const getCurrentLanguage = () => document.cookie.includes('lang=en') ? 'en' : 'es';
let language = getCurrentLanguage();

// 2. Actualización de textos y opciones de naturaleza
const setTranslations = (language) => {
    updateTextContent(language);  // Actualizar los textos
    updateNatureOptions(language); // Actualizar las opciones de naturaleza
};

const updateTextContent = (language) => {
    Object.keys(translations[language]).forEach(id => {
        const elements = document.querySelectorAll(`#${id}`);
        elements.forEach(element => {
            element.textContent = translations[language][id];
        });
    });
};

// 4. Cambiar idioma
const toggleLanguage = () => {
    language = (language === 'es') ? 'en' : 'es';
    document.cookie = `lang=${language}; path=/`;
    setTranslations(language);

    const changeLanguageButton = document.getElementById('changeLanguageButton');
    changeLanguageButton.classList.toggle('active', language === 'en');
};

document.getElementById('changeLanguageButton').addEventListener('click', toggleLanguage);
