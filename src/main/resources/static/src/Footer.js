import React, {useState, useRef, useEffect, useLayoutEffect} from 'react';
//import {Link} from "react-router-dom";
import {Faq} from './Faq';
import {Link, Button} from '@material-ui/core';
import {createPortal} from 'react-dom';

const Footer = (props) => {

    const [showFaq, setShowFaq] = useState(false);

    const popupOpenerRef = useRef(null);

    const [emailStatus, setEmailStatus] = useState("None");
    const emailRef = useRef(null);

    const [feedbackStatus, setFeedbackStatus] = useState("None");
    const [showFeedback, setShowFeedback] = useState(false);
    const footerFeedbackPopup = useRef(null);

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

   const saveFeedback = async (e, feedbackRef) => {
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
          setTimeout(
              function() {
                setShowFeedback(false);
                setFeedbackStatus("None");
              },
              1500
          );
      } else {
          setFeedbackStatus("fail");
      }
   }

   useLayoutEffect(() => {
       if (!showFeedback) {
           return;
       }

       if (!footerFeedbackPopup || !footerFeedbackPopup.current) {
           console.log("Not positioning feedback");
           return;
       }

       let node = footerFeedbackPopup.current;

       node.style.left = window.scrollX + (window.innerWidth - node.clientWidth)/2 + "px";
       let topPx = window.scrollY + (window.innerHeight  - node.clientHeight)/2 + "px";

       node.style.top = topPx;

   }, [showFeedback]);

    return (
        <>
          <div className="footer">
            <div className="footerNotifyWrap">
                <div className="footerEmailLabelWrap"><label className="footerEmailLabel" htmlFor="footerEmailInput">Mail me about new features or big updates</label></div>
                <div>
                  <input ref={emailRef}
                     className="footerEmailInput" size={27} id="emailFeedbackFooter" type="text" name="emailFeedback"/>
                  <Button className="footerEmailSubmitBtn" onClick = {(e) => saveEmail(e)} color="primary" variant="contained">Submit email</Button>
                  {emailStatus === "None" ? "" :
                    (
                      emailStatus === "success" ? <div className="footerEmailSuccess">Email saved. Will keep you posted!</div> : <div className="formErrorMsg">Error saving email. Check if it is correct</div>
                    )
                  }
                </div>
                <div className="twitterFollowWrap">
                  <Link target="_blank" rel="nofollow" title="Opens in new tab" href="https://twitter.com/intent/follow?screen_name=papertimeapp"
                     color="inherit" className="footerTwitterFollow">Follow @papertimeapp for updates</Link>
                </div>
            </div>

            <div className="footerFeedbackWhat">
              <div>
                <Link color="inherit" className="notifyFeedback" onClick={e => setShowFeedback(val => !val)}>I HAVE FEEDBACK!</Link>
              </div>
              <Link color="inherit" className="footerWhat" ref={popupOpenerRef}
                onClick={(e) => setShowFaq(true)}>About <span className="appNameTextFlow">paper time</span></Link>
            </div>
          </div>


          <FeedbackPopup
              toShow = {showFeedback}
              footerFeedbackPopup={footerFeedbackPopup}
              saveFeedback = {saveFeedback}
              feedbackStatus = {feedbackStatus}
              setShowFeedback = {setShowFeedback}
          />

          <Faq
              toShow = {showFaq}
              popupOpenerRef = {popupOpenerRef}
              position = "above"
              closePopup = {(e) => setShowFaq(false)}
          />
        </>
    );
}

const FeedbackPopup = (props) => {

   const {toShow, footerFeedbackPopup, saveFeedback, feedbackStatus, setShowFeedback} = props;

   const feedbackRef = useRef(null);

   useEffect(() => {
       if (!toShow) {
           return;
       }

       if (feedbackRef && feedbackRef.current) {
           feedbackRef.current.focus();
       }
   });

   if (!toShow) {
     return ( <> </> );
   }

   if (feedbackStatus === "success") {
       return createPortal (
           <div className="footerFeedbackWrap" ref={footerFeedbackPopup}>
              <div>My feedback about <span className="appNameTextFlow">paper time</span></div>
              <div style={{marginLeft: "10px", marginTop: "30px"}}>Thanks so much for your feedback!</div>
           </div>,
           document.body
       );
   }

   if (feedbackStatus === "None") {
       return createPortal(
           <div className="footerFeedbackWrap" ref={footerFeedbackPopup}>
              <div>My feedback about <span className="appNameTextFlow">paper time</span></div>
              <div>
                <textarea rows="5" cols="40" ref={feedbackRef} className="footerFeedbackTextArea"></textarea>
              </div>
              <div>
                <Button variant="contained" color="primary" onClick={(e) => saveFeedback(e, feedbackRef)}>Submit Feedback</Button>
                <Link color="inherit" style={{marginLeft: "20px", color: "black", cursor: "pointer"}} onClick={e => setShowFeedback(false)}>Cancel</Link>
              </div>
           </div>,
           document.body
       );
   }

   if (feedbackStatus === "failure") {
      return createPortal(
          <div className="footerFeedbackWrap" ref={footerFeedbackPopup}>
             <div>Feedback about <span className="appNameTextFlow">paper time</span></div>
             <div>Sorry, Error saving feedback!</div>
             <div>
               <textarea rows="5" cols="40" ref={feedbackRef} className="footerFeedbackTextArea"></textarea>
             </div>
             <div>
               <Button className="footerSubmitFeedbackBtn" variant="contained" color="primary"
                   onClick={(e) => saveFeedback(e, feedbackRef)}>Submit Feedback</Button>
               <Link color="inherit" style={{marginLeft: "20px", color: "black", cursor: "pointer"}} onClick={e => setShowFeedback(false)}>Cancel</Link>
             </div>
          </div>,
          document.body
      );
   }

   return (<></>);
}

export {Footer};