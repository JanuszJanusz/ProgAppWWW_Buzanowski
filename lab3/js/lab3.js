const btn1 = document.querySelector("#animButton1");
const btn2 = document.querySelector("#animButton2");
const btn3 = document.querySelector("#animButton3");
const stat = document.querySelector("#status");
const resetBtn = document.querySelector("#animResetAC");
const motionPref = window.matchMedia('(prefers-reduced-motion: reduce)');

if(motionPref.matches) {
    $.fx.off = true;
}

let stan = false;
$("#animButton1").on("click", function(){
    $("#animButton1").stop();
    if (stan == false) {
        stan = true;
        $("#animButton1").animate({
            height: "130",
            width: "240"
        }, 300, function() {
            btn1.setAttribute("aria-pressed", true);
        });
    } else if (stan == true) {
        stan = false;
        $("#animButton1").animate({
            height: "90",
            width: "160"
        }, 300, function() {
            btn1.setAttribute("aria-pressed", false);
        });
    }
});
let mouseover = false;
let focused = false;
    
    $("#animButton2").on("mouseenter", function() {
        $("#animButton2").animate({
            height: "120",
            width: "220"
        }, 300, function() {
            mouseover = true;
        });
    });

    
    $("#animButton2").on("mouseleave", function() {
        $("#animButton2").animate({
            height: "90",
            width: "160"
        }, 300, function() {
            mouseover = false;
        });
    });


$("#animButton2").on("focus", function() {
    $("#animButton2").animate({
        height: "120",
        width: "220"
    }, 300, function() {
        focused = true;
    });
});

$("#animButton2").on("blur", function() {
    $("#animButton2").animate({
        height: "90",
        width: "160"
    }, 300, function() {
        focused = false;
    });
});
let ileklik = 0;
stat.innerHTML = `${ileklik}`;

$("#animButton3").on("click", function() {
    if(btn3.offsetWidth < 260) {
        if ($("#animButton3").is(":animated") == false) {
            $("#animButton3").animate({
                width: "+=20",
                height: "+=10"
            }, 300, function() {
                ileklik++;
                stat.innerHTML = `${ileklik}`;
                btn3.setAttribute("aria-pressed", true);
            });
        }
    }
});

$("#animResetAC").on("click", function() {
    $("#animButton1").stop();
    $("#animButton3").stop();
    btn1.setAttribute("aria-pressed", false);
    btn3.setAttribute("aria-pressed", false);
    $("#animButton1").css("height", 90);
    $("#animButton3").css("height", 90);
    $("#animButton1").css("width", 160);
    $("#animButton3 ").css("width", 160);
    ileklik = 0;
    stat.innerHTML = `${ileklik}`;
});

$("#srvTest").on("click", function() {
    if($("#srvTest").prop('disabled')) {
        return;
    }
    $("#srvTest").prop('disabled', true).text('Sprawdzam...');

    $.ajax({
        url: "status.php",
        method: "GET",
        dataType: "text",
        timeout: 5000
    }).done(function(response) {
        $("#srvResponse").text(response);
    }).fail(function(xhr, status) {
        let msg;

        if (status === "timeout") {
            msg = "Przekroczono limit czasu połączenia";
        } else if (status === "error") {
            msg = `Błąd serwera ${xhr.status} ${xhr.statusText}`;
        } else if (status === "parseerror") {
            msg = "Błąd parsowania";
        } else {
            msg = `Nie udało się połączyć z serwerem (${status}).`;
        }
        $("#srvResponse").text(msg);
    }).always(function() {
        $("#srvTest").prop('disabled', false).text("Sprawdź serwer");
    })

});