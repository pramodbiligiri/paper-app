function getDurationStr (items) {
    return secondsToDurationStr(getDurationSec(items));
}

function getDurationSec (items) {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
        total += items[i].duration;
    }
    return total;
}

function secondsToDurationStr (seconds) {
    return Math.floor(seconds/60) + ":" +
              (seconds % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
}

function secondsToDurationStrWithUnits (seconds) {
    return Math.floor(seconds/60) + "m:" +
              ((seconds % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })) + "s";
}

function isValidIndex (index, items) {
    return index >= 0 && index < items.length;
}

function getIndexForKey (items, itemKey) {

    for (let i = 0; i < items.length; i++) {
        if (itemKey === items[i].key) {
            return i;
        }
    }

    return -1;
}

const months = {
    1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "June", 7: "July",
    8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"
}

const daysInMonth = { // Leap year handled separately
    1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30,
    7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31
}

function isLeapYear (year) {
    if (year % 100 === 0) {
        return year % 400 === 0;
    }

    return year % 4 === 0;
}

function getGapBetweenDates (pubDateUtc, curDateLocal) {
    let [pubYear, pubMonth, pubDate] = [pubDateUtc.getFullYear(), pubDateUtc.getMonth(), pubDateUtc.getDate()];
    let [curYear, curMonth, curDate] = [curDateLocal.getFullYear(), curDateLocal.getMonth(), curDateLocal.getDate()];

    if (pubYear !== curYear) {
        // Return a gap big enough that Date String is shown
        return 4;
    }

    if (pubMonth === curMonth) {
        if (pubDate >= curDate) { // pubDate can be ahead if your timezone is behind UTC
            return 0;
        }

        return curDate - pubDate;
    }

    // Month roll over.
    // Assuming that curMonth and pubMonth are both in the same year (and not (Dec,Jan))
    // because earlier in this function there is a check for same year.
    if (curMonth === pubMonth + 1) {
        // March of Leap Year
        if (isLeapYear(curYear) && curMonth === 2) {
            return curDate + (29 - pubDate);
        }

        return curDate + (daysInMonth[pubMonth + 1] - pubDate);
    }

    // pubMonth can be ahead of curMonth if your timezone is behind UTC and it's end of month
    // Assuming that curMonth and pubMonth are both in the same year (and not (Dec,Jan))
    // because earlier in this function there is a check for same year.
    if (pubMonth === curMonth + 1) {
        return 0;
    }

    // Return a gap big enough that Date String is shown
    return 4;
}

function getDisplayStrFromEpochSec (epochSecs) {

    let pub = new Date(0);
    pub.setUTCSeconds(epochSecs);

    let cur = new Date();

    let gap = getGapBetweenDates(pub, cur);

    if (gap === 0) {
        return "Today";
    }

    if (gap === 1) {
        return "Yesterday";
    }

    if (gap <= 3) {
        return gap + " days ago";
    }

    return months[pub.getMonth() + 1] + " " + pub.getDate() +
      (cur.getFullYear() === pub.getFullYear() ? "" : ", " + pub.getFullYear());

}

export {getDurationStr, getDurationSec, secondsToDurationStr,
        secondsToDurationStrWithUnits, isValidIndex, getIndexForKey, getDisplayStrFromEpochSec};