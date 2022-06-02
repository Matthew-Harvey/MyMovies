// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
// Write your JavaScript code.

const API_KEY = 'api_key=*insert key here*';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const API_URL2 = BASE_URL + '/discover/tv?sort_by=popularity.desc&' + API_KEY;
const API_URL3 = BASE_URL + '/person/popular?sort_by=popularity.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const BG_IMG_URL = 'https://image.tmdb.org/t/p/original'
const searchURL = BASE_URL + '/search/movie?' + API_KEY;
const searchURL2 = BASE_URL + '/search/tv?' + API_KEY;
const searchURL3 = BASE_URL + '/search/person?' + API_KEY;
const searchURL4 = BASE_URL + '/search/multi?' + API_KEY;

const tracelocation = [];


const genres = [
    {
        "id": 28,
        "name": "Action"
    },
    {
        "id": 12,
        "name": "Adventure"
    },
    {
        "id": 16,
        "name": "Animation"
    },
    {
        "id": 35,
        "name": "Comedy"
    },
    {
        "id": 80,
        "name": "Crime"
    },
    {
        "id": 14,
        "name": "Fantasy"
    },
    {
        "id": 36,
        "name": "History"
    },
    {
        "id": 27,
        "name": "Horror"
    },
    {
        "id": 10402,
        "name": "Music"
    },
    {
        "id": 10749,
        "name": "Romance"
    },
    {
        "id": 878,
        "name": "Science Fiction"
    },
    {
        "id": 10752,
        "name": "War"
    },
]

const genres2 = [
    {
        "id": 16,
        "name": "Animation"
    },
    {
        "id": 35,
        "name": "Comedy"
    },
    {
        "id": 80,
        "name": "Crime"
    },
    {
        "id": 36,
        "name": "History"
    },
    {
        "id": 10402,
        "name": "Music"
    },
    {
        "id": 10749,
        "name": "Romance"
    },
    {
        "id": 10752,
        "name": "War"
    },
]

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const tagsEl = document.getElementById('tags');

const prev = document.getElementById('prev')
const next = document.getElementById('next')
const current = document.getElementById('current')

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages = 20;

function run_quiz() {
    resetcontent();
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function run_lists() {
    resetcontent();
    tracelocation.push(["lists", null]);
    main.innerHTML = `
       <div class="row container">
            <div class="col-sm-12">
                 <br />
                 <h3>Create List</h3>
                 <input class="search" style="color: #5161ce; text-align: center; border-color: #5161ce;" type="text" id="listname" placeholder="ListName">
                 <button class="know-more" onclick="generatelist(null, null, false);">Add</button>
                 <br />
             </div>
       </div>
       <br />
       <div class="row container" style="padding-top: 30px">
            <div class="col-sm-12" id="listsection">
                 <h3>My Lists</h3>
            </div>
            <div class="row container" id="list_here"></div>
       </div>
    `
    load_lists();
}

function load_lists() {
    const listarr = [];
    Object.keys(localStorage).forEach((key) => {
        var localid = key;
        var localmain = localStorage.getItem(key);
        var lastword = localid.substr(localid.length - 4);
        if (lastword == "list") {
            listarr.push([[localid.split(" ")[0], localmain.toString()], []])
        }
    });
    Object.keys(localStorage).forEach((key) => {
        var localid = key;
        var localmain = localStorage.getItem(key);
        var lastword = localid.substr(localid.length - 4);
        if (lastword == "item") {
            for (var num in listarr) {
                if (listarr[num][0][0] == localid.split(" ")[0].split(",")[0]) {
                    listarr[num][1].push(localmain.toString());
                }
            }
        }
    });
    for (var y in listarr) {
        //create lists for items to be placed
        generatelist(listarr[y][0][0], listarr[y][0][1].toString(), true);
        for (var i = 1; i < listarr[y].length; i++) {
            for (var z in listarr[y][i]) {
                var content = listarr[y][i][z].toString();
                var itemid = content.split(",")[0];
                var itemname = content.split(",")[1];
                var itemtype = content.split(",")[2];
                var itemimg = content.split(",")[3];
                additem_model(itemid, itemname, itemtype, itemimg, listarr[y][0][0], true)
            }
        }
    }
}

function generatelist(listid, listname, load) {
    if (load == false) {
        listid = makeid(10);
        listname = document.getElementById('listname').value;
        // add list to local storage
        localStorage.setItem(listid + " list", listname);
    }
    var listdiv = document.createElement("div");
    listdiv.id = listid;
    list_here.appendChild(listdiv);

    var listdivrow = document.createElement("div");
    listdivrow.classList.add("row");
    listdiv.appendChild(listdivrow);

    var coldiv = document.createElement("div");
    coldiv.classList.add('col-sm-3');
    listdivrow.appendChild(coldiv);
    var brgap = document.createElement("br");
    coldiv.appendChild(brgap);
    var displaylistname = document.createElement("h4");
    displaylistname.textContent = listname;
    coldiv.appendChild(displaylistname);

    var coldiv2 = document.createElement("div"); 
    coldiv2.classList.add('col-sm-3');
    var modalid = "modal" + listid;
    var modaltarget = "#" + modalid;
    var searchbuttonid = "search" + listid;
    var textboxid = "textbox" + listid;
    var fillcontentid = "fill" + listid;
    coldiv2.innerHTML = `
        <br />
        <button type="button" class="know-more" data-bs-toggle="modal" data-bs-target="${modaltarget}" style="background-color: green;">Add Item</button>
        <div class="modal fade" id="${modalid}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel" style="color: black;">Add Item</h5>
                        <button type="button" class="btn-close" id="btnclose" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="modelbody">
                        <input class="search" style="color: #5161ce; text-align: center; border-color: #5161ce;" type="text" id="${textboxid}" placeholder="Name">
                        <button id="${searchbuttonid}" class="know-more" onclick="generateitems('${listid}', '${load}');">Search</button>
                        <br />
                        <div id="${fillcontentid}"></div>
                        <br />
                    </div>
                </div>
           </div>
       </div>
    `
    listdivrow.appendChild(coldiv2);

    var coldiv3 = document.createElement("div");
    coldiv3.classList.add('col-sm-3');
    coldiv3.innerHTML = `
        <br />
        <button type="button" class="know-more" style="background-color: red;" onclick="del_list('${listid}');">Delete List</button>
    `
    listdivrow.appendChild(coldiv3);
}

function generateitems(listid, load) {
    var gettextboxid = "textbox" + listid;
    newsearchurl = searchURL4 + '&query=' + document.getElementById(gettextboxid).value;
    resultarr = [[" ", " "]*20];
    fetch(newsearchurl).then(res => res.json()).then(search_data => {
        for (var searchkey in search_data.results) {
            if (search_data.results[searchkey].media_type == "movie") {
                resultarr.push([search_data.results[searchkey].title, search_data.results[searchkey].poster_path, search_data.results[searchkey].id, search_data.results[searchkey].media_type]);
            }
            else if (search_data.results[searchkey].media_type == "person") {
                resultarr.push([search_data.results[searchkey].name, search_data.results[searchkey].profile_path, search_data.results[searchkey].id, search_data.results[searchkey].media_type]);
            }
            else {
                resultarr[searchkey] = [search_data.results[searchkey].name, search_data.results[searchkey].poster_path, search_data.results[searchkey].id, search_data.results[searchkey].media_type];
            }
        }
        var showresultdiv = document.getElementById("fill" + listid);

        var brfirst = document.createElement("br");
        showresultdiv.appendChild(brfirst);

        console.log(resultarr);

        var resultlen = 0;
        if (resultarr.length > 5) {
            resultlen = 5;
        }
        else {
            resultlen = resultarr.length;
        }

        for (var count = 0; count < resultlen; count++) {
            var resultrow = document.createElement("div");
            resultrow.id = "result" + count;
            resultrow.classList.add("row");
            showresultdiv.appendChild(resultrow);
            var column = document.createElement("div");
            column.classList.add("col-sm-3");
            column.classList.add("container");
            resultrow.appendChild(column);
            var resultimg = document.createElement("img");
            resultimg.style = "max-height: 125px; max-width: 125px; width: auto; height: 100%";
            resultimg.src = resultarr[count+1][1] ? IMG_URL + resultarr[count+1][1] : "http://via.placeholder.com/1080x1580";
            column.appendChild(resultimg);
            var column2 = document.createElement("div");
            column2.classList.add("col-sm-6");
            column2.classList.add("container");
            column2.innerHTML = `
                <p style="margin-bottom: 0; overflow: hidden;">${resultarr[count + 1][0]}</p>
                <button class="know-more" style="background-color: green;" onclick="additem_model('${resultarr[count + 1][2]}', '${resultarr[count + 1][0]}', '${resultarr[count + 1][3]}', '${resultarr[count + 1][1]}', '${listid}', '${load}'); "><i class="fa fa-plus"></i></button>
                <button class="know-more" data-bs-dismiss="modal" onclick="runtype('${resultarr[count + 1][3]}', '${resultarr[count + 1][2]}');"><i class="fa fa-forward"></i></button>
            `
            resultrow.appendChild(column2);
        }
    });
}

function del_list(listid) {
    var element = document.getElementById(listid);
    try {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }
    catch {
        var donothing = "TRUE";
    }
    // remove list from local storage
    localStorage.removeItem(listid + " list");
}

function additem_model(id, name, type, img, listid, load) {

    var selectedlist = document.getElementById(listid);

    selectedlist.innerHTML = `
        <div class="row" id="${id}">
            <div class="col-sm-3">
                <br />
                <img src="${IMG_URL + img}" style="max-height: 150px; max-width: 150px;">
            </div>
            <div class="col-sm-3">
                <br />
                <h5>${name}</h5>
            </div>
        </div>
    `

    if (load == "false") {
        // add to local storage
        var constarr = [id, name, type, img];
        var itemid = makeid(10);
        localStorage.setItem(listid + "," + itemid + " item", constarr);
    }

}

////////////////////////////////////////////////////

function run_people() {
    document.getElementById("pagescontainer").style.display = "flex";
    document.getElementById("pagescontainer").style.display = "flex";
    document.getElementById("form").style.display = "flex";
    document.getElementById("form").value = "";

    tracelocation.push(["people", null]);

    getMovies(API_URL3);

    function getMovies(url) {
        lastUrl = url;
        fetch(url).then(res => res.json()).then(data => {
            if (data.results.length !== 0) {
                showMovies(data.results);
                currentPage = data.page;
                nextPage = currentPage + 1;
                prevPage = currentPage - 1;
                totalPages = data.total_pages;

                current.innerText = currentPage;

                if (currentPage <= 1) {
                    prev.classList.add('disabled');
                    next.classList.remove('disabled')
                } else if (currentPage >= totalPages) {
                    prev.classList.remove('disabled');
                    next.classList.add('disabled')
                } else {
                    prev.classList.remove('disabled');
                    next.classList.remove('disabled')
                }

            } else {
                main.innerHTML = `<h1 class="no-results">No Results Found</h1>`
            }

        })

    }


    function showMovies(data) {
        main.innerHTML = '';

        data.forEach(movie => {
            const { name, profile_path, known_for, id } = movie;
            const movieEl = document.createElement('div');
            movieEl.classList.add('movie');
            var title1 = "";
            var title2 = "";
            var title3 = "";
            try {
                var title1 = known_for[0].title;
                if (known_for[0].title == null) {
                    title1 = known_for[0].name
                }
            } catch {
                var title1 = "";
            }
            try {
                var title2 = known_for[1].title;
                if (known_for[1].title == null) {
                    title2 = known_for[1].name
                }
            } catch {
                var title2 = "";
            }
            try {
                var title3 = known_for[2].title;
                if (known_for[2].title == null) {
                    title3 = known_for[2].name
                }
            } catch {
                var title3 = "";
            }
            movieEl.innerHTML = `
                 <img src="${profile_path ? IMG_URL + profile_path : "http://via.placeholder.com/1080x1580"}" alt="${name}">

                <div class="movie-info">
                    <h3>${name}</h3>
                </div>

                <div class="overview">

                    <h3>Features In:</h3>
                    ${title1}
                    <br/>
                    ${title2}
                    <br/>
                    ${title3}
                    <br/> 
                    <button class="gopage" onclick="PersonPage('${id}');">View Page</button>
                </div>
        
            `

            main.appendChild(movieEl);

            
        })
    }


    const leftArrow = document.getElementById('left-arrow')
    const rightArrow = document.getElementById('right-arrow')

    leftArrow.addEventListener('click', () => {
        if (activeSlide > 0) {
            activeSlide--;
        } else {
            activeSlide = totalVideos - 1;
        }

        showVideos()
    })

    rightArrow.addEventListener('click', () => {
        if (activeSlide < (totalVideos - 1)) {
            activeSlide++;
        } else {
            activeSlide = 0;
        }
        showVideos()
    })


    function getColor(vote) {
        if (vote >= 8) {
            return 'green'
        } else if (vote >= 5) {
            return "orange"
        } else {
            return 'red'
        }
    }


    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const searchTerm = search.value;
        if (searchTerm) {
            getMovies(searchURL3 + '&query=' + searchTerm)
        } else {
            getMovies(API_URL3);
        }

    })

    prev.addEventListener('click', () => {
        if (prevPage > 0) {
            pageCall(prevPage);
        }
    })

    next.addEventListener('click', () => {
        if (nextPage <= totalPages) {
            pageCall(nextPage);
        }
    })

    function pageCall(page) {
        let urlSplit = lastUrl.split('?');
        let queryParams = urlSplit[1].split('&');
        let key = queryParams[queryParams.length - 1].split('=');
        if (key[0] != 'page') {
            let url = lastUrl + '&page=' + page
            getMovies(url);
        } else {
            key[1] = page.toString();
            let a = key.join('=');
            queryParams[queryParams.length - 1] = a;
            let b = queryParams.join('&');
            let url = urlSplit[0] + '?' + b
            getMovies(url);
        }
    }
}

