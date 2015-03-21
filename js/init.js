(function($) {


    var manifest = [];
    var carousel = null;
    var scheduleUrl = 'http://localhost:8888/midcamp2015/docroot/screens/next';
    var sponsorsUrl = 'http://localhost:8888/midcamp2015/docroot/screens/sponsors';

    var init = function () {
        carousel = $("#carousel").carousel({interval: false});
        carousel.on("slid.on.carousel", function () {
            next();
        });
        getManifest();
    }

    var getManifest = function() {
        $.getJSON("manifest.json", function(data) {
            $.each(data, function() {
                processManifest(this);
            });
        });
    }

    var processManifest = function(item) {
        if (item.active != 1) {
            return;
        }
        switch (item.type) {
            case 'html':
                addHtml(item);
                break;
            case 'schedule':
                addSchedule(item);
                break;
            case 'sponsors':
                addSponsors(item);
                break;
        }
    };

    var addHtml = function (item) {
        $.ajax({
            dataType: "html",
            url: "screens/" + item.id + ".html",
            success: function(data) {
                addSlide(data, item);
            }
        });
    }

    var addSchedule = function (item) {
        $.ajax({
            dataType: "json",
            url: scheduleUrl,
            success: function (data) {
                if (typeof(data.content) == 'undefined') {
                    return;
                }
                content = data.content;
                content = "<h1 class=\"center big\">" + data.title + "</h1>" + content;
                content = "<div class='item schedule'>" + content + "</div>";
                addSlide(content, item);
            }
        });
    }

    var addSponsors = function (item) {
        $.ajax({
            dataType: "json",
            url: sponsorsUrl,
            success: function (data) {
                addSlide(goldSponsors(data), item);
                addSlide(silverSponsors(data), item);
            }
        });
    }

    var goldSponsors = function (data) {
        content = "<h1 class=\"center big\">Gold Sponsors</h1>";

        for (k in data.Gold) {
            //item = "<h3>" + data.Gold[k].title + "</h3>";
            item = '<img src="' + data.Gold[k].image + '">';
            content += '<div class="sponsor">' + item + '</div>';
        }

        content = '<div class="item sponsors sponsors-gold">' + content + '</div>';
        return content;
    };

    var silverSponsors = function (data) {
        content = "<h1 class=\"center big\">Silver Sponsors</h1>";
        for (k in data.Silver) {
            item = '<img src="' + data.Silver[k].image + '">';
            content += '<div class="sponsor">' + item + '</div>';
        }

        content = '<div class="item sponsors sponsors-silver">' + content + '</div>';
        return content;
    };

    var addSlide = function(data, item) {
        manifest.push(item);
        $(".carousel-inner", carousel).append(data);

        // Set active if there is no active slide.
        if ($(".item.active", carousel).length == 0) {
            $(".item", carousel).first().addClass("active");
            item = manifest.shift();
            setTimeout(function () {
                carousel.carousel("next");
            }, item.interval);
        }
    }

    var next = function () {
        $(".item", carousel).first().remove();
        item = manifest.shift();

        if (item.interval == 0) {
            return;
        }
        setTimeout(function () {
            carousel.carousel("next");
        }, item.interval);

        if (manifest.length == 0) {
            getManifest();
        }
    }

    $(document).ready(function() {
        init();
    });

}) (jQuery);
