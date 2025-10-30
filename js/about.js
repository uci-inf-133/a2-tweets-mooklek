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

	// if tweet exists then format, find earliest and latest tweet date
	if (tweet_array.length > 0) {
		const dates = tweet_array.map(t => new Date(t.time));
		const earliestDate = new Date(Math.min(...dates));
		const latestDate = new Date(Math.max(...dates));
		const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
		
		// edit dom to correctly display earliest and latest tweet.
		document.getElementById('firstDate').innerText = earliestDate.toLocaleDateString(undefined, options);
		document.getElementById('lastDate').innerText = latestDate.toLocaleDateString(undefined, options);
	}	
		// calculating counts for each category
		const completedCount = tweet_array.filter(t => t.source === 'completed_event').length;
		const liveCount = tweet_array.filter(t => t.source === 'live_event').length;
		const achievementCount = tweet_array.filter(t => t.source === 'achievement').length;
		const miscCount = tweet_array.filter(t => t.source === 'miscellaneous').length;
		const writtenCount = tweet_array.filter(t => t.source === 'completed_event' && t.written).length;

		// calculating percentages for each category
		const completedPercent = math.format((completedCount / tweet_array.length) * 100, {notation: 'fixed', precision: 2});
		const livePercent = math.format((liveCount / tweet_array.length) * 100, {notation: 'fixed', precision: 2});
		const achievementPercent = math.format((achievementCount / tweet_array.length) * 100, {notation: 'fixed', precision: 2});
		const miscPercent = math.format((miscCount / tweet_array.length) * 100, {notation: 'fixed', precision: 2});
		const writtenPercent = completedCount === 0
		? '0.00'
		: math.format((writtenCount / completedCount) * 100, {notation: 'fixed', precision: 2});	

		// logs in console to see if counts are correct
		console.log('Completed:', completedCount);
		console.log('Live:', liveCount);
		console.log('Achievement:', achievementCount);
		console.log('Miscellaneous:', miscCount)


		// edits the DOM to correctly display information on tweet counts and percentages
		setTextByClass('completedEvents', String(completedCount));
		setTextByClass('completedEventsPct', `${completedPercent}%`);
		setTextByClass('liveEvents', String(liveCount));
		setTextByClass('liveEventsPct', `${livePercent}%`);
		setTextByClass('achievements', String(achievementCount));
		setTextByClass('achievementsPct', `${achievementPercent}%`);
		setTextByClass('miscellaneous', String(miscCount));
		setTextByClass('miscellaneousPct', `${miscPercent}%`);
		setTextByClass('written', String(writtenCount));
		setTextByClass('writtenPct', `${writtenPercent}%`);

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});