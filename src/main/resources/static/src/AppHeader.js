import {useState, useRef} from 'react';
//import {Link} from "react-router-dom";
import {Link} from '@material-ui/core';
import {Faq} from './Faq';

const AppHeader = (props) => {

    const [showFaq, setShowFaq] = useState(false);
    const popupOpenerRef = useRef(null);

    return (
      <>
        <div className="appHeader">
          <div className="appTitleWrap">
            <Link className="appTitleLink" href="/">
              <span className="appTitle">paper time</span>
            </Link>
            <span className="headphones">&#127911;</span>
            <div className="appCaption">
              <span className="listenCaption">
                <span className="stayTuned">tune in</span>
                <span className="stayTunedWith">to</span>
                <span className="captionRes">CS Research</span>
              </span>
            </div>
          </div>
          <div className="headerWhat" onClick={(e) => setShowFaq(true)}>
            <Link onClick={f => f} className="headerWhatText">F.A.Q</Link>
          </div>
        </div>

        <Faq
           toShow = {showFaq}
           position = "default"
           popupOpenerRef = {popupOpenerRef} // is null, since position=default
           closePopup = {(e) => setShowFaq(false)}
        />
      </>
    );
}

export {AppHeader};