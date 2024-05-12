(function () {
    function FillIn(obj) {
        var height = document.documentElement.clientHeight || document.body.clientHeight;
        var scroll = document.documentElement.scrollTop || document.body.scrollTop;
        obj.style.minHeight = height+scroll - 80 + "px";
    }
    window.FillIn = FillIn;
})();

function $(id) {
    return document.getElementById(id);
}


function EditaddRadio(parent, obj, amend, data) {
    var box = document.createElement("div");
    box.className = "question";
    var title = document.createElement("div");
    title.className = "question-title";
    var content = document.createElement("div");
    content.className = "question-content";
    if (amend) {
        title.innerHTML = "<i>"+data.questionTitle.split(".")[0]+".</i><span contenteditable='true' class='revise'>"+data.questionTitle.split(".")[1]+"</span>";
        for (var i = 0; i < data.questionContent.length; i++) {
            var p = "<div><input type='radio' value='" + data.questionContent[i] + "'><span contenteditable='true' class='revise'>"+data.questionContent[i]+"</span></div>";
            content.innerHTML += p;
        }
    } else {
        title.innerHTML = "<i>"+data.questionTitle.split(".")[0]+".</i><span>"+data.questionTitle.split(".")[1]+"</span>";
        for (var i = 0; i < data.questionContent.length; i++) {
            var p = "<div><input type='radio' value='" + data.questionContent[i] + "'><span>" + data.questionContent[i] + "</span></div>";
            content.innerHTML += p;
        }
    }
    box.appendChild(title);
    box.appendChild(content);

    parent.insertBefore(box, obj);

}

function EditaddCheck(parent, obj, amend, data) {
    var box = document.createElement("div");
    box.className = "question";
    var title = document.createElement("div");
    title.className = "question-title";
    // Store qid and sid
    box.dataset.qid = data.qid;
    box.dataset.sid = data.sid;
    box.dataset.type = data.questionType;

    var content = document.createElement("div");
    content.className = "question-content";
    if (amend) {
        title.innerHTML = "<i>"+data.questionTitle.split(".")[0]+".</i><span contenteditable='true' class='revise'>"+data.questionTitle.split(".")[1]+"</span>";
        for (var i = 0; i < data.questionContent.length; i++) {

            var p = "<div><input type='checkbox' value='" + data.questionContent[i] + "'><span contenteditable='true' class='revise'>"+data.questionContent[i]+"</span></div>";
            content.innerHTML += p;
        }
    } else {
        title.innerHTML = "<i>"+data.questionTitle.split(".")[0]+".</i><span>"+data.questionTitle.split(".")[1]+"</span>";
        for (var i = 0; i < data.questionContent.length; i++) {

            var p = "<div><input type='checkbox' value='" + data.questionContent[i] + "'><span>"+data.questionContent[i]+"</span></div>";
            content.innerHTML += p;
        }
    }
    box.appendChild(title);
    box.appendChild(content);
    parent.insertBefore(box, obj);
}

function EditaddTextarea(parent, obj, amend, data) {
    var box = document.createElement("div");
    box.className = "question";
    var title = document.createElement("div");
    title.className = "question-title";
    // Store qid and sid
    box.dataset.qid = data.qid;
    box.dataset.sid = data.sid;
    box.dataset.type = data.questionType;
    if (amend) {
        title.innerHTML = "<i>"+data.questionTitle.split(".")[0]+".</i><span contenteditable='true' class='revise'>"+data.title.split(".")[1]+"</span>";
    } else {
        title.innerHTML = "<i>"+data.questionTitle.split(".")[0]+".</i><span>"+data.questionTitle.split(".")[1]+"</span>";
    }
    var content = document.createElement("div");
    content.className = "question-content";
    var textarea = document.createElement("textarea");
    content.appendChild(textarea);
    box.appendChild(title);
    box.appendChild(content);
    parent.insertBefore(box, obj);
}

var content = $("content");
FillIn(content);

var data;

// Get parameters from URL
var params = new URLSearchParams(window.location.search);
var sid = params.get('sid');
console.log(sid);



var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
            var mdata = JSON.parse(xhr.responseText);
            // Handle data returned from the backend
            data = mdata
            console.log("result",data)
            $("title").innerText = data.surveyTitle;
            $("time").innerText = data.time;
            var paper = $("paper-content");
            var nqb = $("result-btn");
            console.log(data.questions)
            // Load existing data
            data.questions.forEach(function (e) {
                if(e.questionType === "r"){
                    EditaddRadio(paper,nqb,false,e)
                }else if(e.questionType === "c"){
                    EditaddCheck(paper,nqb,false,e)
                }else if(e.questionType === "t"){
                    EditaddTextarea(paper,nqb,false,e)
                }
            });
        } else {
            console.error('Failed to fetch data');
        }
    }
};
xhr.open('GET', '/survey_results?sid=' + sid, true);
xhr.send();

var submit1 = document.getElementById("submit");
//Return
submit1.onclick = function () {
    window.location.href = "/";
};
