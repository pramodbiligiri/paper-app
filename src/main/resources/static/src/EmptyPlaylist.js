import React, {useState, useRef} from 'react';
import Button from '@material-ui/core/Button';
import {Faq} from './Faq';

const EmptyPlaylist = (props) => {

    const {subsRef} = props;

    const [showFaq, setShowFaq] = useState(false);
    const popupOpenerRef = useRef(null);

    const scrollSubsIntoView = (e) => {
        if (subsRef == null || subsRef.current == null) {
            return;
        }

        subsRef.current.scrollIntoView(true);
    }

    return (
        <div className="emptyPlayListWrap">
          <div className="emptyPlaylist">
              <b>Listen</b> to <b className="emptyPlayUiListEm">abstracts</b> of
               latest <b className="emptyPlayUiListEm">research papers</b>
          </div>
          <div className="emptyPlaylistReadMore">
            <Button className="emptyPlaylistReadMoreBtn"
              onClick={(e) => setShowFaq(true)} variant="contained" color="primary">Learn More</Button>
          </div>

          <Faq
              toShow = {showFaq}
              position = "default"
              popupOpenerRef = {popupOpenerRef} // is null, since position=default
              closePopup = {(e) => setShowFaq(false)}
          />

          <div className="podcastsWrap">
              <Button className="podcastSubPointer"
                  onClick={scrollSubsIntoView} variant="contained"
                  color="primary"
                  style={{fontSize: "18px"}}>Subscribe from your Podcasts app</Button>
          </div>
        </div>
    );
}



export {EmptyPlaylist};