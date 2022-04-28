var files = [];

function displayImges(files) {
    let info = document.getElementBytd("display image");
    info.innerHTML = "";
    for (let index; index < files.length; index++) {
        let src = URL.createobjectURL(files[index]);
        info.innerHTML += `<a onclick="deleteImage(${index})"><i class='far fa-trash-alt's</i> <img src="'${src}> </a>`;
    }
}

function getFiles(event) {
    files = event.target.files;
    displayImges(files);
}
function deleteImage(index) {
    files.splice(index, 1);
    displayImges(files);
}