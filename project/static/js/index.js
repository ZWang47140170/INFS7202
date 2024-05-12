var content = $("content");
FillIn(content);
var paper = $("paper");

// Send AJAX request to fetch survey information
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
            // If request is successful, call addContent function to add survey information to the page
            var data = JSON.parse(xhr.responseText).survey_info;
            addTitle(paper);
            data.forEach(function (e) {
                e = JSON.stringify(e);
                console.log(e)
                addContent(e);
            })
        } else {
            // If request fails, output error message
            console.error('Failed to fetch survey information');
        }
    }
};
xhr.open('GET', '/survey_info', true);
xhr.send();

function addTitle(obj) {
    var box = document.createElement("div");
    box.className = "top-title";
    for(var i = 0;i<5;i++){
        var div = document.createElement("div");
        (function (k) {
            switch (k){
                case 0:
                    div.className = "test-title";
                    div.innerText = "title";
                    box.appendChild(div);
                    break;
                case 1:
                    div.className = "test-time";
                    div.innerText = "time";
                    box.appendChild(div);
                    break;
                case 2:
                    div.className = "test-state";
                    div.innerText = "state";
                    box.appendChild(div);
                    break;
                case 3:
                    div.className = "test-operate";
                    div.innerText = "operate";
                    box.appendChild(div);
                    break;
                case 4:
                    div.className = "test-new";
                    var btn = document.createElement("button");
                    btn.innerText = "new survey";
                    btn.type = "button";
                    btn.onclick = function () {
                        window.location.href = "new";
                    };
                    div.appendChild(btn);
                    box.appendChild(div);
                    break;
            }
        })(i)
    }
    obj.appendChild(box)
}


function addContent(e) {
    var box = document.createElement("div");
    var data = JSON.parse(e);
    box.className = "line";

    for(var i=0;i<4;i++){
        var div = document.createElement("div");
        (function (k) {
            switch (k){
                case 0:
                    div.className = "test-title";
                    div.innerText = data.title;
                    box.appendChild(div);
                    break;
                case 1:
                    div.className = "test-time";
                    div.innerText = data.stopTime;
                    box.appendChild(div);
                    break;
                case 2:
                    div.className = "test-state";
                    div.innerText = "completed";
                    box.appendChild(div);
                    break;
                case 3:
                    div.className = "btn-group";
                    for(var j = 0;j<4;j++){
                        var btn = document.createElement("button");
                        (function (k) {
                            switch (k){
                                case 0:
                                    btn.innerText = "delete";
                                    btn.type = "button";
                                    div.appendChild(btn);
                                    btn.addEventListener("click", function() {
                                        delete_S(data.sid)
                                    });
                                    break;
                                case 1:
                                    btn.innerText = "view";
                                    btn.type = "button";
                                    div.appendChild(btn);
                                    btn.onclick = function() {
                                        window.location.href = "/view?sid=" + data.sid;
                                    };
                                    break;
                                case 2:
                                    btn.innerText = "fill out";
                                    btn.type = "button";
                                    div.appendChild(btn);
                                    btn.onclick = function() {
                                        window.location.href = "/do?sid=" + data.sid;
                                    };
                                    break;
                                case 3:
                                    btn.innerText = "result";
                                    btn.type = "button";
                                    div.appendChild(btn);
                                    btn.onclick = function() {
                                        window.location.href = "/result?sid=" + data.sid;
                                    };
                                    break;
                            }
                        })(j);
                    }
                    box.appendChild(div);
                    break;
            }
        })(i)
    }
    paper.appendChild(box);
}

function delete_S(id){
    // Get sid of the current row
    var sid = id
    console.log(sid)
    // Send delete request to backend
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Request successful, reload page or perform other actions
                window.location.reload();
            } else {
                // Request fails, output error message
                console.error('Failed to delete survey');
            }
        }
    };
    xhr.open('DELETE', '/delete_survey?sid=' + sid, true);
    xhr.send();
}

var button5 = document.getElementById('quit');
button5.onclick = function () {
    window.location.href = "/quit";
}