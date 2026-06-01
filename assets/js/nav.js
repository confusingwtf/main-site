document.getElementsByClassName("tab")[0].style.display = 'block';

document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.nav-button');
    buttons.forEach(function(button) {
        button.addEventListener('click', function() {
            const element = document.getElementById(button.id + "-tab");
            const tabs = document.getElementsByClassName("tab");
            
            Object.values(tabs).forEach(tab => {
                tab.style.display = `none`
            });

            if (element) {
                element.style.display = 'block';
            }
        });
    });
});