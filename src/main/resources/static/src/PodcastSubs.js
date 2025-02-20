import Button from '@material-ui/core/Button';
import {Link} from '@material-ui/core';
import {React, useRef, useState, useLayoutEffect, useEffect} from 'react';
import {createPortal} from 'react-dom';

const PodcastSubs = (props) => {

    const {subsRef} = props;

    const popupRef = useRef(null);

    const [showPopup, setShowPopup] = useState(false);
    const [popupCat, setPopupCat] = useState("");

    const subImgs = [
        {cat: "ai", img: "pod-ai.jpg"},
        {cat: "arch", img: "pod-arch.jpg"},
        {cat: "db", img: "pod-db.jpg"},
        {cat: "dist", img: "pod-dist.jpg"},
        {cat: "net", img: "pod-net.jpg"},
        {cat: "os", img: "pod-os.jpg"},
        {cat: "pl", img: "pod-pl.jpg"}
    ];

    const catToImg = {
        "ai": "pod-ai.jpg",
        "arch": "pod-arch.jpg",
        "db": "pod-db.jpg",
        "dist": "pod-dist.jpg",
        "net": "pod-net.jpg",
        "os": "pod-os.jpg",
        "pl": "pod-pl.jpg"
    };

    useEffect(() => {
        if (!showPopup) {
            return;
        }

        if (subsRef == null || subsRef.current == null) {
            return;
        }

        if (popupRef == null || popupRef.current == null) {
            return;
        }

        popupRef.current.style.left =
            window.scrollX + (document.body.getBoundingClientRect().width - popupRef.current.clientWidth)/2 + "px";

        popupRef.current.style.top = (window.scrollY + subsRef.current.getBoundingClientRect().top + 40) + "px";

        subsRef.current.scrollIntoView(true);
    }, [showPopup]);

    return (
      <div className="podcastSubs" ref={subsRef}>
        <div className="podSubHeader">Subscribe to <span className="appNameTextFlow" >paper time</span> podcasts</div>
        <div className="podcastFlex">
          {subImgs.map (subImg => {
               return (
                 <div className="podcastSub">
                   <div>
                     <Link className="podImgWrap" onClick={(e) => {setShowPopup(true); setPopupCat(subImg.cat);}}>
                       <img src={subImg.img} className="podImg"/>
                     </Link>
                   </div>
                   <div>
                      <Button className="podcastSubBtn"
                        onClick={(e) => {setShowPopup(true); setPopupCat(subImg.cat);}}
                           variant="contained" className="podSubBtn">Subscribe</Button>
                    </div>
                 </div>
               );
          })}
        </div>

        <SubscribePopup
            toShow={showPopup}
            popupCat = {popupCat}
            closePopup={(e) => setShowPopup(false)}
            popupRef = {popupRef}
            subImg = {popupCat !== "" ? catToImg[popupCat] : null}
        />
       </div>
    );
}

const SubscribePopup = (props) => {

    const {toShow, popupCat, closePopup, popupRef, subImg} = props;

    const inputRef = useRef(null);

    const copyPodcastLinkToClipboard = () => {
        if (!inputRef || !inputRef.current) {
            return;
        }

        navigator.clipboard.writeText(inputRef.current.value).then(
            function success() {
            },
            function failure() {
              console.log("Failed to copy URL to clipboard");
            }
        );
    }

    if (!toShow) {
        return (
          <> </>
        );
    }

    if (popupCat === "") {
        return (
          <> </>
        );
    }

    let info = {
        "arch" : {link: "https://papertime.app/podcast/arch", img: "pod-sub-arch-edit.jpg"},
        "ai" : {link: "https://papertime.app/podcast/ai", img: "pod-sub-ai-edit.jpg"},
        "db" : {link: "https://papertime.app/podcast/db", img: "pod-sub-db-edit.jpg"},
        "dist" : {link: "https://papertime.app/podcast/dist", img: "pod-sub-dist-edit.jpg"},
        "net" : {link: "https://papertime.app/podcast/net", img: "pod-sub-net-edit.jpg"},
        "os" : {link: "https://papertime.app/podcast/os", img: "pod-sub-os-edit.jpg"},
        "pl" : {link: "https://papertime.app/podcast/pl", img: "pod-sub-pl-edit.jpg"}
    }

    return (
        createPortal (
            <div ref={popupRef} className="subPopup">
               <div style={{clear: "both"}}>
                 <Link onClick={closePopup}><img className="faqCloseIcon" src="./close-4.png" alt="Close Popup"/></Link>
               </div>

               <div className="subInstWrap">
                 <div>
                     <div className="subInstImgWrap">
                       <img className="subInstImg" src={subImg !== null ? subImg : ""}/>
                     </div>
                     <div className="subInstOverview">
                       <div className="subInstOverviewLine1">This podcast isn't listed in the Apple/Google podcast directory.</div>
                       <div className="subInstOverviewLine2">Follow the <b>Steps</b> below to add its URL directly to your podcast app</div>
                       <div className="subInstIphone">(These steps are for <b>iPhone</b>. See <Link rel="nofollow" target="_blank" href="https://medium.com/@joshmuccio/how-to-manually-add-a-rss-feed-to-your-podcast-app-on-desktop-ios-android-478d197a3770">this article</Link> for other apps.)</div>
                     </div>
                     <div style={{clear: "both"}}/>
                 </div>
               </div>

               <div className="podSubPopupFlex">
                   <div className="subStepWrap">
                     <div className="subStepCopy">
                       <span className="subStepNum">Step 1.</span> Copy this URL
                     </div>

                     <div className="subStepPodLinkWrap">
                       <input type="hidden" ref={inputRef} value={info[popupCat].link}/>
                       <span className="podSubLink" onClick={f=>f}>{info[popupCat].link}</span>
                     </div>

                     <div className="subPodLinkCopy">
                       <Button variant="contained" onClick={(e) => copyPodcastLinkToClipboard()}>COPY</Button>
                     </div>
                   </div>

                   <div className="subStepWrap">
                     <div className="subStepTextWrap">
                       <span className="subStepNum">2.</span> Open the <b>Podcasts</b> app on your iPhone
                     </div>
                     <div className="subStepImgWrap"><img className="subStepAppImg" src="podcast-app-icon.png" /></div>
                   </div>

                   <div className="subStepWrap">
                     <div className="subStepTextWrap">
                       <span className="subStepNum">3.</span> In the podcast <b>Library</b> screen, click the <b>"Edit"</b> button on top
                     </div>
                     <div className="subStepImgWrap"><img className="subStepLibImg" src="pod-sub-1-edit-2.jpg"  /></div>
                   </div>

                   <div className="subStepWrap">
                     <div className="subStepTextWrap"><span className="subStepNum">4.</span> Click on "Add a Show by URL" </div>
                     <div className="subStepImgWrap"><img className="subStepAddShowImg" src="pod-sub-2-edit-3.jpg"  /></div>
                   </div>

                   <div className="subStepWrap">
                     <div className="subStepTextWrap"><span className="subStepNum">5.</span> Paste the podcast URL and click <b>Subscribe</b></div>
                     <div className="subStepImgWrap">
                       <img className="subStepUrlImg" src={info[popupCat].img}/>
                     </div>
                   </div>

                   <div className="subStepWrap">
                     <div className="subStepTextWrap"><span className="subStepNum">6.</span> You should see a confirmation</div>
                     <div className="subStepImgWrap"><img className="subStepConfirmImg" src="pod-sub-done-edit-2.jpg"/></div>
                   </div>
               </div>
            </div>,
            document.body
        )
    );

}

export {PodcastSubs};