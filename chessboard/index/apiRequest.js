
// api request to the server
async function apiRequest(requestFor, apiInput = "") {
    var hosting = "https://chess-pu59.onrender.com:10000/"
    var apiHit = {
    }
    switch (requestFor) {
        case 'setTheme':
            apiHit.url = `${hosting}460cdea15f7e2d7cf366d75da91d8e24475ce5c8921303f808b2eb68064f2f4a`;
            apiHit.data = JSON.stringify(apiInput);
            apiHit.method = 'POST';
            break;
        case 'setcode':
            apiHit.url = `${hosting}c6a1245e144765e5894c139b433020e5b200b3185a493978d05c2c74a7116b7b`;
            apiHit.data = JSON.stringify(apiInput);
            apiHit.method = 'POST';
            break;
        case 'fetchTheme':
            apiHit.url = `${hosting}209d605ee355854c2765e7caa274af6c23c29b9f3226145fb8ca8628bbde24b5`;
            apiHit.data = JSON.stringify(apiInput);
            apiHit.method = 'POST';
            break;
        case 'getApprove':
            apiHit.url = `${hosting}f931f09cc70252db573bd399ca768cb913173b3c9112003085f757200673eb3a`;
            apiHit.data = JSON.stringify(apiInput);
            apiHit.method = 'POST';
            break;
        case 'move':
            apiHit.url = `${hosting}683a62ce15fbabb1ac867022e56e6e4f4f581762d77c3abb2f8dc8b165b3b1b9`;
            apiHit.data = JSON.stringify(apiInput);
            apiHit.method = 'POST';
            break;
    }

    console.log(apiHit);
    let result;
    try {
        result = await $.ajax({
            contentType: "application/json",
            dataType: 'json',
            url: apiHit.url,
            type: apiHit.method,
            data: apiHit.data,
        });
        console.log(result);
        // loader('inactive')
        return result;
    } catch (error) {
        console.error(error);
        loader('active')
        myAlert('Something went wrong :(',3000);
    }
}

function loader(type) {
    if (type == 'active') {
        $('.loader').css({ 'display': 'block' });
    } else if (type == 'inactive') {
        $('.loader').css({ 'display': 'none' });
    }
}
var preAlert = 0;
function myAlert(val, time=1000, inbetweenTime = 2000) {
    if (preAlert <= (Date.now() - inbetweenTime)) {
        $('.alert').css({ 'visibility': 'visible', 'transform': 'translateY(-10vh)' }).html(val);
        setTimeout(() => {
            $('.alert').css({ 'visibility': 'hidden', 'transform': 'translateY(+10vh)' }).html(val);
        }, time)
    }
    preAlert = Date.now();
}
