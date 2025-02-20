const TrackSwitcher = () => {

    const switchTrack = (audioRef, newUrl, isPlaying, paperPlayRefs, setIsPlayingPaperPlays) => {
        if (audioRef.current == null) {
            audioRef.current = new Audio(newUrl);
        } else {
            audioRef.current.pause();
            let speed = audioRef.current.playbackRate ? audioRef.current.playbackRate : 1;
            if (navigator.userAgent.indexOf("Firefox") !== -1) {
                audioRef.current = null;
                audioRef.current = new Audio(newUrl);
            } else {
                audioRef.current.src = null;
                audioRef.current.src = newUrl;
            }

            console.log("TrackSwitcher: Setting speed to: " + speed);
            audioRef.current.playbackRate = speed;
        }

        if (isPlaying) {
            pausePaperListPapers(paperPlayRefs, setIsPlayingPaperPlays);
            audioRef.current.play();
        }
    }

    const resumeTrack = (audioRef, paperPlayRefs, setIsPlayingPaperPlays) => {
        if (audioRef.current == null) {
            return;
        }

        pausePaperListPapers(paperPlayRefs, setIsPlayingPaperPlays);

        audioRef.current.play();
    }

    const clearTrack = (audioRef) => {
        if (audioRef.current == null) {
            return;
        }

        audioRef.current.pause();
        audioRef.current = null;
    }

    const pausePaperListPapers = (paperPlayRefs, setIsPlayingPaperPlays) => {
        for (let i = 0; i < paperPlayRefs.length; i++) {
            if (paperPlayRefs[i].current !== null) {
                paperPlayRefs[i].current.pause();
            }
        }

        setIsPlayingPaperPlays(arr => arr.map((elem, i) => false));
    }

    return [switchTrack, resumeTrack, clearTrack];

}

export {TrackSwitcher};