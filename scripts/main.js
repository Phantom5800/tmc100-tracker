const maxKeyCounts = 99;

var currentKeyCounts = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0
};

var urlParams = {};

function getUrlParamCount() {
    return Object.keys(urlParams).length;
}

function getUrlVars() {
    if (getUrlParamCount() === 0) {
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            urlParams[key.toLowerCase()] = value;
        });
    }
    return urlParams;
}

function getUrlParam(parameter, defaultValue) {
    var urlParameter = defaultValue;
    if (parameter in urlParams) {
        urlParameter = urlParams[parameter];
    }
    return urlParameter;
}

function localStorageGetWithDefault(key, defaultValue) {
    const urlVal = getUrlParam(key, defaultValue);
    if (urlVal === defaultValue) {
        const value = localStorage.getItem(key);
        if (!value) {
            localStorage.setItem(key, defaultValue);
            return defaultValue;
        }
        return value;
    }
    return urlVal;
}

$(document).ready(function(){
    getUrlVars();

    // disable some basic functionality
    $('img').on('dragstart', function(){return false;});
    $('html').contextmenu(function(){return false;});
    $('img').contextmenu(function(){return false;});

    $('.optional-item').height(40);

    // set text display for the main items
    $('.main-tracker img').on('mouseenter', function() {
        $('.main-tracker h2').text($(this).attr('id'));
    });

    $('.main-tracker img').on('mouseleave', function() {
        $('.main-tracker h2').text("");
    });

    $('.horizontal-tracker img').on('mouseenter', function() {
        $('.horizontal-tracker h2').text($(this).attr('id'));
    });

    $('.horizontal-tracker img').on('mouseleave', function() {
        $('.horizontal-tracker h2').text("");
    });

    $("img[data-chapter-key]").on("mousedown", function(e) {
        var c = parseInt($(this).attr("data-chapter-key"));
        e.preventDefault();
        // left click
        if (e.which == 1) {
            if (currentKeyCounts[c] < maxKeyCounts) {
                ++currentKeyCounts[c];
            }
        }
        // middle click
        else if (e.which == 2) {
            if (currentKeyCounts[c] + 10 < maxKeyCounts) {
                currentKeyCounts[c] += 10;
            } else {
                currentKeyCounts[c] = maxKeyCounts;
            }
        }
        // right click
        else if (e.which == 3) {
            if (currentKeyCounts[c] > 0) {
                --currentKeyCounts[c];
            }    
        }
        $(`.chapter-${c}-key-count`).text(`${currentKeyCounts[c]}`);
    });

    $('p.counter').click(function() {
        var count = $(this).text();
        var total = parseInt(count.substring(count.indexOf('/') + 1));
        count = parseInt(count.substring(0, count.indexOf('/')));
        count = count + 1;
        if (count > total) count = total;
        $(this).text(`${count}/${total}`);
    });

    $('p.counter').contextmenu(function() {
        var count = $(this).text();
        var total = parseInt(count.substring(count.indexOf('/') + 1));
        count = parseInt(count.substring(0, count.indexOf('/')));
        count = count - 1;
        if (count < 0) count = 0;
        $(this).text(`${count}/${total}`);
    });

    // options menu
    $(document).click(function(e) {
        // if the option menu is open, and the click is outside the options menu, close it
        var container = $("#options-menu");
        if (container.hasClass("options-open") && !container.is(e.target) && container.has(e.target).length === 0) {
            $("#options-menu-toggle").click();
        }
    });

    $("#options-menu-toggle").click(function(e) {
        e.stopPropagation();
        $(this).toggleClass("options-open");
        $("#options-menu").toggleClass("options-open");
    });

    $("#background-color").on("input", function() {
        var color = $(this).val();
        $("body, html").css("background-color", color);
        localStorage.setItem("background-color", color);
    });

    $("#section-color").on("input", function() {
        var color = $(this).val();
        $(".section").css("background-color", color);
        localStorage.setItem("section-color", color);
    });

    // local storage settings
    var bg_color = localStorageGetWithDefault("background-color", "#a35700");
    $("body, html").css("background-color", bg_color);
    $("#background-color").val(bg_color);

    var section_color = localStorageGetWithDefault("section-color", "#7b4103");
    $(".section").css("background-color", section_color);
    $("#section-color").val(section_color);
});
