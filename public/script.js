var xhr = new XMLHttpRequest();

function search(){
    var term = document.getElementById("searchBox").value;
    xhr.open('GET', "https://images-api.nasa.gov/search?q=" + term + "&media_type=image", true);
    xhr.send();   
    
    xhr.addEventListener("readystatechange", processRequest, false);
}

function processRequest(e) {
    //When ready state is 4 and status 200, this indicates the HTTP 
    //request is completed and successful
    if(xhr.readyState == 4 && xhr.status == 200){
        var response = JSON.parse(xhr.responseText);

        alert("here");
        var pic; var i;
        for(i = 0; i < response.collection.metadata.total_hits; i++){
            pic = document.createElement("IMG");
            pic.setAttribute("src", response.collection.items[i].links[0].href);
            document.body.appendChild(pic);
        }
    }
}