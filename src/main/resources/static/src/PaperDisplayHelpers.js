//import {Link} from "react-router-dom";
import {Link} from "@material-ui/core";
import {SharePaper} from "./SharePaper";
import {useState, useRef} from 'react';

const PaperListMoreInfo = (props) => {

    const {previewRef, title, link, onMouseEnter, onClick, onMouseLeave} = props;

    const [onShareLink, setOnShareLink] = useState(false);
    const shareLinkRef = useRef(null);
    const [inSharePopup, setInSharePopup] = useState(false);

    const onMouseOver = (event) => {
         event.stopPropagation();
         onMouseEnter();
    }

    const sharePaper = (event) => {
        navigator.share(
          {
            text: title.replace(/(\r\n|\n|\r)/gm, "")  +" [shared from papertime.app]",
            url: link
          }
        );
    }

    return (
        <>
            <span className="paperListMoreInfo">
                <Link className="paperPreviewLink" ref={previewRef}
                    onMouseEnter = {onMouseEnter}
                    onMouseOver = {onMouseOver}
                    onClick = {onClick}
                    onMouseLeave = {onMouseLeave}
                    >abstract</Link><span className="absArxSeparator">&#160;&#160;|&#160;&#160;</span><a
                        className="paperListSourceLink" target="_blank" title="ArXiv page (opens in New Tab)"
                           href={link}>arxiv</a>
            </span>

            {  navigator.share ?
                <span className="paperShare">
                   <Link color="inherit" onClick={(e) => sharePaper(e)}>
                     <img alt="Share paper" className="paperShareImg" src="share-2.png"/>
                   </Link>
                </span>
            :

              <>
                <span className="paperShare" ref={shareLinkRef}>
                    <Link color="inherit" onClick={f=>f}
                          onMouseOver={(e) => setOnShareLink(true)}
                          onMouseEnter={(e) => setOnShareLink(true)}
                          onMouseLeave={(e) => setTimeout(() => setOnShareLink(false), 300)}>
                      <img alt="Share paper" className="paperShareImg" src="share-2.png"/>
                    </Link>
                </span>

                <SharePaper
                    title = {title}
                    link = {link}
                    toShow = {inSharePopup || onShareLink}
                    shareLinkRef = {shareLinkRef}
                    onMouseLeave = {(e) => setInSharePopup(false)}
                    onMouseEnter = {(e) => setInSharePopup(true)}
                />
              </>
           }
        </>
//                    toShow = {inSharePopup || onShareLink}
    );
}

const PaperCategories = (props) => {
    const {categories} = props;

    let cats = [];
    for (let i = 0; i < categories.length; i++) {
        cats.push(categories[i]);
    }

    return (
        <span className="paperCategories">{cats.join(", ")}</span>
    )
}

export {PaperListMoreInfo, PaperCategories};