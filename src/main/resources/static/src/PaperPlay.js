import React, {useRef, useState, useLayoutEffect, useEffect} from 'react';
import {secondsToDurationStr} from './Utils';
import {useMediaPredicate} from 'react-media-hook';
import {SpeedControl} from './SpeedControl';
import {logPaperListen} from './StatPaperListen';

const PaperPlay = (props) => {

    const {audioRef, durationSec, isPlaying, index, items, isHidden, onTrackEnd} = props;

    const slideTimerRef = useRef(null);

    const [currentSecLocal, setCurrentSecLocal] = useState(
        audioRef && audioRef.current ? Math.floor(audioRef.current.currentTime) : 0
    );

    // used by stats to determine whether to log
    const [lastTsLogged, setLastTsLogged] = useState(-1);

    const updateTimestamps = () => {
        let newTime = Math.floor(audioRef.current ? audioRef.current.currentTime : 0);
        setCurrentSecLocal(newTime);
    }

    const updateSlider = () => {
        if (audioRef.current == null) {
            return;
        }

        updateTimestamps();

        if (audioRef && audioRef.current && audioRef.current.ended) {
            onTrackEnd();
        }

    }

    const clearSlideTimer = () => {
        if (slideTimerRef.current) {
            clearInterval(slideTimerRef.current);
        }
    }

    const resetSlideTimer = () => {
        clearSlideTimer();

        if (isPlaying && audioRef.current) {
            slideTimerRef.current = setInterval(updateSlider, 1000);
        }
    }

    const onSliderChange = (event) => {
        event.stopPropagation();
        let valueInt = parseInt(event.target.value, 10);

        audioRef.current.currentTime = valueInt;
        setCurrentSecLocal(valueInt);

        if (slideTimerRef.current) {
            clearInterval(slideTimerRef.current);
        }

        if (isPlaying) {
            slideTimerRef.current = setInterval(updateSlider, 1000);
        }
    }

    useLayoutEffect(() => {
        resetSlideTimer();

        return (() => {
            clearSlideTimer();
        });
    }, []);

    useLayoutEffect(() => {
        if (isPlaying) {
            resetSlideTimer();
            updateTimestamps();
        } else {
            clearSlideTimer();
        }
    }, [isPlaying]);

    useEffect(() => {
        let newVal = logPaperListen(lastTsLogged, "single", audioRef, isPlaying, items[index].key, items);
        if (newVal !== lastTsLogged) {
            setLastTsLogged(newVal);
        }
    }, [currentSecLocal]);

    const isMediumPlusSize = useMediaPredicate('(min-width: 600px)');

    if (isHidden || audioRef == null || audioRef.current == null) {
        return (
            <> </>
        );
    }

    if (isMediumPlusSize) {
        return (
            <span className="paperPlay">
              <span className="paperPlayCurrentTs">{secondsToDurationStr(currentSecLocal)}</span>
              <input type="range" className="paperPlayProgress"
                  value = {currentSecLocal}
                  min = "0"
                  max = {Math.floor(audioRef.current.duration)}
                  step = "1"
                  onChange={onSliderChange}
              />
              <span className="paperPlayDurationTs">{secondsToDurationStr(durationSec)}</span>
              <SpeedControl audioRef={audioRef} />
            </span>
        );
    }

    return (
        <span className="paperPlay">
          <span className="paperPlayCurrentTs">{secondsToDurationStr(currentSecLocal)}</span>/
          <span className="paperPlayDurationTs">{secondsToDurationStr(durationSec)}</span>
          <SpeedControl audioRef={audioRef} />
        </span>
    );

}

export {PaperPlay};