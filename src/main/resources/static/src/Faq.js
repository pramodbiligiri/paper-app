import {useRef, useState, useLayoutEffect} from 'react';
import {createPortal} from 'react-dom';
//import {Link} from "react-router-dom";
import {Link} from '@material-ui/core';
import {Button} from '@material-ui/core';

const Faq = (props) => {

    const {toShow, closePopup, popupOpenerRef, position} = props;
    const popupRef = useRef(null);

    const [emailStatus, setEmailStatus] = useState("None");
    const emailRef = useRef(null);

    const [feedbackStatus, setFeedbackStatus] = useState("None");
    const feedbackRef = useRef(null);

    useLayoutEffect(() => {
        if (!toShow) {
            return;
        }

        if (position === "above") {
            if (popupOpenerRef == null || popupOpenerRef.current == null) {
                return;
            }

            popupRef.current.style.left =
                (document.body.getBoundingClientRect().width - popupRef.current.clientWidth)/2 + "px";

            popupRef.current.style.top = (document.body.getBoundingClientRect().height - popupRef.current.clientHeight/2) + "px";
        } else {
            popupRef.current.style.left =
                (document.body.getBoundingClientRect().width - popupRef.current.clientWidth)/2 + "px";
        }

    });

    const saveEmail = async (e) => {
        if (emailRef.current == null || emailRef.current.value === "") {
            return;
        }

        let email = emailRef.current.value;

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "email": email })
        };

        let status = await fetch('/api/save-email', requestOptions)
            .then(res => res.json())
            .then(json => json.resp.status);

        if (status === "success") {
            setEmailStatus("success");
        } else {
            setEmailStatus("fail");
        }
    }

    const saveFeedback = async (e) => {
        if (feedbackRef.current == null || feedbackRef.current.value === "") {
            return;
        }

        let feedback = feedbackRef.current.value;

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "data": feedback })
        };

        let status = await fetch('/api/save-feedback', requestOptions)
            .then(res => res.json())
            .then(json => json.resp.status);

        if (status === "success") {
            setFeedbackStatus("success");
        } else {
            setFeedbackStatus("fail");
        }
    }

    if (!toShow) {
        return ( <> </> );
    }

    return (
        createPortal (
            <div className="faqPopup" ref={popupRef}>
                <div style={{clear: "both", height:"20px"}}><Link onClick={closePopup}><img className="faqCloseIcon"
                  src="./close-4.png" alt="Close Popup"/></Link></div>
                <div className="faqQn">What is <span className="appNameText" style={{marginLeft: "4px"}}>paper time</span>?</div>
                <div className="faqAns">
                  <ul style={{marginTop: "8px"}}>
                    <li>A quick way to browse CS papers in <a target="_blank" href="https://arxiv.org">Arxiv</a></li>
                    <li>And <b>listen</b> to their abstracts like a podcast, as you go about your chores or for a walk!</li>
                  </ul>
                </div>

                <div className="faqQn">Which papers are available?</div>
                <div className="faqAns">
                Papers in topics like AI, Architecture, Databases, Distributed Computing, Networking, OS and Programming Languages. More topics coming soon!
                </div>

                <div className="faqQn">Who is behind this?</div>
                <div className="faqAns">
                    <img src="profile-image.jpg" alt="profile picture" className="faqPic"/>My name is <span className="appAuthorName">Pramod Biligiri</span>.
                    I work as a freelance software consultant (<Link target="_blank" rel="nofollow" href="https://www.linkedin.com/in/pramod-biligiri/">my LinkedIn profile</Link>).<br/><br/>
                    I'm building <span className="appNameTextFlow">paper time</span> as a hobby and for my own needs. You can read more about me at <a target="_blank" href="https://www.pramodb.com">www.pramodb.com</a>.
                </div>

                <div className="emailMeMsg">
                  <div>
                      <div>"Sounds great <span className="thumbsUpEmoji">&#128077;</span></div>
                      <div>
                          When you add new features or more topics, can you let me know at this email address?"
                      </div>
                      <div className="emailUpdateForm"><input type="text" size="20" className="emailUpdateInput" ref = {emailRef}/>
                          <Button color="primary" variant="contained" className="emailUpdateButton" onClick = {(e) => saveEmail(e)}>Don't Spam / Sell my data please!</Button>
                      </div>
                      {emailStatus === "None" ? "" :
                        (
                          emailStatus === "success" ? <div>Thanks! I will keep you posted</div> : <div className="formErrorMsg">Error saving email. Check if it is correct</div>
                        )
                      }
                  </div>
                </div>

                <div className="feedbackMsg">
                  "I have some feedback for you!"
                  <div className="feedbackFlex">
                    <textarea rows="5" cols="40" ref={feedbackRef}></textarea>
                    <Button variant="contained" color="primary" onClick={(e) => saveFeedback(e)}>Submit Feedback</Button>
                    {feedbackStatus === "None" ? "" :
                      (
                        feedbackStatus === "success" ? <div>Thanks for your feedback!</div> : <div className="formErrorMsg">Error saving feedback</div>
                      )
                    }
                  </div>
                </div>

                <div className="faqClose"><Link className="faqCloseLink" onClick={closePopup}>Close</Link></div>

            </div>,
            document.body
        )
    );

}

export {Faq};