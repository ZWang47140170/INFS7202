var content = $("content");
FillIn(content);

var data;

// Get parameters from the URL
var params = new URLSearchParams(window.location.search);
var sid = params.get('sid');
console.log(sid); // Test by printing sid in the console

var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
            var mdata = JSON.parse(xhr.responseText);
            // Process data returned from the backend
            data = mdata;
            console.log(data);
            console.log(data.title);
            $("title").innerText = data.title;
            $("time").innerText = data.time;
            var paper = $("paper-content");
            var nqb = $("new-question-btn");
            // Load existing data
            data.questions.forEach(function (e) {
                if(e.questionType === "r") {
                    EditaddRadio(paper, nqb, false, e);
                } else if(e.questionType === "c") {
                    EditaddCheck(paper, nqb, false, e);
                } else if(e.questionType === "t") {
                    EditaddTextarea(paper, nqb, false, e);
                }
            });
        } else {
            console.error('Failed to fetch data');
        }
    }
};
xhr.open('GET', '/get_data?sid=' + sid, true);
xhr.send();


var submit = document.getElementById("submit");

// Return
submit.onclick = function () {
    // Create an empty object to store answer data
    var answers = [];
    // Traverse all questions and collect user-entered answer data
    var questions = document.getElementsByClassName("question");
    for (var i = 0; i < questions.length; i++) {
        sid = questions[i].dataset.sid;
        qid = questions[i].dataset.qid;
        type = questions[i].dataset.type;
        ans = []
        if (type === 'r' || type === 'c') {
            var inputs = questions[i].querySelectorAll("input[type=radio], input[type=checkbox]");
            console.log("input", inputs)
            for (var j = 0; j < inputs.length; j++) {
                if (inputs[j].checked) {
                    // If the option is selected, store its value in the answer data
                    var value = inputs[j].value;
                    console.log(value)
                    ans.push(value);
                }
            }
        } else {
            var textarea = questions[i].querySelector("textarea");
            if (textarea) {
                // Get the value of the text area and store it in the answer data
                var value = textarea.value;
                ans.push(value);
            }
        }
        // Create an object containing sid, qid, and ans, and push it into the answers array
        var data = {
            sid: sid,
            qid: qid,
            ans: ans
        };
        answers.push(data);
    }
    console.log("answers",answers)
    // Convert answer data to JSON string
    var jsonData = JSON.stringify(answers);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Successfully saved
                alert("Saved successfully!");
            } else {
                // Failed to save
                alert("Failed to save!");
            }
        }
    };
    xhr.open('POST', '/save_answers', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(jsonData);
};

var submit1 = document.getElementById("submit3");
// Return
submit1.onclick = function () {
    window.location.href = "/";
};