//////////////////////////////////////////////////

function PersonPage(id) {
    resetcontent();
    main.style.display = "block";
    const person_url = 'https://api.themoviedb.org/3/person/' + id + '?' + API_KEY;
    const person_url_credits = 'https://api.themoviedb.org/3/person/' + id + '/combined_credits?sort_by=popularity.desc&' + API_KEY;

    fetch(person_url).then(res => res.json()).then(page_data => {
        fetch(person_url_credits).then(res => res.json()).then(credit_data => {
            const fullcredits = [];
            const fullcredits2 = [];
            main.innerHTML = `
                    <div class="post-container" style="margin: 3% 5% 3% 5%; overflow: auto;">
                        <div class="post-content" style="">
                            <div id="bg" class="movie-info" style="display: block; position: relative; background-color: #5161ce;">
                                <div class="row">
                                    <div class="col-sm-3 container">
                                        <img width="100%" height="auto" style="max-height: 600px; max-width: 600px;" src="${page_data.profile_path ? IMG_URL + page_data.profile_path : "http://via.placeholder.com/1080x1580"}" alt="" class="image--cover" />
                                    </div>
                                    <div class= "col-lg-9 container" style="">
                                        <h3 style="font-weight: bold; font-size: 400%; padding-top: 10px;">${page_data.name}</h3>
                                        <br />
                                        <p style="padding-top: 10px; margin-bottom: 0;"><i>${"Born: " + page_data.birthday + " " + page_data.place_of_birth}</i></p>
                                        <p style="padding-top: 10px; margin-bottom: 0;"><i>${"Area: " + page_data.known_for_department}</i></p>
                                        <p style="padding-top: 10px; fontsize="110%";"><u>About:</u></p>
                                        <p style="margin-bottom: 10px;">${page_data.biography}</p>
                                        <br />
                                        <button class="know-more"><a id="IMDb" href="${'https://www.imdb.com/name/' + page_data.imdb_id}" style="color: white; text-decoration: none;" target="_blank">IMDb</a></button>
                                        <button type="button" class="know-more" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                          Full Credits
                                        </button>
                                        <button id="back" class="know-more">Back</button>
                                        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                          <div class="modal-dialog">
                                            <div class="modal-content">
                                              <div class="modal-header">
                                                <h5 class="modal-title" id="exampleModalLabel" style="color: black;">Full Credits</h5>
                                                <button type="button" class="btn-close" id="btnclose" data-bs-dismiss="modal" aria-label="Close"></button>
                                              </div>
                                              <div class="modal-body" id="modelbody">
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <br />
                                    </div>
                                </div>
                                <br />
                                <div class="movie-info" style="padding-bottom: 10px; background-color: #5161ce;">
                                    <div id="featuredrow" class="row">
                                        <p style="margin-bottom: 0; padding-top: 10px; fontsize="150%"; background-color: #5161ce;"><u>Featured In Cast:</u></p>
                                   </div>
                                </div>
                                <br />
                                <div class="movie-info" style="padding-bottom: 10px; background-color: #5161ce;">
                                   <div id="featuredrow2" class="row">
                                        <p style="margin-bottom: 0; padding-top: 10px; fontsize="150%"; background-color: #5161ce;"><u>Featured In Crew:</u></p>
                                   </div>
                            </div>
                        </div>
                    </div>
                `
            back.onclick = function () { backbutton() };
            const fulllist = credit_data.cast;
            const allcredits = [];
            for (var source in fulllist) {
                if (fulllist[source].media_type == "movie") {
                    allcredits.push([fulllist[source].id, fulllist[source].title, fulllist[source].media_type, fulllist[source].character]);
                    fullcredits.push([fulllist[source].title, 'https://image.tmdb.org/t/p/w500' + fulllist[source].poster_path, fulllist[source].id, fulllist[source].media_type, fulllist[source].character, fulllist[source].popularity]);
                }
                else {
                    allcredits.push([fulllist[source].id, fulllist[source].name, fulllist[source].media_type, fulllist[source].character]);
                    fullcredits.push([fulllist[source].name, 'https://image.tmdb.org/t/p/w500' + fulllist[source].poster_path, fulllist[source].id, fulllist[source].media_type, fulllist[source].character, fulllist[source].popularity]);
                }
            }
            const fulllist2 = credit_data.crew;
            for (var source in fulllist2) {
                if (fulllist2[source].media_type == "movie") {
                    allcredits.push([fulllist2[source].id, fulllist2[source].title, fulllist2[source].media_type, fulllist2[source].job]);
                    fullcredits2.push([fulllist2[source].title, 'https://image.tmdb.org/t/p/w500' + fulllist2[source].poster_path, fulllist2[source].id, fulllist2[source].media_type, fulllist2[source].job, fulllist2[source].popularity]);
                }
                else {
                    allcredits.push([fulllist2[source].id, fulllist2[source].name, fulllist2[source].media_type, fulllist2[source].job]);
                    fullcredits2.push([fulllist2[source].name, 'https://image.tmdb.org/t/p/w500' + fulllist2[source].poster_path, fulllist2[source].id, fulllist2[source].media_type, fulllist2[source].job, fulllist2[source].popularity]);
                }
            }
            fullcredits.sort(sortFunction);
            fullcredits2.sort(sortFunction);
            function sortFunction(a, b) {
                if (a[5] === b[5]) {
                    return 0;
                }
                else {
                    return (a[5] < b[5]) ? -1 : 1;
                }
            }

            tracelocation.push(["peopleid", page_data.id]);

            for (let key in allcredits) {
                var addcredit = document.createElement("p");
                addcredit.style = "margin-bottom: 0; overflow: hidden; color: black;";
                addcredit.textContent = allcredits[key][1] + " - " + allcredits[key][3];
                addcredit.onclick = function () { btnclose.click(); resetcontent(); if (allcredits[key][2] == "movie") { moviePage(allcredits[key][0]) } else { tvPage(allcredits[key][0]) }}
                modelbody.appendChild(addcredit);
            }

            if (fulllist.length > 0) {
                for (let x = 1; x < 13; x++) {
                    try {
                        var column1 = document.createElement("div");
                        column1.classList.add("col-sm-2");
                        column1.classList.add("container");
                        featuredrow.appendChild(column1);
                        var column1img = document.createElement("img");
                        column1img.style = "border-radius: 50%; object-fit: cover; object-position: center right; width: 100%; height: auto";
                        column1img.src = fullcredits[fullcredits.length - x][1];
                        column1.appendChild(column1img);
                        var column1name = document.createElement("p");
                        column1name.style = "margin-bottom: 0; overflow: hidden;";
                        column1name.textContent = fullcredits[fullcredits.length - x][0];
                        column1.appendChild(column1name);
                        var column1character = document.createElement("p");
                        column1character.style = "margin-bottom: 0; overflow: hidden;";
                        column1character.textContent = fullcredits[fullcredits.length - x][4];
                        column1.appendChild(column1character);
                        column1.onclick = function () { resetcontent(); if (fullcredits[fullcredits.length - x][3] == "movie") { moviePage(fullcredits[fullcredits.length - x][2]) } else { tvPage(fullcredits[fullcredits.length - x][2]) } };
                    }
                    catch {
                        var column1 = document.createElement("div");
                        column1.classList.add("col-sm-2");
                        column1.classList.add("container");
                        featuredrow.appendChild(column1);
                        var column1img = document.createElement("img");
                        column1img.style = "border-radius: 50%; object-fit: cover; object-position: center right; width: 100%; height: auto";
                        column1img.src = " ";
                        column1.appendChild(column1img);
                        var column1name = document.createElement("p");
                        column1name.style = "margin-bottom: 0; overflow: hidden;";
                        column1name.textContent = " ";
                        column1.appendChild(column1name);
                        var column1character = document.createElement("p");
                        column1character.style = "margin-bottom: 0; overflow: hidden;";
                        column1character.textContent = " ";
                        column1.appendChild(column1character);
                        column1.onclick = function () { };
                    }
                }
            }
            if (fulllist2.length > 0) {
                for (let x = 1; x < 13; x++) {
                    try {
                        var column1 = document.createElement("div");
                        column1.classList.add("col-sm-2");
                        column1.classList.add("container");
                        featuredrow2.appendChild(column1);
                        var column1img = document.createElement("img");
                        column1img.style = "border-radius: 50%; object-fit: cover; object-position: center right; width: 100%; height: auto";
                        column1img.src = fullcredits2[fullcredits2.length - x][1];
                        column1.appendChild(column1img);
                        var column1name = document.createElement("p");
                        column1name.style = "margin-bottom: 0; overflow: hidden;";
                        column1name.textContent = fullcredits2[fullcredits2.length - x][0];
                        column1.appendChild(column1name);
                        var column1character = document.createElement("p");
                        column1character.style = "margin-bottom: 0; overflow: hidden;";
                        column1character.textContent = fullcredits2[fullcredits2.length - x][4];
                        column1.appendChild(column1character);
                        column1.onclick = function () { resetcontent(); if (fullcredits2[fullcredits2.length - x][3] == "movie") { moviePage(fullcredits2[fullcredits2.length - x][2]) } else { tvPage(fullcredits2[fullcredits2.length - x][2]) } };
                    }
                    catch {
                        var column1 = document.createElement("div");
                        column1.classList.add("col-sm-2");
                        column1.classList.add("container");
                        featuredrow.appendChild(column1);
                        var column1img = document.createElement("img");
                        column1img.style = "border-radius: 50%; object-fit: cover; object-position: center right; width: 100%; height: auto";
                        column1img.src = " ";
                        column1.appendChild(column1img);
                        var column1name = document.createElement("p");
                        column1name.style = "margin-bottom: 0; overflow: hidden;";
                        column1name.textContent = " ";
                        column1.appendChild(column1name);
                        var column1character = document.createElement("p");
                        column1character.style = "margin-bottom: 0; overflow: hidden;";
                        column1character.textContent = " ";
                        column1.appendChild(column1character);
                        column1.onclick = function () { };
                    }
                }
            }

        });
    })
}

