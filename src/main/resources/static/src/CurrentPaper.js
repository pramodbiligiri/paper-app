//import {Link} from "react-router-dom";
import {Link} from "@material-ui/core";
import {useRef, useState, useLayoutEffect} from 'react';
import {ProgressBar} from './ProgressBar';
import {getDisplayStrFromEpochSec} from "./Utils";
import {PaperPreview} from "./PaperPreview";

const CurrentPaper = (props) => {

    const {title, currentPaperRef, pubDate, authors, url, abstract, categories,
        previewPopupRef, removeFromPlaylist,
        currentSec, durationSec, onSliderChange, audioRef
        } = props;

    const abstractLinkRef = useRef(null);

    const inPopup = useRef(false);

    const [isHidden, setIsHidden] = useState(true);

    const showPreview = (event, toShow, fromPopup, msg) => {
        if (toShow) {
            inPopup.current = fromPopup;
            console.log("showPreview: msg: " + msg);
            setIsHidden(false);
            return;
        }

        // Hide abstract preview
        if (fromPopup) {
            console.log("showPreview: msg: " + msg);
            inPopup.current = false;
            setTimeout(() => {
                setIsHidden(true);
            }, 500);
            return;
        }

        setTimeout(() => {
            console.log("showPreview: msg: " + msg + ", inPopup: " + inPopup.current);
            if (inPopup.current === false) {
                setIsHidden(true);
            }
         }, 500);
    }

    const onMouseOver = (event) => {
         event.stopPropagation();
         showPreview(event, true, false, "link onMouseEnter");
    }

    const positionPopup = () => {
        let linkRect = abstractLinkRef.current.getBoundingClientRect();
        let popupDims = previewPopupRef.current.getBoundingClientRect();

        let topPx, leftPx;
        if (window.innerHeight > 800 && window.innerWidth > 800) {
            topPx = window.scrollY + linkRect.top - 120 + "px";
            leftPx = window.scrollX + linkRect.left - popupDims.width + 20 + "px";
        } else {
//            topPx = window.scrollY + linkRect.top + 20 + "px";
            topPx = window.scrollY + 20 + "px";
            leftPx = (window.innerWidth - popupDims.width)/2 + "px";
        }

        previewPopupRef.current.style.top = topPx;
        previewPopupRef.current.style.left = leftPx;
    }

    useLayoutEffect(() => {
        if (isHidden) {
            return;
        }

        positionPopup();
    }, [isHidden]);

    return (
        <div className="currentPaper" ref={currentPaperRef}>
          <div className="currentPaperBasicInfo">
            <div className="currentPaperTitleWrap">
              <span className="currentPaperTitle">{title}</span>
              <span className="currentPaperCats">{categories.join(", ")}</span>
            </div>
            <div className="currentPaperMeta">
                <span className="paperSource">{getDisplayStrFromEpochSec(pubDate)}</span>
                <span className="sourceAuthorSeparator">&#8211;</span>
                <span className="currentPaperAuthors">{authors}</span>
            </div>
          </div>
          <div className="currentPaperLinksWrap">
              <span><Link color="inherit" className="currentPaperDel" onClick={removeFromPlaylist}>Remove</Link></span>

                <ProgressBar
                    currentSec = {currentSec}
                    durationSec = {durationSec}
                    onSliderChange = {onSliderChange}
                    audioRef = {audioRef}
                />

              <Link className="currentPaperLink"
                  ref={abstractLinkRef}
                  onClick={(event) => showPreview(event, true, false, "link onClick")}
                  onMouseEnter = {(event) => showPreview(event, true, false, "preview onMouseEnter")}
                  onMouseLeave = {(event) => showPreview(event, false, false, "preview onMouseLeave")}
                  onMouseOver = {onMouseOver}
                >abstract</Link>&#160;&#160;<span className="pipeSeparator">|</span>&#160;&#160;<a href={url} target="_blank"
                    title="ArXiv page (opens in New Tab)" className="currentPaperArxivLink">arxiv</a>
          </div>

          <PaperPreview
            title = {title}
            link = {url}
            authors = {authors}
            pubDate = {pubDate}
            abstract = {abstract}
            categories = {categories}
            isHidden = {isHidden}
            closePopup = {(event) => showPreview(event, false, true, "popup closeLink")}
            previewPopupRef = {previewPopupRef}
            onMouseEnter = {(event) => showPreview(event, true, true, "popup onMouseEnter")}
            onMouseLeave = {(event) => showPreview(event, false, true, "popup onMouseLeave")}
          />
        </div>
    );
}

export {CurrentPaper};