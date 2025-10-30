function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	const activityCounts = {};
	tweet_array.forEach(t => {
		if (t.source === 'completed_event') {
			const type = t.activityType;
			activityCounts[type] = (activityCounts[type] || 0) + 1; 
		}
	});

	const sortedActivities = Object.entries(activityCounts).sort((a, b) => b[1] - a[1]);

	console.log('Activity breakdown:', sortedActivities);

	document.getElementById('numberActivities').innerText = Object.keys(activityCounts).length;
	document.getElementById('firstMost').innerText = sortedActivities[0][0];
	document.getElementById('secondMost').innerText = sortedActivities[1][0];
	document.getElementById('thirdMost').innerText = sortedActivities[2][0];

	const topActivities = sortedActivities.slice(0, 3).map(([type]) => type);

	const activityDistanceData = [];
	tweet_array.forEach(t => {
	if (t.source === 'completed_event' && topActivities.includes(t.activityType)) {
		activityDistanceData.push({
		activity: t.activityType,
		distance: t.distance,
		day: new Date(t.time).toLocaleDateString(undefined, {weekday: 'long'})
		});
	}
	});
	console.log('Activity distance data:', activityDistanceData);

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": sortedActivities.map(([type, count]) => ({activity: type, count}))
	  },
	  //TODO: Add mark and encoding
	  "mark": "bar",
	  "encoding": {
		"x": {"field": "activity", "type": "nominal", "title": "Activity Type"},
   		"y": {"field": "count", "type": "quantitative", "title": "Number of Tweets"}
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.

	const distance_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "Distances by day of week for top 3 activities.",
		"data": {"values": activityDistanceData},
		"mark": "point",
		"encoding": {
			"x": {"field": "day", "type": "nominal", "title": "Day of Week",  "sort": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]},
			"y": {"field": "distance", "type": "quantitative", "title": "Distance (mi)"},
			"color": {"field": "activity", "type": "nominal", "title": "Activity Type"}
		}
		};
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});
	document.getElementById('distanceVisAggregated').style.display = 'none';

	const distance_vis_aggregated_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "Mean distances by day of week for top 3 activities.",
		"data": {"values": activityDistanceData},
		"mark": "point",
		"encoding": {
			"x": {"field": "day", "type": "nominal", "title": "Day of Week", "sort": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]},
			"y": {"aggregate": "mean", "field": "distance", "type": "quantitative", "title": "Mean Distance (mi)"},
			"color": {"field": "activity", "type": "nominal", "title": "Activity Type"}
		}
		};

	const aggregateBtn = document.getElementById('aggregate');
	aggregateBtn.addEventListener('click', function() {
	const aggregatedDiv = document.getElementById('distanceVisAggregated');
	if (aggregatedDiv.style.display === 'none' || aggregatedDiv.style.display === '') {
		vegaEmbed('#distanceVisAggregated', distance_vis_aggregated_spec, {actions:false});
		document.getElementById('distanceVis').style.display = 'none';
		aggregatedDiv.style.display = 'block';
		aggregateBtn.innerText = 'Show all activities';
	} else {
		document.getElementById('distanceVis').style.display = 'block';
		aggregatedDiv.style.display = 'none';
		aggregateBtn.innerText = 'Show means';
	}
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});