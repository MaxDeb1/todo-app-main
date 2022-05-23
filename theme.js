function switchTheme() {

    // Disable transitions on theme toggle
    const css = document.createElement('style')
        css.type = 'text/css'
        css.appendChild(
        document.createTextNode(
            `* {
            -webkit-transition: none !important;
            -moz-transition: none !important;
            -o-transition: none !important;
            -ms-transition: none !important;
            transition: none !important;
            }`
        )
    )
    document.head.appendChild(css)


    // toggle theme
    const toggleValue =
        localStorage.getItem('theme') === 'dark' ? 'light' : 'dark'

    // update localstorage value;
    localStorage.setItem('theme', toggleValue)

    // update theme
    setTheme()

    // Calling getComputedStyle forces the browser to redraw
    const _ = window.getComputedStyle(css).opacity
    document.head.removeChild(css)
}


const themeSwitcher = document.querySelector('#theme');
const themeIcon = document.querySelector('#icon');
const bgImage = document.querySelector('#bgImage');


function setTheme() {
    // set current theme - default to `light` on first load and set `theme` property in localStorage.
    const currentTheme = localStorage.getItem('theme') || 'light'

    // update current theme value on `data-theme` attribute
    document.body.dataset.theme = currentTheme

    // update inner text of button dynamically based on current theme
    /* themeSwitcher.innerText = currentTheme === 'light' ? 'Dark' : 'Light' */

    if (currentTheme === 'light') {
        bgImage.setAttribute('src', '/images/bg-desktop-light.jpg');
        themeIcon.setAttribute('src', '/images/icon-moon.svg');
    } else {
        bgImage.setAttribute('src', '/images/bg-desktop-dark.jpg');
        themeIcon.setAttribute('src', '/images/icon-sun.svg');
    }
}

// set theme on inital load
setTheme()