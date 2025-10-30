class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);
	}

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

    get written():boolean {
        //TODO: identify whether the tweet is written
        if (this.source !== 'completed_event') {
            return false
        }

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

        if(cleaned.toLowerCase().includes('check it out!')) {
            return false;
        }

        return cleaned.length > 0;

    }

    get writtenText():string {
        if (!this.written) {
            return "";
        }
        let cleaned = this.text
            .replace(/#RunKeeper/gi, '')
            .replace(/https?:\/\/\S+/gi, '')
            .replace(/@runkeeper/gi, '')
            .trim();
        const defaultPhrases = [
            "Just completed",
            "Just posted",
            "Just finished",
            "Just ran",
            "Just cycled",
            "Just walked"
        ];
        for (let phrase of defaultPhrases) {
            cleaned = cleaned.replace(new RegExp(phrase, 'gi'), '').trim();
        }
        cleaned = cleaned.replace(/check it out!/gi, '').trim();
        return cleaned;
    }

    get activityType():string {
        if (this.source !== 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        let cleaned = this.text 
            .replace(/#RunKeeper/gi, '')
            .replace(/https?:\/\/\S+/gi, '')
            .replace(/@runkeeper/gi, '')
            .trim()
        
        const activities = ["run", "walk", 
            "bike", "cycling", "swim", "hike", 
            "yoga", "workout", "elliptical", "ski", 
            "snowboard", "row", "kayak"];

        for (let activity of activities) {
            if (cleaned.toLowerCase().includes(activity)) {
                return activity;
            }
        }

        return "other";
    }

    get distance():number {
        if(this.source !== 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        
        let cleaned = this.text
            .replace(/#RunKeeper/gi, '')
            .replace(/https?:\/\/\S+/gi, '')
            .replace(/@runkeeper/gi, '')
            .trim()

         const match = cleaned.match(/([0-9]+(\.[0-9]+)?)\s*(mi|km)/);
         if (match) {
            let value = parseFloat(match[1]);
            let unit = match[3];
            if (unit === 'km') {
                return value / 1.609;
            }
            return value;
         }
         return 0;
    }

    getHTMLTableRow(rowNumber: number): string {
        const linkMatch = this.text.match(/https?:\/\/\S+/);
        const link = linkMatch ? linkMatch[0] : "#";
        const safeText = this.text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return `<tr>
            <td>${rowNumber}</td>
            <td>${this.activityType}</td>
            <td>${link !== "#" ? `<a href="${link}" target="_blank">Link</a>` : ""}</td>
            <td>${safeText}</td>
        </tr>`;
    }
}