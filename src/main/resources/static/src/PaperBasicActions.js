import {PaperPreview} from "./PaperPreview";
import {PaperPlay} from "./PaperPlay";
import {PaperListMoreInfo} from "./PaperDisplayHelpers";
import {Link} from '@material-ui/core';
//import {Link} from "react-router-dom";

const PaperBasicActions = (props) => {

    const {items, isPlaying, setIsPlaying, index, actionLink, isPlayingPaperPlays, setIsPlayingPaperPlays,
        paperPlayRefs, previewRefs, inPopup,
        hidePreviews, previewPopupRefs, setHidePreviews} = props;

    let paper = items[index];

    const startPaperPlay = (event, index) => {
        console.log("startPaperPlay: isPlaying: " + isPlayingPaperPlays[index]);

        if (isPlayingPaperPlays[index]) {
            return;
        }

        if (paperPlayRefs[index].current === null) {
            let url = items[index].url;

            paperPlayRefs[index].current = new Audio();
            paperPlayRefs[index].current.preload = "none";
            paperPlayRefs[index].current.src = url;
            paperPlayRefs[index].current.load();

//            console.log("startPaperPlay: Set new audio url to: " + url);
        }

        pauseOtherPapers(index);

//        console.log("Playing: " + items[index].url);
        paperPlayRefs[index].current.play();
    }

    const pauseOtherPapers = (index) => {
        for (let i = 0; i < paperPlayRefs.length; i++) {
            if (i === index) {
                continue;
            }

            if (paperPlayRefs[i].current !== null) {
                paperPlayRefs[i].current.pause();
            }
        }

        if (isPlaying) {
            setIsPlaying(false);
        }
        setIsPlayingPaperPlays(arr => arr.map((elem, i) => i === index ? true : false));
    }

    const pausePaperPlay = (event, index) => {
        if (paperPlayRefs[index].current !== null) {
            paperPlayRefs[index].current.pause();
        }

        setIsPlayingPaperPlays(arr => arr.map((elem, i) => i === index ? false : elem));
    }

    const onTrackEnd = (event, index) => {
        setIsPlayingPaperPlays(arr => arr.map((elem, i) => i === index ? false : elem));
    }

    const showPreview = (event, index, toShow, fromPopup, msg) => {
        if (toShow) {
            inPopup.current = fromPopup;
            console.log("showPreview: msg: " + msg);
            setHidePreviews(arr => arr.map((elem, i) => i === index ? false : true));

            return;
        }

        // Hide abstract preview
        if (fromPopup) {
            console.log("showPreview: msg: " + msg);
            inPopup.current = false;

            setTimeout(() => {
                setHidePreviews(arr => arr.map((elem, i) => i === index ? true : elem));
            }, 500);

            return;
        }

        setTimeout(() => {
            console.log("showPreview: msg: " + msg + ", inPopup: " + inPopup.current);
            if (inPopup.current === false) {
                setHidePreviews(arr => arr.map((elem, i) => i === index ? true : elem));
            }
        }, 500);
    }

    return (
        <div className="actionLinks">
            <span className="paperActionWrap">{actionLink}</span>

            <PaperPlayWrap
                paper = {items[index]}
                items = {items}
                index = {index}
                isPlayingPaperPlays = {isPlayingPaperPlays}
                startPaperPlay = {startPaperPlay}
                pausePaperPlay = {pausePaperPlay}
                paperPlayRefs = {paperPlayRefs}
                onTrackEnd = {onTrackEnd}
            />

            <PaperListMoreInfo
                previewRef = {previewRefs[index]}
                index = {index}
                link = {paper.link}
                title = {paper.title}
                onMouseEnter = {(event) => showPreview(event, index, true, false, inPopup, setHidePreviews, "preview onMouseEnter")}
                onClick = {(event) => showPreview(event, index, true, false, inPopup, setHidePreviews, "preview onMouseClick")}
                onMouseLeave = {(event) => showPreview(event, index, false, false, inPopup, setHidePreviews, "preview onMouseLeave")}
            />

            <PaperPreview
                previewPopupRef = {previewPopupRefs[index]}
                onMouseEnter = {(event) => showPreview(event, index, true, true, inPopup, setHidePreviews, "popup onMouseEnter")}
                onMouseLeave = {(event) => showPreview(event, index, false, true, inPopup, setHidePreviews, "popup onMouseLeave")}
                title = {paper.title}
                link = {paper.link}
                pubDate = {paper.pubDate}
                authors = {paper.authors}
                abstract = {paper.abstract}
                categories = {paper.categories}
                isHidden = {hidePreviews[index]}
                closePopup = {(event) => showPreview(event, index, false, true, inPopup, setHidePreviews, "popup closeLink")}
            />
        </div>
    );

}

const PaperPlayWrap = (props) => {

    const {paper, items, index, isPlayingPaperPlays, startPaperPlay, pausePaperPlay,
        paperPlayRefs, onTrackEnd} = props;

    return (
        <span className="perPaperPlayer">
            <span className="paperActionListenWrap">
                {isPlayingPaperPlays[index] ?
                   <Link color="inherit" onClick={(event) => pausePaperPlay(event, index)}>
                     <img alt="Pause paper" className="paperPlayBtnImg" src="pause-1.png"/>
                   </Link>
                   :
                   <Link color="inherit" onClick={(event) => startPaperPlay(event, index)}>
                     <img alt="Play paper" className="paperPlayBtnImg" src="play-6.png"/>
                   </Link>
                }
            </span>

            <PaperPlay
                audioRef = {paperPlayRefs[index]}
                durationSec = {paper.duration}
                isPlaying = {isPlayingPaperPlays[index]}
                index = {index}
                items = {items}
                isHidden = {false}
                onTrackEnd = {(event) => onTrackEnd(event, index)}
            />
        </span>
    );
}

export {PaperBasicActions};