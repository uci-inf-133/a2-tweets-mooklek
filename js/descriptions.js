let tweet_array = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	//TODO: Filter to just the written tweets
	tweet_array = runkeeper_tweets.map(tweet => new Tweet(tweet.text, tweet.created_at));
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
    // Get references to DOM elements for search box, table body, and result spans
    const searchBox = document.getElementById('textFilter');
    const tableBody = document.getElementById('tweetTable'); 
    const searchCountSpan = document.getElementById('searchCount');
    const searchTextSpan = document.getElementById('searchText');

    // Add event listener to search box to update table and spans on every input
    searchBox.addEventListener('input', function() {
        // Get current search text and convert to lowercase for case-insensitive matching
        const searchText = searchBox.value.trim().toLowerCase();

        // Filter tweets to only user-written tweets containing the search text
        const filteredTweets = tweet_array.filter(t =>
            t.written && t.text.toLowerCase().includes(searchText)
        );

        // Clear the table before repopulating
        tableBody.innerHTML = '';
        // Add a row for each matching tweet
        filteredTweets.forEach((tweet, idx) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${idx + 1}</td>
                <td>${tweet.activityType}</td>
                <td><a href="${extractLink(tweet.text)}" target="_blank">Link</a></td>
                <td>${tweet.text}</td>
            `;
            tableBody.appendChild(row);
        });

        // Update the result spans with count and search text
        searchCountSpan.innerText = filteredTweets.length;
        searchTextSpan.innerText = searchText;

        // If search box is empty, clear table and reset spans
        if (searchText === '') {
            tableBody.innerHTML = '';
            searchCountSpan.innerText = '0';
            searchTextSpan.innerText = '';
        }
    });

    // Helper function to extract the first link from tweet text
    function extractLink(text) {
        const match = text.match(/https?:\/\/\S+/);
        return match ? match[0] : '#';
    }
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});