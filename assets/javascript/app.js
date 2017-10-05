if (window.attachEvent) {window.attachEvent('onload', load);}
else if (window.addEventListener) {window.addEventListener('load', load, false);}
else {document.addEventListener('load', load, false);}
function load() {
    /**
     * The generator object contains the fields and methods for the gif generating logic
     */
    var generator = {
        /** An array of topics specifically sports related. These topics are used to create buttons that later generate gifs. */
        topics: ["Basketball", "Tennis", "Horse Racing", "Fencing", "Hockey", "Soccer", "Bicycle Racing", "Swimming", "NASCAR"],
        /** The section in html where the buttons are located. */
        $buttonSection: $("#buttonSection"),
        /** The input field where users can add there own topic to be created into a button. */
        $addSportInput: $("#topicInput"),
        /** The submit button for the add topic form at the top of the page. */
        $addSportButton: $("#topicButton"),
        /** The section in html where the gifs are displayed to the user. */
        $gifSection: $("#gifSection"),
        /**
         * This method is called once on start up and once whenever the user clicks the add topic button. When called, this method clears the old topic buttons then creates a button for every topic in the [topics] array.
         */
        createTopicsButtons: function() {
            generator.clearTopicsButtons();
            for (var i = 0; i < generator.topics.length; i++) {
                generator.createButton(generator.topics[i]);
            }
        },
        /**
         * This method is used to clear the button section of all buttons.
         */
        clearTopicsButtons: function() {
            generator.$buttonSection.empty();
        },
        /**
         * This method is used to create a new button and display it to the user in the button section.
         * @param {String} topic
         * The name of the topic that will display in the button and will be the category of gif that will be created when pushed.
         */
        createButton: function(topic) {
            var $newButton = $("<button>");
            $newButton.attr("class", "topicButton");
            $newButton.text(topic);
            generator.$buttonSection.append($newButton);
        },
        /**
         * This method is used to add a new topic to the [topics] array.
         * @param {String} topic
         * The string value of the topic to be added to the [topics] array.
         */
        addTopic: function(topic) {
            generator.topics.push(topic);
        },
        /**
         * This method is used to make the ajax call to the Giphy API service. Once request is completed the response is sent off to display the gifs.
         * @param {String} topic
         * The search term or query to be searched in the Giphy API. 
         */
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
        /**
         * This method is used to display the gifs to the user. A new div is created to hold the image and rating caption. The image element is given attributes to hold the url for still and animated display.
         * @param {JSON} gifs
         * The JSON response object from the request to the Giphy API based on what button was pressed by the user.
         */
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
        /**
         * This method is used to clear the gif section of all gifs that are being displayed.
         */
        clearGifDisplay: function() {
            generator.$gifSection.empty();
        },
        /**
         * This method is called when the gif image is clicked on to toggle the state of the gif between animated and still.
         * @param {HTMLImageElement} gif
         * The image that was clicked on by the user to be toggled between animated and still.
         */
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
    /** Method call to create the stock buttons in the [topics] array. */
    generator.createTopicsButtons();
    /** Click event listener on the document for any elements with the class "topicButton". This listener will work for elements that have been added dynamically after the dom initially loads. */
    $(document).on("click", ".topicButton", function(e) {
        generator.requestGifs(e.currentTarget.innerHTML);
    });
    /** Click event listener on the submit button in the add topic form at the top of the page. */
    generator.$addSportButton.on("click", function(e) {
        e.preventDefault();
        generator.addTopic(generator.$addSportInput.val());
        generator.createTopicsButtons();
    });
    /** Click event listener on the document for any elements with the class "gifImage". This listener will work for elements that have been added dynamically after the dom initially loads. */
    $(document).on("click", ".gifImage", function() {
        generator.toggleGifAnimation($(this));
    })
}