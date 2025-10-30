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
    const searchBox = document.getElementById('textFilter');
    const tableBody = document.getElementById('tweetTable'); 
    const searchCountSpan = document.getElementById('searchCount');
    const searchTextSpan = document.getElementById('searchText');

    searchBox.addEventListener('input', function() {
        const searchText = searchBox.value.trim().toLowerCase();

        const filteredTweets = tweet_array.filter(t =>
            t.written && t.text.toLowerCase().includes(searchText)
        );

        tableBody.innerHTML = '';
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

        searchCountSpan.innerText = filteredTweets.length;
        searchTextSpan.innerText = searchText;

        if (searchText === '') {
            tableBody.innerHTML = '';
            searchCountSpan.innerText = '0';
            searchTextSpan.innerText = '';
        }
    });

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