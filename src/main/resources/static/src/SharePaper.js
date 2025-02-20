import React, {useRef, useState, useEffect, useLayoutEffect} from 'react';
import {Link} from '@material-ui/core';
//import {Link} from "react-router-dom";

const SharePaper = (props) => {

    const {title, link, toShow, shareLinkRef, onMouseEnter, onMouseLeave} = props;

    const shareMenuRef = useRef(null);
    const inputRef = useRef(null);

    const [linkTextState, setLinkTextState] = useState("initial");

    useLayoutEffect(() => {
        if (!toShow) {
            return;
        }

        if (!shareLinkRef || !shareLinkRef.current) {
            return;
        }

        if (!shareMenuRef || !shareMenuRef.current) {
            return;
        }

        let linkRect = shareLinkRef.current.getBoundingClientRect();
        let popupDims = shareMenuRef.current.getBoundingClientRect();

        let topPx = window.scrollY + linkRect.top - popupDims.height + 5 + "px";
        let leftPx = window.scrollX + linkRect.left - popupDims.width + 2 + "px";

        shareMenuRef.current.style.top = topPx;
        shareMenuRef.current.style.left = leftPx;
    });

    useEffect(() => {
        return(() => {
           // The timeout is a hack, as otherwise it changes immediately, even
           // when the popup is still open
            setTimeout(() => {setLinkTextState("initial");}, 5000);
        });
    });

    const copyPaperLinkToClipboard = () => {
        if (!inputRef || !inputRef.current) {
            return;
        }

        navigator.clipboard.writeText(link).then(
            function success() {
                setLinkTextState("copied");
            },
            function failure() {
                setLinkTextState("error");
            }
        );
    }

    if (!toShow) {
        return (<></>);
    }

    return (
       <div ref={shareMenuRef}
           className="paperSharePopup"
           onMouseLeave={onMouseLeave}
           onMouseEnter={onMouseEnter}>
           <input type="hidden" ref={inputRef} value={link}/>
           <div className="shareMenuItem">
             { linkTextState === "initial" ?
                <Link className="shareMenuItemLink"
                   onClick={(e) => copyPaperLinkToClipboard()}>Copy link to paper</Link>
               : (
                 linkTextState === "copied" ?
                   <span>Link copied</span>
                 : <span>Error copying link!</span>
               )
             }
           </div>
       </div>
    );

}

export {SharePaper};