import {getIndexForKey} from "./Utils";

function logPaperListen (lastTsLogged, uiSrc, audioRef, isPlaying, currentItemKey, items) {
    let LISTEN_STAT_INTERVAL_SEC = 20;

    if (!isPlaying || audioRef.current == null) {
        return lastTsLogged;
    }

    let currentIndex = getIndexForKey(items, currentItemKey);
    if (currentIndex === -1) {
        return lastTsLogged;
    }

    if (audioRef.current.ended) {
        return logEndOfTrack(audioRef, items[currentIndex].paperId, uiSrc);
    }

    let currentTs = Math.floor(audioRef.current.currentTime);
    if (lastTsLogged !== -1 &&
        (currentTs > lastTsLogged) &&
        (currentTs < lastTsLogged + LISTEN_STAT_INTERVAL_SEC)
        ) {
        return lastTsLogged;
    }

    return fireListenLog(items[currentIndex].paperId, uiSrc, currentTs, Math.floor(audioRef.current.duration));
}

function logEndOfTrack (audioRef, paperId, uiSrc) {
    let total = Math.floor(audioRef.current.duration);

    return fireListenLog(paperId, uiSrc, total, total);
}

function fireListenLog (paperId, uiSrc, currentTsSec, totalDurationSec) {
    // Note; Setting this even before firing the request, so that any error in
    // that part doesn't lead to this being not updated. Otherwise this could
    // get triggered every second from progressTrackerFn!
    let lastTsLogged = currentTsSec;

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            paper: paperId,
            at: currentTsSec,
            of: totalDurationSec,
            src: uiSrc
            })
    };

    fetch('/api/stat', requestOptions);

    return lastTsLogged;
}

export {logPaperListen};