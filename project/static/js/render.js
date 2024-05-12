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


function addRadio(parent, count, obj, amend) {
    var box = document.createElement("div");
    box.className = "question";
    var title = document.createElement("div");
    title.className = "question-title";
    var content = document.createElement("div");
    content.className = "question-content";
    if (amend) {
        title.innerHTML = "<i>" + count + ".</i><span contenteditable='true' class='revise'> Here is the title</span>";
        for (var i = 0; i < 4; i++) {
            var name = "p" + count;
            var p = "<div><input type='radio' name = " + name + "><span contenteditable='true' class='revise'>Option</span></div>";
            content.innerHTML += p;
        }
    } else {
        title.innerHTML = "<i>" + count + ".</i><span> Here is the title</span>";
        for (var i = 0; i < 4; i++) {
            var name = "p" + count;
            var p = "<div><input type='radio' name = " + name + "><span>Option</span></div>";
            content.innerHTML += p;
        }
    }
    box.appendChild(title);
    box.appendChild(content);

    parent.insertBefore(box, obj);

}

function addCheck(parent, count, obj, amend) {
    var box = document.createElement("div");
    box.className = "question";
    var title = document.createElement("div");
    title.className = "question-title";
    var content = document.createElement("div");
    content.className = "question-content";
    if (amend) {
        title.innerHTML = "<i>" + count + ".</i><span contenteditable='true'class='revise'> Here is the title</span>";
        for (var i = 0; i < 4; i++) {
            var name = "p" + count;
            var p = "<div><input type='checkbox' name = " + name + "><span contenteditable='true' class='revise'>Option</span></div>";
            content.innerHTML += p;
        }
    } else {
        title.innerHTML = "<i>" + count + ".</i><span> Here is the title</span>";
        for (var i = 0; i < 4; i++) {
            var name = "p" + count;
            var p = "<div><input type='checkbox' name = " + name + "><span>Option</span></div>";
            content.innerHTML += p;
        }
    }
    box.appendChild(title);
    box.appendChild(content);
    parent.insertBefore(box, obj);
}

function addTextarea(parent, count, obj, amend) {
    var box = document.createElement("div");
    box.className = "question";
    var title = document.createElement("div");
    title.className = "question-title";
    if (amend) {
        title.innerHTML = "<i>" + count + ".</i><span contenteditable='true' class='revise'> Here is the title</span>";
    } else {
        title.innerHTML = "<i>" + count + ".</i><span> Here is the title</span>";
    }
    var content = document.createElement("div");
    content.className = "question-content";
    var textarea = document.createElement("textarea");
    content.appendChild(textarea);
    box.appendChild(title);
    box.appendChild(content);
    parent.insertBefore(box, obj);
}



//edit page

function EditaddRadio(parent, obj, amend, data) {
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
        title.innerHTML = "<i>" + data.questionTitle.split(".")[0] + ".</i><span contenteditable='true' class='revise'>" + data.questionTitle.split(".")[1] + "</span>";
        for (var i = 0; i < 4; i++) {
            var p = "<div><input type='radio' value='" + data.questionContent[i] + "'><span contenteditable='true' class='revise'>" + data.questionContent[i] + "</span></div>";
            content.innerHTML += p;
        }
    } else {
        title.innerHTML = "<i>" + data.questionTitle.split(".")[0] + ".</i><span>" + data.questionTitle.split(".")[1] + "</span>";
        for (var i = 0; i < 4; i++) {
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
        title.innerHTML = "<i>" + data.questionTitle.split(".")[0] + ".</i><span contenteditable='true' class='revise'>" + data.questionTitle.split(".")[1] + "</span>";
        for (var i = 0; i < 4; i++) {

            var p = "<div><input type='checkbox' value='" + data.questionContent[i] + "'><span contenteditable='true' class='revise'>" + data.questionContent[i] + "</span></div>";
            content.innerHTML += p;
        }
    } else {
        title.innerHTML = "<i>" + data.questionTitle.split(".")[0] + ".</i><span>" + data.questionTitle.split(".")[1] + "</span>";
        for (var i = 0; i < 4; i++) {

            var p = "<div><input type='checkbox' value='" + data.questionContent[i] + "'><span>" + data.questionContent[i] + "</span></div>";
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
        title.innerHTML = "<i>" + data.questionTitle.split(".")[0] + ".</i><span contenteditable='true' class='revise'>" + data.title.split(".")[1] + "</span>";
    } else {
        title.innerHTML = "<i>" + data.questionTitle.split(".")[0] + ".</i><span>" + data.questionTitle.split(".")[1] + "</span>";
    }
    var content = document.createElement("div");
    content.className = "question-content";
    var textarea = document.createElement("textarea");
    content.appendChild(textarea);
    box.appendChild(title);
    box.appendChild(content);
    parent.insertBefore(box, obj);
}
