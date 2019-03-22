"use strict";
var xhr = new XMLHttpRequest();
var pageNum;
var uriN; var uriP;

function search(){
    var results = document.getElementById("searchResults");

    //Clear previous search results before displaying new
    deleteContents(results);

    //Get and validate search query
    var term = document.getElementById("searchBox").value + "";
    var patt = new RegExp(/^[a-z0-9 ]+$/i);
    if(!(patt.test(term))){
        results.innerHTML = "<b>No Results</b>";
        return;
    }
    var uri = "https://images-api.nasa.gov/search?q=" + term + "&media_type=image";

    //add advanced search criteria to request if applicable
    if(document.getElementById("showAdv").checked){
        uri = uri + "&year_start=" + document.getElementById("startYear").value + "&year_end=" + document.getElementById("endYear").value;
        uri = uri + "&location=" + document.getElementById("location").value;
    }
    results.style.border = "solid";
    pageNum = 1;

    //Send request and set handler
    xhr.open('GET', encodeURI(uri), true);
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

function toggleSearchTools(){
    var toolsCont = document.getElementById("advToolsCont");
    var chkBx = document.getElementById("showAdv");
    toolsCont.hidden = true;
    if(chkBx.checked){
        toolsCont.hidden = false;
    }
}

function getPrevPage(){
    //alert("Fetching page " + (pageNum - 1) + "\nfrom: " + uriP);
    pageNum--;
    deleteContents(document.getElementById("searchResults"));
    xhr.open('GET', encodeURI(uriP), true);
    xhr.send();
}

function getNextPage(){
    //alert("Fetching page " + (pageNum + 1) + "\nfrom: " + uriN);
    pageNum++;
    deleteContents(document.getElementById("searchResults"));
    xhr.open('GET', encodeURI(uriN), true);
    xhr.send();
}

function processRequest(e) {
    //When ready state is 4 and status 200, this indicates the HTTP 
    //request is completed and successful
    if(xhr.readyState == 4 && xhr.status == 200){
        var response = JSON.parse(xhr.responseText);
        $('#searchResults').masonry('destroy');

        var container; var pic; var mdata; var desc; var date;
        for(var i = 0; i < response.collection.items.length; i++){
            container = document.createElement("DIV");
            container.className = "result";
            pic = document.createElement("IMG");
            pic.setAttribute("src", response.collection.items[i].links[0].href);
            container.appendChild(pic);

           /* $('[data-toggle="popover"]').popover({
                container: container
            });*/
            //mdata = document.createElement("DIV");
            //mdata.className = "mData";
            date = document.createElement("P");
            date.id = "imgDate";
            var d = response.collection.items[i].data[0].date_created;
            date.innerHTML = "Creation Date: " + d.slice(5,7) + "-" + d.slice(8,10) + "-" + d.slice(0,4);
            //mdata.appendChild(date);

            desc = document.createElement("P");
            desc.id = "imgDesc";
            desc.innerHTML = response.collection.items[i].data[0].description;
            if(desc.innerHTML === 'undefined'){desc.innerHTML = "";}
            //mdata.appendChild(desc);
            //mdata.style.visibility = "hidden";
            //container.appendChild(mdata);

            pic.title = date.innerHTML;
            pic.setAttribute("data-content", desc.innerHTML);
            pic.setAttribute("data-toggle", "popover");
            //pic.setAttribute("data-trigger", "hover");
            pic.setAttribute("data-placement", "auto right");

            document.getElementById("searchResults").appendChild(container);
        }

        //initialize image popover, keep open when user hovers
        //over it
        $(document).ready(function(){
            $('[data-toggle="popover"]').popover({
                container: "body", trigger: "manual"
            }).on("mouseenter", function () {
                var _this = this;
                $(this).popover("show");
                $(".popover").on("mouseleave", function () {
                    $(_this).popover('hide');
                });
            }).on("mouseleave", function () {
                var _this = this;
                setTimeout(function () {
                    if (!$(".popover:hover").length) {
                        $(_this).popover("hide");
                    }
                }, 100);
             });
        });

        /*
        $('.result').hover(function(){
            $(this).find('.mData').css("visibility", "visible");
        }, function(){
            $(this).find('.mData').css("visibility", "hidden");
        }
    );*/

        //Initialize Masonry once images have loaded
        var $grid = $('#searchResults').imagesLoaded(function(){
            $grid.masonry({
                itemSelector: '.result',
                percentPosition: true,
            });
        });

        var resNum = document.getElementById("numResults");
        var maxNum = response.collection.metadata.total_hits;

        var next = document.getElementById("nextBtn");
        var prev = document.getElementById("prevBtn");
        next.hidden = true;
        prev.hidden = true;
        if(response.collection.metadata.total_hits > 100 * pageNum){
            //alert("total hits: " + response.collection.metadata.total_hits);
            next.hidden = false;

            uriN = response.collection.links[0].href;
            if(response.collection.links.length > 1){
                uriN = response.collection.links[1].href;
            }
            maxNum = (pageNum) * 100;
        }
        
        if(pageNum > 1){
            prev.hidden = false;

            uriP = response.collection.links[0].href;
        }
        resNum.innerHTML = "Showing " + ((pageNum - 1) * 100 + 1) + " - " + maxNum + " of " + response.collection.metadata.total_hits + " results";
    }
}