"use strict";
var xhr = new XMLHttpRequest();
var colHeights = [0,0,0,0];

function search(){
    var results = document.getElementById("searchResults");
    
    colHeights = [0,0,0,0];
    //Clear previous search results columns before displaying new
    for(var i = 0; i < results.childNodes.length; i++){
        if(results.childNodes[i].className === "column"){
            //alert("about to call deleteContents() on " + results.childNodes[i]);
            deleteContents(results.childNodes[i]);
        }
    }

    var term = document.getElementById("searchBox").value + "";
    var patt = new RegExp(/^[a-z0-9]+$/i);
    if(!(patt.test(term))){return;}
    xhr.open('GET', "https://images-api.nasa.gov/search?q=" + term + "&media_type=image", true);
    xhr.send();   
    
    xhr.addEventListener("readystatechange", processRequest, false);
}

//Recursive function to delete all elements in parent element node
function deleteContents(node){
    //alert("considering " + node + "\ntesting " + node.firstChild + " against null");
    while(node.firstChild != null){
        deleteContents(node.firstChild);
        node.removeChild(node.firstChild);
    }
}

function getLowestIdx(nums){
    var min = nums[0]; var idx = 0;
    if(nums.length < 2){
        return idx;
    }
    
    for(var i = 1; i < nums.length; i++){
        //alert(elems[i].offsetHeight);
        if(nums[i] < min){
            min = nums[i];
            idx = i;
        }
    }
    alert("getLowest returned: " + idx + "\ncolHeights[0]: "+colHeights[0]+"\ncolHeights[1]: "+colHeights[1]+"\ncolHeights[2]: "+colHeights[2]+"\ncolHeights[3]: "+colHeights[3]);
    return idx;
}

function processRequest(e) {
    //When ready state is 4 and status 200, this indicates the HTTP 
    //request is completed and successful
    if(xhr.readyState == 4 && xhr.status == 200){
        var response = JSON.parse(xhr.responseText);

        var cols = document.getElementsByClassName("column");
        var pic;
        for(var i = 0; i < response.collection.metadata.total_hits; i++){
            pic = document.createElement("IMG");
            pic.setAttribute("src", response.collection.items[i].links[0].href);
            cols[i % cols.length].appendChild(pic);
            //var low = getLowestIdx(colHeights);
            //cols[low].appendChild(pic);
            //colHeights[low] += pic.offsetHeight;
        }
    }
}