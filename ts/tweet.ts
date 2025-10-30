class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        const txt = this.text.toLowerCase();

        if (txt.startsWith("just completed") || txt.includes("finished") || txt.includes("completed")) {
            return "completed_event";
        }

        if (txt.includes("currently") || txt.includes("live")) {
            return "live_event";
        }

        if (txt.startsWith("achieved") || txt.includes("goal") || txt.includes("set a new record")) {
            return "achievement";
        }

        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        if (this.source !== 'completed_event') return false;

        let cleaned = this.text
        .replace(/#RunKeeper/gi, '')
        .replace(/https?:\/\/\S+/gi,'')
        .replace(/@runkeeper/gi,'')
        .trim();

        console.log('CLEANED:', cleaned);

        const defaultPhrases = [
            "Just completed",
            "Just posted",
            "Just finished",
            "Just ran",
            "Just cycled",
            "Just walked"
        ];

        if(cleaned.toLowerCase().includes('check it out!')) return false;

        return cleaned.length > 0;

    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        return "";
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}