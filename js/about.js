function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	

	const setTextByClass = (className, text) => {
		Array.from(document.getElementsByClassName(className)).forEach(element => {
			element.innerText = text;
		});
	};

	if (tweet_array.length > 0) {
		const dates = tweet_array.map(t => new Date(t.time));
		const earliestDate = new Date(Math.min(...dates));
		const latestDate = new Date(Math.max(...dates));
		const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
		
		document.getElementById('firstDate').innerText = earliestDate.toLocaleDateString(undefined, options);
		document.getElementById('lastDate').innerText = latestDate.toLocaleDateString(undefined, options);
	}
		const completedCount = tweet_array.filter(t => t.source === 'completed_event').length;
		const liveCount = tweet_array.filter(t => t.source === 'live_event').length;
		const achievementCount = tweet_array.filter(t => t.source === 'achievement').length;
		const miscCount = tweet_array.filter(t => t.source === 'miscellaneous').length;

		const completedPercent = math.format((completedCount / tweet_array.length) * 100, {notation: 'fixed', precision: 2});
		const livePercent = math.format((liveCount / tweet_array.length) * 100, {notation: 'fixed', precision: 2});
		const achievementPercent = math.format((achievementCount / tweet_array.length) * 100, {notation: 'fixed', precision: 2});
		const miscPercent = math.format((miscCount / tweet_array.length) * 100, {notation: 'fixed', precision: 2});

		console.log('Completed:', completedCount);
		console.log('Live:', liveCount);
		console.log('Achievement:', achievementCount);
		console.log('Miscellaneous:', miscCount)

		setTextByClass('completedEvents', String(completedCount));
		setTextByClass('completedEventsPct', `${completedPercent}%`);
		setTextByClass('liveEvents', String(liveCount));
		setTextByClass('liveEventsPct', `${livePercent}%`);
		setTextByClass('achievements', String(achievementCount));
		setTextByClass('achievementsPct', `${achievementPercent}%`);
		setTextByClass('miscellaneous', String(miscCount));
		setTextByClass('miscellaneousPct', `${miscPercent}%`);

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});