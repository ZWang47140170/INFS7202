var content = $("content");
FillIn(content);

var data;

// Get parameters from the URL
var params = new URLSearchParams(window.location.search);
var sid = params.get('sid');
console.log(sid);

var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
            var mdata = JSON.parse(xhr.responseText);
            // Handle data returned from the backend
            data = mdata;
            console.log(data);
            console.log(data.title);
            $("title").innerText = data.title;
            $("time").innerText = data.time;
            var paper = $("paper-content");
            var nqb = $("new-question-btn");
            // Load existing data
            data.questions.forEach(function (e) {
                if (e.questionType === "r") {
                    EditaddRadio(paper, nqb, false, e);
                } else if (e.questionType === "c") {
                    EditaddCheck(paper, nqb, false, e);
                } else if (e.questionType === "t") {
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

var submit1 = document.getElementById("submit1");
var submit2 = document.getElementById("submit2");

// Return
submit1.onclick = function () {
    window.location.href = "/";
};

// Generate QR code
submit2.onclick = function () {
    // Send a request to the backend to generate the QR code
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // If the request is successful, handle the returned data (if any)
                var response = JSON.parse(xhr.responseText);
                if (response.qr_code) {
                    // Display the generated QR code on the page
                    var qrImage = document.createElement('img');
                    qrImage.src = response.qr_code;
                    qrImage.classList.add('qr-code'); // Add class name
                    console.log(response.qr_code);
                    document.body.appendChild(qrImage);
                } else {
                    console.error('Failed to generate QR code');
                }
            } else {
                // If the request fails, output the error message
                console.error('Failed to generate QR code');
            }
        }
    };
    // Send a GET request to the /qr endpoint on the backend and pass the sid
    xhr.open('GET', '/qr?sid=' + sid, true);
    xhr.send();
};
