// bad
const tab = document.getElementById("photos-tab");
const srcTemplate = "assets/gallery/^INDEX^^EXTENSION^";
const photoTemplate = `
<div>
    <img src=^SRC_TEMPLATE^/>
</div>
`
for (let i = 0; i < 255; i++) {
    let src = srcTemplate.replace("^INDEX^", i.toString()).replace("^EXTENSION^", ".jpg");
    var reader = new XMLHttpRequest();
    reader.open("get", src, true);
    console.log(src);
    // tab.innerHTML += photoTemplate.replace("^INDEX^", i.toString()).replace("^EXTENSION^", ".jpg")

    reader.onreadystatechange = checkReadyState;
        
    function checkReadyState() {
        if (reader.readyState === 4) {
            if ((reader.status == 200)) {
                tab.innerHTML += photoTemplate.replace("^SRC_TEMPLATE^", src);
            }
        }
    }
    
    reader.send(null);
}