//////////////////////////////////////////////////

function run_tvshows() {
    document.getElementById("pagescontainer").style.display = "flex";
    document.getElementById("tags").style.display = "flex";
    document.getElementById("pagescontainer").style.display = "flex";
    document.getElementById("form").style.display = "flex";

    tracelocation.push(["tv", null]);

    var selectedGenre = []
    setGenre();
    function setGenre() {
        tagsEl.innerHTML = '';
        genres2.forEach(genre => {
            const t = document.createElement('div');
            t.classList.add('tag');
            t.id = genre.id;
            t.innerText = genre.name;
            t.addEventListener('click', () => {
                if (selectedGenre.length == 0) {
                    selectedGenre.push(genre.id);
                } else {
                    if (selectedGenre.includes(genre.id)) {
                        selectedGenre.forEach((id, idx) => {
                            if (id == genre.id) {
                                selectedGenre.splice(idx, 1);
                            }
                        })
                    } else {
                        selectedGenre.push(genre.id);
                    }
                }
                getMovies(API_URL2 + '&with_genres=' + encodeURI(selectedGenre.join(',')))
                highlightSelection()
            })
            tagsEl.append(t);
        })
    }

    function highlightSelection() {
        const tags = document.querySelectorAll('.tag');
        tags.forEach(tag => {
            tag.classList.remove('highlight')
        })
        clearBtn()
        if (selectedGenre.length != 0) {
            selectedGenre.forEach(id => {
                const hightlightedTag = document.getElementById(id);
                hightlightedTag.classList.add('highlight');
            })
        }

    }

    function clearBtn() {
        let clearBtn = document.getElementById('clear');
        if (clearBtn) {
            clearBtn.classList.add('highlight')
        } else {

            let clear = document.createElement('div');
            clear.classList.add('tag', 'highlight');
            clear.id = 'clear';
            clear.innerText = 'Clear x';
            clear.addEventListener('click', () => {
                selectedGenre = [];
                setGenre();
                getMovies(API_URL2);
            })
            tagsEl.append(clear);
        }

    }

    getMovies(API_URL2);

    function getMovies(url) {
        lastUrl = url;
        fetch(url).then(res => res.json()).then(data => {
            if (data.results.length !== 0) {
                showMovies(data.results);
                currentPage = data.page;
                nextPage = currentPage + 1;
                prevPage = currentPage - 1;
                totalPages = data.total_pages;

                current.innerText = currentPage;

                if (currentPage <= 1) {
                    prev.classList.add('disabled');
                    next.classList.remove('disabled')
                } else if (currentPage >= totalPages) {
                    prev.classList.remove('disabled');
                    next.classList.add('disabled')
                } else {
                    prev.classList.remove('disabled');
                    next.classList.remove('disabled')
                }

            } else {
                main.innerHTML = `<h1 class="no-results">No Results Found</h1>`
            }

        })

    }


    function showMovies(data) {
        main.innerHTML = '';

        data.forEach(movie => {
            const { name, poster_path, vote_average, overview, id } = movie;
            const movieEl = document.createElement('div');
            movieEl.classList.add('movie');
            movieEl.innerHTML = `
                 <img src="${poster_path ? IMG_URL + poster_path : "http://via.placeholder.com/1080x1580"}" alt="${name}">

                <div class="movie-info">
                    <h3>${name}</h3>
                    <span class="${getColor(vote_average)}">${vote_average}</span>
                </div>

                <div class="overview">

                    <h3>Overview</h3>
                    ${overview}
                    <br/> 
                    <button class="know-more" id="${id}">Videos</button>
                    <button class="gopage" onclick="tvPage('${id}', 'tvs');">View Page</button>
                </div>
        
            `

            main.appendChild(movieEl);

            document.getElementById(id).addEventListener('click', () => {
                openNav(movie)
            })
        })
    }

    const overlayContent = document.getElementById('overlay-content');
    /* Open when someone clicks on the span element */
    function openNav(movie) {
        let id = movie.id;
        fetch(BASE_URL + '/tv/' + id + '/videos?' + API_KEY).then(res => res.json()).then(videoData => {
            if (videoData) {
                document.getElementById("myNav").style.width = "100%";
                if (videoData.results.length > 0) {
                    var embed = [];
                    var dots = [];
                    videoData.results.forEach((video, idx) => {
                        let { name, key, site } = video

                        if (site == 'YouTube') {

                            embed.push(`
                  <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          
              `)

                            dots.push(`
                  <span class="dot">${idx + 1}</span>
                `)
                        }
                    })

                    var content = `
            <h1 class="no-results">${movie.name}</h1>
            <br/>
        
            ${embed.join('')}
            <br/>

            <div class="dots">${dots.join('')}</div>
        
            `
                    overlayContent.innerHTML = content;
                    activeSlide = 0;
                    showVideos();
                } else {
                    overlayContent.innerHTML = `<h1 class="no-results">No Results Found</h1>`
                }
            }
        })
    }

    /* Close when someone clicks on the "x" symbol inside the overlay */
    function closeNav() {
        document.getElementById("myNav").style.width = "0%";
    }

    var activeSlide = 0;
    var totalVideos = 0;

    function showVideos() {
        let embedClasses = document.querySelectorAll('.embed');
        let dots = document.querySelectorAll('.dot');

        totalVideos = embedClasses.length;
        embedClasses.forEach((embedTag, idx) => {
            if (activeSlide == idx) {
                embedTag.classList.add('show')
                embedTag.classList.remove('hide')

            } else {
                embedTag.classList.add('hide');
                embedTag.classList.remove('show')
            }
        })

        dots.forEach((dot, indx) => {
            if (activeSlide == indx) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active')
            }
        })
    }

    const leftArrow = document.getElementById('left-arrow')
    const rightArrow = document.getElementById('right-arrow')

    leftArrow.addEventListener('click', () => {
        if (activeSlide > 0) {
            activeSlide--;
        } else {
            activeSlide = totalVideos - 1;
        }

        showVideos()
    })

    rightArrow.addEventListener('click', () => {
        if (activeSlide < (totalVideos - 1)) {
            activeSlide++;
        } else {
            activeSlide = 0;
        }
        showVideos()
    })


    function getColor(vote) {
        if (vote >= 8) {
            return 'green'
        } else if (vote >= 5) {
            return "orange"
        } else {
            return 'red'
        }
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const searchTerm = search.value;
        selectedGenre = [];
        setGenre();
        if (searchTerm) {
            getMovies(searchURL2 + '&query=' + searchTerm)
        } else {
            getMovies(API_URL2);
        }

    })

    prev.addEventListener('click', () => {
        if (prevPage > 0) {
            pageCall(prevPage);
        }
    })

    next.addEventListener('click', () => {
        if (nextPage <= totalPages) {
            pageCall(nextPage);
        }
    })

    function pageCall(page) {
        let urlSplit = lastUrl.split('?');
        let queryParams = urlSplit[1].split('&');
        let key = queryParams[queryParams.length - 1].split('=');
        if (key[0] != 'page') {
            let url = lastUrl + '&page=' + page
            getMovies(url);
        } else {
            key[1] = page.toString();
            let a = key.join('=');
            queryParams[queryParams.length - 1] = a;
            let b = queryParams.join('&');
            let url = urlSplit[0] + '?' + b
            getMovies(url);
        }
    }
}

