import React from 'react';
import {Button} from '@material-ui/core';
import {createPortal} from 'react-dom';
import {getDisplayStrFromEpochSec} from "./Utils";

const PaperPreview = (props) => {

    const {title, link, authors, pubDate, abstract, categories, isHidden, closePopup, previewPopupRef,
        onMouseEnter, onMouseLeave} = props;

    if (isHidden) {
        return (<></>);
    }

    return (
        createPortal(
            <div className="paperDetailsPopup" ref={previewPopupRef} onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}>
              <div className="previewHeaderWrap">
                <div className="previewTitleLinkWrap">
                  <a target="_blank" className="previewTitleLink" href={link}>{title}</a>
                  <span className="previewPaperCats">{categories.join(", ")}</span>
                </div>
                <div className="previewMeta">
                   <span className="previewPaperDate">{getDisplayStrFromEpochSec(pubDate)}</span>&#160;&#160;&#8211;&#160;&#160;
                   <span className="previewAuthors">{authors}</span>
                </div>
              </div>
              <div className="previewAbstract">{abstract}</div>
              <div className="previewCloseLinkWrap">
                 <Button className="previewCloseLink" color="primary"
                      variant="contained" onClick={closePopup}>Close</Button>
              </div>
            </div>,
            document.body
        )
    );
}

export {PaperPreview};