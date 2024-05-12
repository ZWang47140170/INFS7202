var content = $("content");
FillIn(content);

// Add question
var newQuestion = $("new-question");
var paper = $("paper-content");
var nqb = $("new-question-btn");
var types = document.getElementsByClassName("qt");
var type = null,
    count = 1;

// Set question type
[].forEach.call(types,function (e,index) {
    switch (index){
        case 0:
            e.addEventListener("click",function () {
                type = 0;
            });
            break;
        case 1:
            e.addEventListener("click",function () {
                type = 1;
            });
            break;
        case 2:
            e.addEventListener("click",function () {
                type = 2;
            });
            break;
    }
});
// Add new type
newQuestion.addEventListener("click",function () {
    switch (type){
        case 0:
            addRadio(paper,count,nqb,true);
            count++;
            break;
        case 1:
            addCheck(paper,count,nqb,true);
            count++;
            break;
        case 2:
            addTextarea(paper,count,nqb,true);
            count++;
            break;
    }
});

var save = $("save");
var data = {};

function saveData() {
    data.title = $("title").innerText;
    data.question = [];
    data.time = $("time").value;
    var question = document.getElementsByClassName("question");
    if(question.length>0){
        localStorage.has = 1;
        [].forEach.call(question,function (e) {
            var q = {};
            q.title = e.getElementsByClassName("question-title")[0].innerText;
            q.item = [];
            var input = e.getElementsByTagName("input")[0] || e.getElementsByTagName("textarea")[0];
            if(input.tagName == "INPUT"){
                if(input.type == "radio"){
                    q.type = "r";
                }else if(input.type == "checkbox"){
                    q.type = "c";
                }
                    // q.name = input.name;
            }else if(input.tagName == "TEXTAREA"){
                q.type = "t";
            }
            var items = e.getElementsByClassName("question-content")[0].getElementsByTagName("span");
            [].forEach.call(items,function (e) {
                q.item.push(e.innerText);
            });
            data.question.push(q);
        });
        var s = JSON.stringify(data);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/saveData', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    console.log('Data saved successfully!');
                } else {
                    console.error('Failed to save data:', xhr.statusText);
                }
            }
        };
        xhr.send(JSON.stringify(data));
    }
}

save.addEventListener("click",function () {
    if($("time").value == ""){
        alert("Please enter a date")
    }else {
        saveData();
        window.location.href = "/";
    }
});