//////////////////////////////////

function backbutton() {
    var first = tracelocation.pop();
    var second = tracelocation.pop();
    if (second[1] != null) {
        if (second[0] == "tvid") {
            resetcontent();
            tvPage(second[1]);
        }
        else if (second[0] == "movieid") {
            resetcontent();
            moviePage(second[1]);
        }
        else {
            resetcontent();
            PersonPage(second[1]);
        }
        
    }
    else {
        if (second[0] == "movies") {
            resetcontent();
            run_movies();
        }
        else if (second[0] == "trending") {
            run_trending("week", "week", "week", "week");
        }
        else if (second[0] == "tv") {
            resetcontent();
            run_tvshows();
        }
        else if (second[0] == "people") {
            resetcontent();
            run_people();
        }
        else if (second[0] == "lists") {
            resetcontent();
            run_lists();
        }
    }
}

function tvPage(id) {
    resetcontent();
    main.style.display = "block";
    const tvpage_url = 'https://api.themoviedb.org/3/tv/' + id + '?' + API_KEY;
    const tvpagecast_url = 'https://api.themoviedb.org/3/tv/' + id + '/credits?'+ API_KEY;
    fetch(tvpage_url).then(res => res.json()).then(page_data => {
        fetch(tvpagecast_url).then(res => res.json()).then(cast_data => {
            var genreadd = "";
            for (var key in page_data.genres) {
                var genreadd = page_data.genres[key].name + ", " + genreadd;
            }
            var genreadd = genreadd.substring(0, genreadd.length - 2);
            var released = page_data.status + " " + page_data.release_date;
            var castarr = [];
            var crewarr = [];
            const allcredits = [];
            const blankarr = [0, " ", " ", " "];
            for (let step = 0; step < 13; step++) {
                castarr.push(blankarr);
                crewarr.push(blankarr);
            }
            for (var castkey in cast_data.cast) {
                var cast_name = cast_data.cast[castkey].name;
                var cast_popular = cast_data.cast[castkey].popularity;
                var cast_img = 'https://image.tmdb.org/t/p/w500' + cast_data.cast[castkey].profile_path;
                var cast_character = cast_data.cast[castkey].character;
                castarr[castkey] = [cast_popular, cast_name, cast_character, cast_img, cast_data.cast[castkey].id];
                allcredits.push([cast_data.cast[castkey].id, cast_name, cast_character]);
            }
            for (var castkey in cast_data.crew) {
                var cast_name = cast_data.crew[castkey].name;
                var cast_popular = cast_data.crew[castkey].popularity;
                var cast_img = 'https://image.tmdb.org/t/p/w500' + cast_data.crew[castkey].profile_path;
                var cast_character = cast_data.crew[castkey].job;
                crewarr[castkey] = [cast_popular, cast_name, cast_character, cast_img, cast_data.crew[castkey].id];
                allcredits.push([cast_data.crew[castkey].id, cast_name, cast_character]);
            }
            crewarr.sort(sortFunction);
            castarr.sort(sortFunction);
            function sortFunction(a, b) {
                if (a[0] === b[0]) {
                    return 0;
                }
                else {
                    return (a[0] < b[0]) ? -1 : 1;
                }
            }
            // castarr[castarr.length] is the most popular etc.
            try {
                var shown_on = page_data.networks[0].name;
            } catch {
                var shown_on = "unknown";
            }
            main.innerHTML = `
                    <div class="post-container" style="margin: 3% 5% 3% 5%; overflow: auto;">
                        <div class="post-content" style="">
                            <div id="bg" class="movie-info" style="display: block; position: relative; background-color: #5161ce; background: url('${BG_IMG_URL + page_data.backdrop_path}'); background-repeat: no-repeat; background-size: cover;">
                                <div class="row">
                                    <div class="col-sm-3 container">
                                        <img width="100%" height="auto" style="max-height: 600px; max-width: 600px;" src="${page_data.poster_path ? IMG_URL + page_data.poster_path : "http://via.placeholder.com/1080x1580"}" alt="" class="image--cover" />
                                    </div>
                                    <div class= "col-lg-9 container" style="">
                                        <h3 style="font-weight: bold; font-size: 400%; padding-top: 10px;">${page_data.name}</h3>
                                        <br />
                                        <span class="${getColor(page_data.vote_average)}" style="margin-bottom: 20px;">${page_data.vote_average}</span>
                                        <br />
                                        <p style="padding-top: 10px; margin-bottom: 0;"><i>${"First Aired: " + page_data.first_air_date}</i></p>
                                        <p style="padding-top: 10px; fontsize="110%";"><u>Genres:</u></p>
                                        <p style="margin-bottom: 0;" id="genreaddp"></p>
                                        <p style="padding-top: 10px; fontsize="110%";"><u>Overview:</u></p>
                                        <p style="margin-bottom: 10px;">${page_data.overview}</p>
                                        <p style="padding-top: 10px; fontsize="110%";"><u>Other:</u></p>
                                        <p style="margin-bottom: 0; overflow: hidden;">${"Original Language: " + page_data.original_language}</p>
                                        <p style="margin-bottom: 0; overflow: hidden;">${"Number Of Seasons: " + page_data.number_of_seasons}</p>
                                        <p style="margin-bottom: 0; overflow: hidden;">${"Number of Episodes: " + page_data.number_of_episodes}</p>
                                        <p style="margin-bottom: 0; overflow: hidden;">${"Shown On: " + shown_on}</p>
                                        <br />
                                        <button class="know-more"><a id="website" href="${page_data.homepage}" style="color: white; text-decoration: none;" target="_blank">Website</a></button>
                                        <button type="button" class="know-more" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                          Full Credits
                                        </button>
                                        <button id="back" class="know-more">Back</button>
                                        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                          <div class="modal-dialog">
                                            <div class="modal-content">
                                              <div class="modal-header">
                                                <h5 class="modal-title" id="exampleModalLabel" style="color: black;">Full Credits</h5>
                                                <button type="button" class="btn-close" id="btnclose" data-bs-dismiss="modal" aria-label="Close"></button>
                                              </div>
                                              <div class="modal-body" id="modelbody">
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <br />
                                    </div>
                                </div>
                                <br />
                            </div>
                            <div class="movie-info" style="padding-bottom: 10px; background-color: #5161ce;">
                                <div class="row">
                                    <p style="margin-bottom: 0; padding-top: 10px; fontsize="150%"; background-color: #5161ce;"><u>Featured Cast:</u></p>
                                    <div id="cast1" class="col-sm-2" style="">
                                        <img width="100%" height=auto style="border-radius: 50%; object-fit: cover; object-position: center right;" src="${castarr[castarr.length - 1][3]}" alt="">
                                        <p style="margin-bottom: 0; overflow: hidden;">${castarr[castarr.length - 1][1]}</p>
                                        <p style="margin-bottom: 0; overflow: hidden;"><i>${castarr[castarr.length - 1][2]}</i></p>
                                    </div>
                                    <div id="cast2" class="col-sm-2" style="">
                                        <img width="100%" height=auto style="border-radius: 50%; object-fit: cover; object-position: center right;" src="${castarr[castarr.length - 2][3]}" alt="">
                                        <p style="margin-bottom: 0; overflow: hidden;">${castarr[castarr.length - 2][1]}</p>
                                        <p style="margin-bottom: 0; overflow: hidden;"><i>${castarr[castarr.length - 2][2]}</i></p>
                                    </div>
                                    <div id="cast3" class="col-sm-2" style="">
                                        <img width="100%" height=auto style="border-radius: 50%; object-fit: cover; object-position: center right;" src="${castarr[castarr.length - 3][3]}" alt="">
                                        <p style="margin-bottom: 0; overflow: hidden;">${castarr[castarr.length - 3][1]}</p>
                                        <p style="margin-bottom: 0; overflow: hidden;"><i>${castarr[castarr.length - 3][2]}</i></p>
                                    </div>
                                    <div id="cast4" class="col-sm-2" style="">
                                        <img width="100%" height=auto style="border-radius: 50%; object-fit: cover; object-position: center right;" src="${castarr[castarr.length - 4][3]}" alt="">
                                        <p style="margin-bottom: 0; overflow: hidden;">${castarr[castarr.length - 4][1]}</p>
                                        <p style="margin-bottom: 0; overflow: hidden;"><i>${castarr[castarr.length - 4][2]}</i></p>
                                    </div>
                                    <div id="cast5" class="col-sm-2 style="">
                                        <img width="100%" height=auto style="border-radius: 50%; object-fit: cover; object-position: center right;" src="${castarr[castarr.length - 5][3]}" alt="">
                                        <p style="margin-bottom: 0; overflow: hidden;">${castarr[castarr.length - 5][1]}</p>
                                        <p style="margin-bottom: 0; overflow: hidden;"><i>${castarr[castarr.length - 5][2]}</i></p>
                                    </div>
                                    <div id="cast6" class="col-sm-2 style="">
                                        <img width="100%" height=auto style="border-radius: 50%; object-fit: cover; object-position: center right;" src="${castarr[castarr.length - 6][3]}" alt="">
                                        <p style="margin-bottom: 0; overflow: hidden;">${castarr[castarr.length - 6][1]}</p>
                                        <p style="margin-bottom: 0; overflow: hidden;"><i>${castarr[castarr.length - 6][2]}</i></p>
                                    </div>
                                </div>
                        </div>
                        <div class="movie-info" style="padding-bottom: 10px; background-color: #5161ce;">
                                <div class="row">
                                    <p style="margin-bottom: 0; padding-top: 10px; fontsize="150%"; background-color: #5161ce;"><u>Featured Cast:</u></p>
                                    <div id="crew1" class="col-sm-2" style="">
                                        <img width="100%" height=auto style="border-radius: 50%; object-fit: cover; object-position: center right;" src="${crewarr[crewarr.length - 1][3]}" alt="">
                                        <p style="margin-bottom: 0; overflow: hidden;">${crewarr[crewarr.length - 1][1]}</p>
                                        <p style="margin-bottom: 0; overflow: hidden;"><i>${crewarr[crewarr.length - 1][2]}</i></p>
                                    </div>
                                    <div id="crew2" class="col-sm-2" style="">
                                        <img width="100%" height=auto style="border-radius: 50%; object-fit: cover; object-position: center right;" src="${crewarr[crewarr.length - 2][3]}" alt="">
                                        <p style="margin-bottom: 0; overflow: hidden;">${crewarr[crewarr.length - 2][1]}</p>
                                        <p style="margin-bottom: 0; overflow: hidden;"><i>${crewarr[crewarr.length - 2][2]}</i></p>
                                    </div>
                                    <div id="crew3" class="col-sm-2" style="">
                                        <img width="100%" height=auto style="border-radius: 50%; object-fit: cover; object-position: center right;" src="${crewarr[crewarr.length - 3][3]}" alt="">
                                        <p style="margin-bottom: 0; overflow: hidden;">${crewarr[crewarr.length - 3][1]}</p>
                                        <p style="margin-bottom: 0; overflow: hidden;"><i>${crewarr[crewarr.length - 3][2]}</i></p>
                                    </div>
                                    <div id="crew4" class="col-sm-2" style="">
                                        <img width="100%" height=auto style="border-radius: 50%; object-fit: cover; object-position: center right;" src="${crewarr[crewarr.length - 4][3]}" alt="">
                                        <p style="margin-bottom: 0; overflow: hidden;">${crewarr[crewarr.length - 4][1]}</p>
                                        <p style="margin-bottom: 0; overflow: hidden;"><i>${crewarr[crewarr.length - 4][2]}</i></p>
                                    </div>
                                    <div id="crew5" class="col-sm-2 style="">
                                        <img width="100%" height=auto style="border-radius: 50%; object-fit: cover; object-position: center right;" src="${crewarr[crewarr.length - 5][3]}" alt="">
                                        <p style="margin-bottom: 0; overflow: hidden;">${crewarr[crewarr.length - 5][1]}</p>
                                        <p style="margin-bottom: 0; overflow: hidden;"><i>${crewarr[crewarr.length - 5][2]}</i></p>
                                    </div>
                                    <div id="crew6" class="col-sm-2 style="">
                                        <img width="100%" height=auto style="border-radius: 50%; object-fit: cover; object-position: center right;" src="${crewarr[crewarr.length - 6][3]}" alt="">
                                        <p style="margin-bottom: 0; overflow: hidden;">${crewarr[crewarr.length - 6][1]}</p>
                                        <p style="margin-bottom: 0; overflow: hidden;"><i>${crewarr[crewarr.length - 6][2]}</i></p>
                                    </div>
                                </div>
                        </div>
                    </div>
                `

            tracelocation.push(["tvid", page_data.id]);

            back.onclick = function () { backbutton() };
            cast1.onclick = function () { PersonPage(castarr[castarr.length - 1][4]) }
            cast2.onclick = function () { PersonPage(castarr[castarr.length - 2][4]) }
            cast3.onclick = function () { PersonPage(castarr[castarr.length - 3][4]) }
            cast4.onclick = function () { PersonPage(castarr[castarr.length - 4][4]) }
            cast5.onclick = function () { PersonPage(castarr[castarr.length - 5][4]) }
            cast6.onclick = function () { PersonPage(castarr[castarr.length - 6][4]) }
            crew1.onclick = function () { PersonPage(crewarr[crewarr.length - 1][4]) }
            crew2.onclick = function () { PersonPage(crewarr[crewarr.length - 2][4]) }
            crew3.onclick = function () { PersonPage(crewarr[crewarr.length - 3][4]) }
            crew4.onclick = function () { PersonPage(crewarr[crewarr.length - 4][4]) }
            crew5.onclick = function () { PersonPage(crewarr[crewarr.length - 5][4]) }
            crew6.onclick = function () { PersonPage(crewarr[crewarr.length - 6][4]) }

            for (let key in allcredits) {
                var addcredit = document.createElement("p");
                addcredit.style = "margin-bottom: 0; overflow: hidden; color: black;";
                addcredit.textContent = allcredits[key][1] + " - " + allcredits[key][2];
                addcredit.onclick = function () { btnclose.click(); resetcontent(); PersonPage(allcredits[key][0]) }
                modelbody.appendChild(addcredit);
            }
            genreaddp.innerText = genreadd;
            if (page_data.homepage == "") {
                website.style.display = null;
            }
        })
    })
}

