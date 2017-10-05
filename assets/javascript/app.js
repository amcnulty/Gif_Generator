if (window.attachEvent) {window.attachEvent('onload', load);}
else if (window.addEventListener) {window.addEventListener('load', load, false);}
else {document.addEventListener('load', load, false);}
function load() {
    var generator = {
        topics: ["Basketball", "Tennis", "Horse Racing", "Fencing", "Hockey", "Soccer", "Bicycle Racing", "Swimming", "NASCAR"],
        $buttonSection: $("#buttonSection"),
        $addSportInput: $("#topicInput"),
        $addSportButton: $("#topicButton"),
        $gifSection: $("#gifSection"),
        createTopicsButtons: function() {
            generator.clearTopicsButtons();
            for (var i = 0; i < generator.topics.length; i++) {
                generator.createButton(generator.topics[i]);
            }
        },
        clearTopicsButtons: function() {
            generator.$buttonSection.empty();
        },
        createButton: function(topic) {
            var $newButton = $("<button>");
            $newButton.attr("class", "topicButton");
            $newButton.text(topic);
            generator.$buttonSection.append($newButton);
        },
        addTopic: function(topic) {
            generator.topics.push(topic);
        },
        requestGifs: function(topic) {
            var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + topic + "&api_key=fOviTj7Gk4umzgqDN2LQyW51gu02PC28&limit=10";
            $.ajax({
                url: queryURL,
                method: "GET"
            }).done(function(res) {
                generator.clearGifDisplay();
                generator.displayGifs(res);
            });
        },
        displayGifs: function(gifs) {
            for (var i = 0; i < gifs.data.length; i++) {
                var $gifDiv = $("<div>");
                $gifDiv.attr("class", "gifWrapper");
                var $gifImg = $("<img>");
                $gifImg.attr("class", "gifImage");
                $gifImg.attr("src", gifs.data[i].images.fixed_height_still.url);
                $gifImg.attr("data-still-URL", gifs.data[i].images.fixed_height_still.url);
                $gifImg.attr("data-animated-URL", gifs.data[i].images.fixed_height.url);
                $gifImg.attr("data-status", "still");
                $gifDiv.append($gifImg);
                var $ratingCaption = $("<p>");
                $ratingCaption.attr("class", "ratingCaption");
                $ratingCaption.text("Rating: " + gifs.data[i].rating);
                $gifDiv.append($ratingCaption);
                generator.$gifSection.append($gifDiv);
            }
        },
        clearGifDisplay: function() {
            generator.$gifSection.empty();
        },
        toggleGifAnimation: function(gif) {
            if (gif.attr("data-status") === "still") {
                gif.attr("src", gif.attr("data-animated-URL"));
                gif.attr("data-status", "animated");
            }
            else if (gif.attr("data-status") === "animated") {
                gif.attr("src", gif.attr("data-still-URL"));
                gif.attr("data-status", "still");
            }
        }
    }
    generator.createTopicsButtons();
    $(document).on("click", ".topicButton", function(e) {
        generator.requestGifs(e.currentTarget.innerHTML);
    });
    generator.$addSportButton.on("click", function(e) {
        e.preventDefault();
        // generator.createButton(generator.$addSportInput.val());
        generator.addTopic(generator.$addSportInput.val());
        generator.createTopicsButtons();
    });
    $(document).on("click", ".gifImage", function() {
        generator.toggleGifAnimation($(this));
    })
}