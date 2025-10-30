function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	// Count the number of completed events for each activity type
	const activityCounts = {};
	tweet_array.forEach(t => {
		if (t.source === 'completed_event') {
			const type = t.activityType;
			activityCounts[type] = (activityCounts[type] || 0) + 1; 
		}
	});

	// Sort activities by count, descending
	const sortedActivities = Object.entries(activityCounts).sort((a, b) => b[1] - a[1]);

	// Log activity breakdown for debugging
	console.log('Activity breakdown:', sortedActivities);

	// Update DOM with number of activities and top three most-tweeted activities
	document.getElementById('numberActivities').innerText = Object.keys(activityCounts).length;
	document.getElementById('firstMost').innerText = sortedActivities[0][0];
	document.getElementById('secondMost').innerText = sortedActivities[1][0];
	document.getElementById('thirdMost').innerText = sortedActivities[2][0];

	// Get the top three activity types
	const topActivities = sortedActivities.slice(0, 3).map(([type]) => type);

	// Build array of activity, distance, and day for top activities
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
	// Log distance data for debugging
	console.log('Activity distance data:', activityDistanceData);

	// Vega-Lite spec for bar chart of activity counts
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
		"values": sortedActivities.map(([type, count]) => ({activity: type, count}))
	  },
	  "mark": "bar",
	  "encoding": {
		"x": {"field": "activity", "type": "nominal", "title": "Activity Type"},
		"y": {"field": "count", "type": "quantitative", "title": "Number of Tweets"}
	  }
	};
	// Render activity bar chart
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	// Vega-Lite spec for dot plot of distances by day for top activities
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
	// Render dot plot of distances
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});
	document.getElementById('distanceVisAggregated').style.display = 'none';

	// Vega-Lite spec for mean distances by day for top activities
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

	// Toggle between raw and mean distance visualizations
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