function moviePage(id) {
    resetcontent();
    main.style.display = "block";
    const moviepage_url = 'https://api.themoviedb.org/3/movie/' + id + '?' + API_KEY;
    const moviepagecast_url = 'https://api.themoviedb.org/3/movie/' + id + '/credits?' + API_KEY;
    fetch(moviepage_url).then(res => res.json()).then(page_data => {
        fetch(moviepagecast_url).then(res => res.json()).then(cast_data => {
            var genreadd = "";
            for (var key in page_data.genres) {
                var genreadd = page_data.genres[key].name + ", " + genreadd;
            }
            var genreadd = genreadd.substring(0, genreadd.length - 2);
            var released = page_data.status + " " + page_data.release_date;
            var castarr = [];
            var crewarr = [];
            const allcredits = [];
            const blankarr = [0, " ", " ", " "];
            for (let step = 0; step < 8; step++) {
                castarr.push(blankarr);
                crewarr.push(blankarr);
            }
            for (var castkey in cast_data.cast) {
                var cast_name = cast_data.cast[castkey].name;
                var cast_popular = cast_data.cast[castkey].popularity;
                var cast_img = 'https://image.tmdb.org/t/p/w500' + cast_data.cast[castkey].profile_path;
                var cast_character = cast_data.cast[castkey].character;
                castarr[castkey] = [cast_popular, cast_name, cast_character, cast_img, cast_data.cast[castkey].id];
                allcredits.push([cast_data.cast[castkey].id, cast_name, cast_character]);
            }
            for (var castkey in cast_data.crew) {
                var cast_name = cast_data.crew[castkey].name;
                var cast_popular = cast_data.crew[castkey].popularity;
                var cast_img = 'https://image.tmdb.org/t/p/w500' + cast_data.crew[castkey].profile_path;
                var cast_character = cast_data.crew[castkey].job;
                crewarr[castkey] = [cast_popular, cast_name, cast_character, cast_img, cast_data.crew[castkey].id];
                allcredits.push([cast_data.crew[castkey].id, cast_name, cast_character]);
            }
            crewarr.sort(sortFunction);
            castarr.sort(sortFunction);
            function sortFunction(a, b) {
                if (a[0] === b[0]) {
                    return 0;
                }
                else {
                    return (a[0] < b[0]) ? -1 : 1;
                }
            }
            // castarr[castarr.length] is the most popular etc.
            main.innerHTML = `
                    <div class="post-container" style="margin: 3% 5% 3% 5%; overflow: auto;">
                        <div class="post-content" style="">
                            <div id="bg" class="movie-info" style="display: block; position: relative; background-color: #5161ce; background: url('${BG_IMG_URL + page_data.backdrop_path}'); background-repeat: no-repeat; background-size: cover;">
                                <div class="row">
                                    <div class="col-sm-3 container">
                                        <img width="100%" height="auto" style="max-height: 600px; max-width: 600px;" src="${page_data.poster_path ? IMG_URL + page_data.poster_path : "http://via.placeholder.com/1080x1580"}" alt="" class="image--cover" />
                                    </div>
                                    <div class= "col-lg-9 container">
                                        <h3 style="font-weight: bold; font-size: 400%; padding-top: 10px;">${page_data.title}</h3>
                                        <br />
                                        <span class="${getColor(page_data.vote_average)}" style="margin-bottom: 20px;">${page_data.vote_average}</span>
                                        <br />
                                        <p style="padding-top: 10px; margin-bottom: 0;"><i>${released}</i></p>
                                        <p style="padding-top: 10px; fontsize="110%";"><u>Genres:</u></p>
                                        <p style="margin-bottom: 0;" id="genreaddp"></p>
                                        <p style="padding-top: 10px; fontsize="110%";"><u>Overview:</u></p>
                                        <p style="margin-bottom: 10px;">${page_data.overview}</p>
                                        <p style="padding-top: 10px; fontsize="110%";"><u>Other:</u></p>
                                        <p style="margin-bottom: 0; overflow: hidden;">${"Original Language: " + page_data.original_language}</p>
                                        <p style="margin-bottom: 0; overflow: hidden;">${"Budget: $" + page_data.budget}</p>
                                        <p style="margin-bottom: 0; overflow: hidden;">${"Revenue: $" + page_data.revenue}</p>
                                        <p style="margin-bottom: 0; overflow: hidden;">${"Runtime: " + page_data.runtime + " minutes"}</p>
                                        <br />
                                        <button class="know-more"><a id="website" href="${page_data.homepage}" style="color: white; text-decoration: none;" target="_blank">Website</a></button>
                                        <button type="button" class="know-more" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                          Full Credits
                                        </button>
                                        <button id="back" class="know-more">Back</button>
                                        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                          <div class="modal-dialog">
                                            <div class="modal-content">
                                              <div class="modal-header">
                                                <h5 class="modal-title" id="exampleModalLabel" style="color: black;">Full Credits</h5>
                                                <button type="button" class="btn-close" id="btnclose" data-bs-dismiss="modal" aria-label="Close"></button>
                                              </div>
                                              <div class="modal-body" id="modelbody">
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <br />
                                    </div>
                                </div>
                                <br />
                            </div>
                            <div class="movie-info" style="padding-bottom: 10px; background-color: #5161ce;">
                                <div class="row">
                                    <p style="margin-bottom: 0; padding-top: 10px; fontsize="150%"; background-color: #5161ce;"><u>Featured Cast:</u></p>
                                    <div id="cast1" class="col-sm-2">
                                        <img width="100%" height=auto style="border-radius: 50%; object-fit: cover; object-position: center right;" src="${castarr[castarr.length - 1][3]}" alt="">
                                        <p style="margin-bottom: 0; overflow: hidden;">${castarr[castarr.length - 1][1]}</p>
                                        <p style="margin-bottom: 0; overflow: hidden;"><i>${castarr[castarr.length - 1][2]}</i></p>
                                    </div>
                                    <div id="cast2" class="col-sm-2" style="">
                                        <img width="100%" height=auto style="border-radius: 50%; object-fit: cover; object-position: center right;" src="${castarr[castarr.length - 2][3]}" alt="">
                                        <p style="margin-bottom: 0; overflow: hidden;">${castarr[castarr.length - 2][1]}</p>
                                        <p style="margin-bottom: 0; overflow: hidden;"><i>${castarr[castarr.length - 2][2]}</i></p>
                                    </div>
                                    <div id="cast3" class="col-sm-2" style="">
                                        <img width="100%" height=auto style="border-radius: 50%; object-fit: cover; object-position: center right;" src="${castarr[castarr.length - 3][3]}" alt="">
                                        <p style="margin-bottom: 0; overflow: hidden;">${castarr[castarr.length - 3][1]}</p>
                                        <p style="margin-bottom: 0; overflow: hidden;"><i>${castarr[castarr.length - 3][2]}</i></p>
                                    </div>
                                    <div id="cast4" class="col-sm-2" style="">
                                        <img width="100%" height=auto style="border-radius: 50%; object-fit: cover; object-position: center right;" src="${castarr[castarr.length - 4][3]}" alt="">
                                        <p style="margin-bottom: 0; overflow: hidden;">${castarr[castarr.length - 4][1]}</p>
                                        <p style="margin-bottom: 0; overflow: hidden;"><i>${castarr[castarr.length - 4][2]}</i></p>
                                    </div>
                                    <div id="cast5" class="col-sm-2 style="">
                                        <img width="100%" height=auto style="border-radius: 50%; object-fit: cover; object-position: center right;" src="${castarr[castarr.length - 5][3]}" alt="">
                                        <p style="margin-bottom: 0; overflow: hidden;">${castarr[castarr.length - 5][1]}</p>
                                        <p style="margin-bottom: 0; overflow: hidden;"><i>${castarr[castarr.length - 5][2]}</i></p>
                                    </div>
                                    <div id="cast6" class="col-sm-2 style="">
                                        <img width="100%" height=auto style="border-radius: 50%; object-fit: cover; object-position: center right;" src="${castarr[castarr.length - 6][3]}" alt="">
                                        <p style="margin-bottom: 0; overflow: hidden;">${castarr[castarr.length - 6][1]}</p>
                                        <p style="margin-bottom: 0; overflow: hidden;"><i>${castarr[castarr.length - 6][2]}</i></p>
                                    </div>
                                </div>
                        </div>
                        <div class="movie-info" style="padding-bottom: 10px; background-color: #5161ce;">
                                <div class="row">
                                    <p style="margin-bottom: 0; padding-top: 10px; fontsize="150%"; background-color: #5161ce;"><u>Featured Cast:</u></p>
                                    <div id="crew1" class="col-sm-2" style="">
                                        <img width="100%" height=auto style="border-radius: 50%; object-fit: cover; object-position: center right;" src="${crewarr[crewarr.length - 1][3]}" alt="">
                                        <p style="margin-bottom: 0; overflow: hidden;">${crewarr[crewarr.length - 1][1]}</p>
                                        <p style="margin-bottom: 0; overflow: hidden;"><i>${crewarr[crewarr.length - 1][2]}</i></p>
                                    </div>
                                    <div id="crew2" class="col-sm-2" style="">
                                        <img width="100%" height=auto style="border-radius: 50%; object-fit: cover; object-position: center right;" src="${crewarr[crewarr.length - 2][3]}" alt="">
                                        <p style="margin-bottom: 0; overflow: hidden;">${crewarr[crewarr.length - 2][1]}</p>
                                        <p style="margin-bottom: 0; overflow: hidden;"><i>${crewarr[crewarr.length - 2][2]}</i></p>
                                    </div>
                                    <div id="crew3" class="col-sm-2" style="">
                                        <img width="100%" height=auto style="border-radius: 50%; object-fit: cover; object-position: center right;" src="${crewarr[crewarr.length - 3][3]}" alt="">
                                        <p style="margin-bottom: 0; overflow: hidden;">${crewarr[crewarr.length - 3][1]}</p>
                                        <p style="margin-bottom: 0; overflow: hidden;"><i>${crewarr[crewarr.length - 3][2]}</i></p>
                                    </div>
                                    <div id="crew4" class="col-sm-2" style="">
                                        <img width="100%" height=auto style="border-radius: 50%; object-fit: cover; object-position: center right;" src="${crewarr[crewarr.length - 4][3]}" alt="">
                                        <p style="margin-bottom: 0; overflow: hidden;">${crewarr[crewarr.length - 4][1]}</p>
                                        <p style="margin-bottom: 0; overflow: hidden;"><i>${crewarr[crewarr.length - 4][2]}</i></p>
                                    </div>
                                    <div id="crew5" class="col-sm-2 style="">
                                        <img width="100%" height=auto style="border-radius: 50%; object-fit: cover; object-position: center right;" src="${crewarr[crewarr.length - 5][3]}" alt="">
                                        <p style="margin-bottom: 0; overflow: hidden;">${crewarr[crewarr.length - 5][1]}</p>
                                        <p style="margin-bottom: 0; overflow: hidden;"><i>${crewarr[crewarr.length - 5][2]}</i></p>
                                    </div>
                                    <div id="crew6" class="col-sm-2 style="">
                                        <img width="100%" height=auto style="border-radius: 50%; object-fit: cover; object-position: center right;" src="${crewarr[crewarr.length - 6][3]}" alt="">
                                        <p style="margin-bottom: 0; overflow: hidden;">${crewarr[crewarr.length - 6][1]}</p>
                                        <p style="margin-bottom: 0; overflow: hidden;"><i>${crewarr[crewarr.length - 6][2]}</i></p>
                                    </div>
                                </div>
                        </div>
                    </div>
                `

            tracelocation.push(["movieid", page_data.id]);

            back.onclick = function () { backbutton() };
            cast1.onclick = function () { PersonPage(castarr[castarr.length - 1][4]) }
            cast2.onclick = function () { PersonPage(castarr[castarr.length - 2][4]) }
            cast3.onclick = function () { PersonPage(castarr[castarr.length - 3][4]) }
            cast4.onclick = function () { PersonPage(castarr[castarr.length - 4][4]) }
            cast5.onclick = function () { PersonPage(castarr[castarr.length - 5][4]) }
            cast6.onclick = function () { PersonPage(castarr[castarr.length - 6][4]) }
            crew1.onclick = function () { PersonPage(crewarr[crewarr.length - 1][4]) }
            crew2.onclick = function () { PersonPage(crewarr[crewarr.length - 2][4]) }
            crew3.onclick = function () { PersonPage(crewarr[crewarr.length - 3][4]) }
            crew4.onclick = function () { PersonPage(crewarr[crewarr.length - 4][4]) }
            crew5.onclick = function () { PersonPage(crewarr[crewarr.length - 5][4]) }
            crew6.onclick = function () { PersonPage(crewarr[crewarr.length - 6][4]) }

            for (let key in allcredits) {
                var addcredit = document.createElement("p");
                addcredit.style = "margin-bottom: 0; overflow: hidden; color: black;";
                addcredit.textContent = allcredits[key][1] + " - " + allcredits[key][2];
                addcredit.onclick = function () { btnclose.click(); resetcontent(); PersonPage(allcredits[key][0]) }
                modelbody.appendChild(addcredit);
            }

            genreaddp.innerText = genreadd;
            if (page_data.homepage == "") {
                website.style.display = null;
            }
        })
    })
}

////////////////////////////////////////////////////////////////////////

function getColor(vote) {
    if (vote >= 8) {
        return 'green'
    } else if (vote >= 5) {
        return "orange"
    } else {
        return 'red'
    }
}

///////////////////////////////////////////////////////////////////////////

function run_movies() {
    document.getElementById("pagescontainer").style.display = "flex";
    document.getElementById("tags").style.display = "flex";
    document.getElementById("pagescontainer").style.display = "flex";
    document.getElementById("form").style.display = "flex";

    tracelocation.push(["movies", null]);

    var selectedGenre = []
    setGenre();
    function setGenre() {
        tagsEl.innerHTML = '';
        genres.forEach(genre => {
            const t = document.createElement('div');
            t.classList.add('tag');
            t.id = genre.id;
            t.innerText = genre.name;
            t.addEventListener('click', () => {
                if (selectedGenre.length == 0) {
                    selectedGenre.push(genre.id);
                } else {
                    if (selectedGenre.includes(genre.id)) {
                        selectedGenre.forEach((id, idx) => {
                            if (id == genre.id) {
                                selectedGenre.splice(idx, 1);
                            }
                        })
                    } else {
                        selectedGenre.push(genre.id);
                    }
                }
                getMovies(API_URL + '&with_genres=' + encodeURI(selectedGenre.join(',')))
                highlightSelection()
            })
            tagsEl.append(t);
        })
    }

    function highlightSelection() {
        const tags = document.querySelectorAll('.tag');
        tags.forEach(tag => {
            tag.classList.remove('highlight')
        })
        clearBtn()
        if (selectedGenre.length != 0) {
            selectedGenre.forEach(id => {
                const hightlightedTag = document.getElementById(id);
                hightlightedTag.classList.add('highlight');
            })
        }

    }

    function clearBtn() {
        let clearBtn = document.getElementById('clear');
        if (clearBtn) {
            clearBtn.classList.add('highlight')
        } else {

            let clear = document.createElement('div');
            clear.classList.add('tag', 'highlight');
            clear.id = 'clear';
            clear.innerText = 'Clear x';
            clear.addEventListener('click', () => {
                selectedGenre = [];
                setGenre();
                getMovies(API_URL);
            })
            tagsEl.append(clear);
        }

    }

    getMovies(API_URL);

    function getMovies(url) {
        lastUrl = url;
        fetch(url).then(res => res.json()).then(data => {
            if (data.results.length !== 0) {
                showMovies(data.results);
                currentPage = data.page;
                nextPage = currentPage + 1;
                prevPage = currentPage - 1;
                totalPages = data.total_pages;

                current.innerText = currentPage;

                if (currentPage <= 1) {
                    prev.classList.add('disabled');
                    next.classList.remove('disabled')
                } else if (currentPage >= totalPages) {
                    prev.classList.remove('disabled');
                    next.classList.add('disabled')
                } else {
                    prev.classList.remove('disabled');
                    next.classList.remove('disabled')
                }

            } else {
                main.innerHTML = `<h1 class="no-results">No Results Found</h1>`
            }

        })

    }


    function showMovies(data) {
        main.innerHTML = '';

        data.forEach(movie => {
            const { title, poster_path, vote_average, overview, id } = movie;
            const movieEl = document.createElement('div');
            movieEl.classList.add('movie');
            movieEl.innerHTML = `
                 <img src="${poster_path ? IMG_URL + poster_path : "http://via.placeholder.com/1080x1580"}" alt="${title}">

                <div class="movie-info">
                    <h3>${title}</h3>
                    <span class="${getColor(vote_average)}">${vote_average}</span>
                </div>

                <div class="overview">

                    <h3>Overview</h3>
                    ${overview}
                    <br/> 
                    <button class="know-more" id="${id}">Videos</button>
                    <button class="gopage" onclick="moviePage('${id}');">View Page</button>
                </div>
        
            `

            main.appendChild(movieEl);

            document.getElementById(id).addEventListener('click', () => {
                openNav(movie)
            })
        })
    }

    const overlayContent = document.getElementById('overlay-content');
    /* Open when someone clicks on the span element */
    function openNav(movie) {
        let id = movie.id;
        fetch(BASE_URL + '/movie/' + id + '/videos?' + API_KEY).then(res => res.json()).then(videoData => {
            if (videoData) {
                document.getElementById("myNav").style.width = "100%";
                if (videoData.results.length > 0) {
                    var embed = [];
                    var dots = [];
                    videoData.results.forEach((video, idx) => {
                        let { name, key, site } = video

                        if (site == 'YouTube') {

                            embed.push(`
                  <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          
              `)

                            dots.push(`
                  <span class="dot">${idx + 1}</span>
                `)
                        }
                    })

                    var content = `
            <h1 class="no-results">${movie.original_title}</h1>
            <br/>
        
            ${embed.join('')}
            <br/>

            <div class="dots">${dots.join('')}</div>
        
            `
                    overlayContent.innerHTML = content;
                    activeSlide = 0;
                    showVideos();
                } else {
                    overlayContent.innerHTML = `<h1 class="no-results">No Results Found</h1>`
                }
            }
        })
    }

    /* Close when someone clicks on the "x" symbol inside the overlay */
    function closeNav() {
        document.getElementById("myNav").style.width = "0%";
    }

    var activeSlide = 0;
    var totalVideos = 0;

    function showVideos() {
        let embedClasses = document.querySelectorAll('.embed');
        let dots = document.querySelectorAll('.dot');

        totalVideos = embedClasses.length;
        embedClasses.forEach((embedTag, idx) => {
            if (activeSlide == idx) {
                embedTag.classList.add('show')
                embedTag.classList.remove('hide')

            } else {
                embedTag.classList.add('hide');
                embedTag.classList.remove('show')
            }
        })

        dots.forEach((dot, indx) => {
            if (activeSlide == indx) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active')
            }
        })
    }

    const leftArrow = document.getElementById('left-arrow')
    const rightArrow = document.getElementById('right-arrow')

    leftArrow.addEventListener('click', () => {
        if (activeSlide > 0) {
            activeSlide--;
        } else {
            activeSlide = totalVideos - 1;
        }

        showVideos()
    })

    rightArrow.addEventListener('click', () => {
        if (activeSlide < (totalVideos - 1)) {
            activeSlide++;
        } else {
            activeSlide = 0;
        }
        showVideos()
    })


    function getColor(vote) {
        if (vote >= 8) {
            return 'green'
        } else if (vote >= 5) {
            return "orange"
        } else {
            return 'red'
        }
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const searchTerm = search.value;
        selectedGenre = [];
        setGenre();
        if (searchTerm) {
            getMovies(searchURL + '&query=' + searchTerm)
        } else {
            getMovies(API_URL);
        }

    })

    prev.addEventListener('click', () => {
        if (prevPage > 0) {
            pageCall(prevPage);
        }
    })

    next.addEventListener('click', () => {
        if (nextPage <= totalPages) {
            pageCall(nextPage);
        }
    })

    function pageCall(page) {
        let urlSplit = lastUrl.split('?');
        let queryParams = urlSplit[1].split('&');
        let key = queryParams[queryParams.length - 1].split('=');
        if (key[0] != 'page') {
            let url = lastUrl + '&page=' + page
            getMovies(url);
        } else {
            key[1] = page.toString();
            let a = key.join('=');
            queryParams[queryParams.length - 1] = a;
            let b = queryParams.join('&');
            let url = urlSplit[0] + '?' + b
            getMovies(url);
        }
    }
}

////////////////////////////////////

function resetcontent() {
    form.removeEventListener('submit', myFunction);
    next.removeEventListener('click', myFunction);
    prev.removeEventListener('click', myFunction);
    function myFunction() {
        var test = true;
    }
    try {
        var div = document.getElementById("main");
        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }
    }
    catch {
        var donothing = "TRUE";
    }
    document.getElementById("pagescontainer").style.display = "none";
    document.getElementById("tags").style.display = "none";
    document.getElementById("pagescontainer").style.display = "none";
    document.getElementById("form").style.display = "none";
    document.getElementById("main").style.display = "flex";
}

////////////////////////////////////////////

function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}

/////////////////////////////////////////////////

function runtype(type, arrid) {
    if (type == "movie") {
        moviePage(arrid);
    }
    else if (type == "tv") {
        tvPage(arrid);
    }
    else {
        PersonPage(arrid);
    }
}

function run_trending(all_time, tv_time, movie_time, people_time) {
    resetcontent();
    main.style.display = "block";
    const all_trending = 'https://api.themoviedb.org/3/trending/all/' + all_time + '?' + API_KEY;
    const movie_trending = 'https://api.themoviedb.org/3/trending/movie/' + all_time + '?' + API_KEY;
    const person_trending = 'https://api.themoviedb.org/3/trending/person/' + all_time + '?' + API_KEY;
    const tv_trending = 'https://api.themoviedb.org/3/trending/tv/' + all_time + '?' + API_KEY;

    tracelocation.push(["trending", null]);

    fetch(all_trending).then(res => res.json()).then(allresults => {
        fetch(movie_trending).then(res => res.json()).then(movieresults => {
            fetch(tv_trending).then(res => res.json()).then(tvresults => {
                fetch(person_trending).then(res => res.json()).then(personresults => {
                    allresults = allresults.results;
                    movieresults = movieresults.results;
                    tvresults = tvresults.results;
                    personresults = personresults.results;
                    const allarr = [];
                    const moviearr = [];
                    const personarr = [];
                    const tvarr = [];
                    for (i = 0; i <= 5; i++) {

                        var item = allresults[i];
                        if (item.media_type == "tv") {
                            var itemid = item.id;
                            var itemimg = 'https://image.tmdb.org/t/p/w500' + item.poster_path;
                            var itemname = item.name;
                            var itemtype = item.media_type;
                        }
                        else if (item.media_type == "movie") {
                            var itemid = item.id;
                            var itemimg = 'https://image.tmdb.org/t/p/w500' + item.poster_path;
                            var itemname = item.title;
                            var itemtype = item.media_type;
                        }
                        else {
                            var itemid = item.id;
                            var itemname = item.name;
                            var itemimg = 'https://image.tmdb.org/t/p/w500' + item.profile_path;
                            var itemtype = item.media_type;
                        }
                        allarr.push([itemname, itemimg, itemid, itemtype]);

                        var item = movieresults[i];
                        var itemid = item.id;
                        var itemimg = 'https://image.tmdb.org/t/p/w500' + item.poster_path;
                        var itemname = item.title;
                        var itemtype = item.media_type;
                        moviearr.push([itemname, itemimg, itemid, itemtype]);

                        var item = tvresults[i];
                        var itemid = item.id;
                        var itemimg = 'https://image.tmdb.org/t/p/w500' + item.poster_path;
                        var itemname = item.name;
                        var itemtype = item.media_type;
                        tvarr.push([itemname, itemimg, itemid, itemtype]);

                        var item = personresults[i];
                        var itemid = item.id;
                        var itemname = item.name;
                        var itemtype = item.media_type;
                        var itemimg = 'https://image.tmdb.org/t/p/w500' + item.profile_path;
                        personarr.push([itemname, itemimg, itemid, itemtype]);
                    }
                    main.innerHTML = `
                        <div class="post-container" style="margin: 3% 5% 3% 5%; overflow: auto;">
                            <div class="post-content" style="">
                                 <div class="row container" style="padding-bottom: 20px;">
                                        <h1>All Trending</h1>
                                 </div>
                                 <div class="row container" style="padding-bottom: 60px;">
                                         <div class="col-sm-2" onclick="resetcontent(); runtype('${allarr[0][3]}', '${allarr[0][2]}');">
                                               <img width="100%" height="auto" style="max-height: 500px; max-width: 500px;" src="${allarr[0][1]}" alt="" class="image--cover" />
                                               <p style="margin-bottom: 0; overflow: hidden; text-align: center;">${allarr[0][0]}</p>
                                         </div>
                                         <div class="col-sm-2" onclick="resetcontent(); runtype('${allarr[1][3]}', '${allarr[1][2]}');">
                                               <img width="100%" height="auto" style="max-height: 500px; max-width: 500px;" src="${allarr[1][1]}" alt="" class="image--cover" />
                                               <p style="margin-bottom: 0; overflow: hidden; text-align: center;">${allarr[1][0]}</p>
                                         </div>
                                         <div class="col-sm-2" onclick="resetcontent(); runtype('${allarr[2][3]}', '${allarr[2][2]}');">
                                            <img width="100%" height="auto" style="max-height: 500px; max-width: 500px;" src="${allarr[2][1]}" alt="" class="image--cover" />
                                            <p style="margin-bottom: 0; overflow: hidden; text-align: center;">${allarr[2][0]}</p>
                                         </div>
                                        <div class="col-sm-2" onclick="resetcontent(); runtype('${allarr[3][3]}', '${allarr[3][2]}');">
                                            <img width="100%" height="auto" style="max-height: 500px; max-width: 500px;" src="${allarr[3][1]}" alt="" class="image--cover" />
                                            <p style="margin-bottom: 0; overflow: hidden; text-align: center;">${allarr[3][0]}</p>
                                        </div>
                                        <div class="col-sm-2" onclick="resetcontent(); runtype('${allarr[4][3]}', '${allarr[4][2]}');">
                                            <img width="100%" height="auto" style="max-height: 500px; max-width: 500px;" src="${allarr[4][1]}" alt="" class="image--cover" />
                                            <p style="margin-bottom: 0; overflow: hidden; text-align: center;">${allarr[4][0]}</p>
                                        </div>
                                        <div class="col-sm-2" onclick="resetcontent(); runtype('${allarr[5][3]}', '${allarr[5][2]}');">
                                            <img width="100%" height="auto" style="max-height: 500px; max-width: 500px;" src="${allarr[5][1]}" alt="" class="image--cover" />
                                            <p style="margin-bottom: 0; overflow: hidden; text-align: center;">${allarr[5][0]}</p>
                                        </div>
                                  </div>
                                 <div class="row container" style="padding-bottom: 20px;">
                                        <h1>Movie Trending</h1>
                                 </div>
                                 <div class="row container" style="padding-bottom: 60px;">
                                         <div class="col-sm-2" onclick="resetcontent(); runtype('${moviearr[0][3]}', '${moviearr[0][2]}');">
                                               <img width="100%" height="auto" style="max-height: 500px; max-width: 500px;" src="${moviearr[0][1]}" alt="" class="image--cover" />
                                               <p style="margin-bottom: 0; overflow: hidden; text-align: center;">${moviearr[0][0]}</p>
                                         </div>
                                         <div class="col-sm-2" onclick="resetcontent(); runtype('${moviearr[1][3]}', '${moviearr[1][2]}');">
                                               <img width="100%" height="auto" style="max-height: 500px; max-width: 500px;" src="${moviearr[1][1]}" alt="" class="image--cover" />
                                               <p style="margin-bottom: 0; overflow: hidden; text-align: center;">${moviearr[1][0]}</p>
                                         </div>
                                         <div class="col-sm-2" onclick="resetcontent(); runtype('${moviearr[2][3]}', '${moviearr[2][2]}');">
                                            <img width="100%" height="auto" style="max-height: 500px; max-width: 500px;" src="${moviearr[2][1]}" alt="" class="image--cover" />
                                            <p style="margin-bottom: 0; overflow: hidden; text-align: center;">${moviearr[2][0]}</p>
                                         </div>
                                        <div class="col-sm-2" onclick="resetcontent(); runtype('${moviearr[3][3]}', '${moviearr[3][2]}');">
                                            <img width="100%" height="auto" style="max-height: 500px; max-width: 500px;" src="${moviearr[3][1]}" alt="" class="image--cover" />
                                            <p style="margin-bottom: 0; overflow: hidden; text-align: center;">${moviearr[3][0]}</p>
                                        </div>
                                        <div class="col-sm-2" onclick="resetcontent(); runtype('${moviearr[4][3]}', '${moviearr[4][2]}');">
                                            <img width="100%" height="auto" style="max-height: 500px; max-width: 500px;" src="${moviearr[4][1]}" alt="" class="image--cover" />
                                            <p style="margin-bottom: 0; overflow: hidden; text-align: center;">${moviearr[4][0]}</p>
                                        </div>
                                        <div class="col-sm-2" onclick="resetcontent(); runtype('${moviearr[5][3]}', '${moviearr[5][2]}');">
                                            <img width="100%" height="auto" style="max-height: 500px; max-width: 500px;" src="${moviearr[5][1]}" alt="" class="image--cover" />
                                            <p style="margin-bottom: 0; overflow: hidden; text-align: center;">${moviearr[5][0]}</p>
                                        </div>
                                  </div>
                                 <div class="row container" style="padding-bottom: 20px;">
                                        <h1>TV-Show Trending</h1>
                                 </div>
                                 <div class="row container" style="padding-bottom: 60px;">
                                         <div class="col-sm-2" onclick="resetcontent(); runtype('${tvarr[0][3]}', '${tvarr[0][2]}');">
                                               <img width="100%" height="auto" style="max-height: 500px; max-width: 500px;" src="${tvarr[0][1]}" alt="" class="image--cover" />
                                               <p style="margin-bottom: 0; overflow: hidden; text-align: center;">${tvarr[0][0]}</p>
                                         </div>
                                         <div class="col-sm-2" onclick="resetcontent(); runtype('${tvarr[1][3]}', '${tvarr[1][2]}');">
                                               <img width="100%" height="auto" style="max-height: 500px; max-width: 500px;" src="${tvarr[1][1]}" alt="" class="image--cover" />
                                               <p style="margin-bottom: 0; overflow: hidden; text-align: center;">${tvarr[1][0]}</p>
                                         </div>
                                         <div class="col-sm-2" onclick="resetcontent(); runtype('${tvarr[2][3]}', '${tvarr[2][2]}');">
                                            <img width="100%" height="auto" style="max-height: 500px; max-width: 500px;" src="${tvarr[2][1]}" alt="" class="image--cover" />
                                            <p style="margin-bottom: 0; overflow: hidden; text-align: center;">${tvarr[2][0]}</p>
                                         </div>
                                        <div class="col-sm-2" onclick="resetcontent(); runtype('${tvarr[3][3]}', '${tvarr[3][2]}');">
                                            <img width="100%" height="auto" style="max-height: 500px; max-width: 500px;" src="${tvarr[3][1]}" alt="" class="image--cover" />
                                            <p style="margin-bottom: 0; overflow: hidden; text-align: center;">${tvarr[3][0]}</p>
                                        </div>
                                        <div class="col-sm-2" onclick="resetcontent(); runtype('${tvarr[4][3]}', '${tvarr[4][2]}');">
                                            <img width="100%" height="auto" style="max-height: 500px; max-width: 500px;" src="${tvarr[4][1]}" alt="" class="image--cover" />
                                            <p style="margin-bottom: 0; overflow: hidden; text-align: center;">${tvarr[4][0]}</p>
                                        </div>
                                        <div class="col-sm-2" onclick="resetcontent(); runtype('${tvarr[5][3]}', '${tvarr[5][2]}');">
                                            <img width="100%" height="auto" style="max-height: 500px; max-width: 500px;" src="${tvarr[5][1]}" alt="" class="image--cover" />
                                            <p style="margin-bottom: 0; overflow: hidden; text-align: center;">${tvarr[5][0]}</p>
                                        </div>
                                  </div>
                                 <div class="row container" style="padding-bottom: 20px;">
                                        <h1>People Trending</h1>
                                 </div>
                                 <div class="row container" style="padding-bottom: 60px;">
                                         <div id="p1" class="col-sm-2" onclick="resetcontent(); runtype('${personarr[0][3]}', '${personarr[0][2]}');">
                                               <img width="100%" height="auto" style="max-height: 500px; max-width: 500px;" src="${personarr[0][1]}" alt="" class="image--cover" />
                                               <p style="margin-bottom: 0; overflow: hidden; text-align: center;">${personarr[0][0]}</p>
                                         </div>
                                         <div id="p2" class="col-sm-2" onclick="resetcontent(); runtype('${personarr[1][3]}', '${personarr[1][2]}');">
                                               <img width="100%" height="auto" style="max-height: 500px; max-width: 500px;" src="${personarr[1][1]}" alt="" class="image--cover" />
                                               <p style="margin-bottom: 0; overflow: hidden; text-align: center;">${personarr[1][0]}</p>
                                         </div>
                                         <div id="p3" class="col-sm-2" onclick="resetcontent(); runtype('${personarr[2][3]}', '${personarr[2][2]}');">
                                            <img width="100%" height="auto" style="max-height: 500px; max-width: 500px;" src="${personarr[2][1]}" alt="" class="image--cover" />
                                            <p style="margin-bottom: 0; overflow: hidden; text-align: center;">${personarr[2][0]}</p>
                                         </div>
                                        <div id="p4" class="col-sm-2" onclick="resetcontent(); runtype('${personarr[3][3]}', '${personarr[3][2]}');">
                                            <img width="100%" height="auto" style="max-height: 500px; max-width: 500px;" src="${personarr[3][1]}" alt="" class="image--cover" />
                                            <p style="margin-bottom: 0; overflow: hidden; text-align: center;">${personarr[3][0]}</p>
                                        </div>
                                        <div id="p5" class="col-sm-2" onclick="resetcontent(); runtype('${personarr[4][3]}', '${personarr[4][2]}');">
                                            <img width="100%" height="auto" style="max-height: 500px; max-width: 500px;" src="${personarr[4][1]}" alt="" class="image--cover" />
                                            <p style="margin-bottom: 0; overflow: hidden; text-align: center;">${personarr[4][0]}</p>
                                        </div>
                                        <div id="p6" class="col-sm-2" onclick="resetcontent(); runtype('${personarr[5][3]}', '${personarr[5][2]}');">
                                            <img width="100%" height="auto" style="max-height: 500px; max-width: 500px;" src="${personarr[5][1]}" alt="" class="image--cover" />
                                            <p style="margin-bottom: 0; overflow: hidden; text-align: center;">${personarr[5][0]}</p>
                                        </div>
                                  </div>

                            </div>
                        </div>
                     `
                })
            })
        })
    })
}

