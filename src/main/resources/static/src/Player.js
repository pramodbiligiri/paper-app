import React, {useRef, useState, useLayoutEffect, useEffect} from 'react';
import {CurrentPaper} from './CurrentPaper';
import {PlayerActions} from './PlayerActions';
import {EmptyPlaylist} from './EmptyPlaylist';
import {TrackSwitcher} from './TrackSwitcher';
import {isValidIndex} from './Utils';
import {PlaylistDuration} from './PlaylistDuration';
import {logPaperListen} from './StatPaperListen';

const Player = (props) => {

    const {items, isPlaying, setIsPlaying, onPlaylistEnded,
            currentItemKey, setCurrentItemKey, previewPopupRefs, removeFromPlaylist,
            paperPlayRefs, setPaperPlayRefs, isPlayingPaperPlays, setIsPlayingPaperPlays,
            subsRef} = props;

     const getIndexForKey = (itemKey) => {
        for (let i = 0; i < items.length; i++) {
            if (itemKey === items[i].key) {
                return i;
            }
        }

        return -1;
    }

    let currentIndex = getIndexForKey(currentItemKey);

    console.log("Player: items.length: " + items.length + " key: " + currentItemKey +
           " currentIndex: " + currentIndex);

    const currentPaperRef = useRef(null);
    const audioRef = useRef();
    const [switchTrack, resumeTrack, clearTrack] = TrackSwitcher();
    const progressTrackerRef = useRef(null);

    const slideTimerRef = useRef(null);
    const [currentSecLocal, setCurrentSecLocal] = useState(
            audioRef && audioRef.current ? Math.floor(audioRef.current.currentTime) : 0);

    let lastTsLogged = -1; // used by stats to determine whether to log

    // returns sum of duration of items finished playing so far (in seconds)
    const addTimeOfPlaylistSoFar = () => {
        let currentIndex = getIndexForKey(currentItemKey);
        if (!isValidIndex(currentIndex, items)) {
            return 0;
        }

        let total = 0;
        for (let i = 0; i < currentIndex && i < items.length; i++) {
            total += items[i].duration;
        }

        return total;
    }

    const [playlistCurrentTimestamp, setPlaylistCurrentTimestamp] = useState(0);

    const updateTimestamps = () => {
        let newTime = Math.floor(audioRef.current ? audioRef.current.currentTime : 0);
        setCurrentSecLocal(newTime);
        setPlaylistCurrentTimestamp(addTimeOfPlaylistSoFar() + newTime);
    }

    const updateSlider = () => {
        if (audioRef.current == null) {
            return;
        }

        updateTimestamps();
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

        let newPlaylistTimestamp = addTimeOfPlaylistSoFar() + valueInt;
        setPlaylistCurrentTimestamp(newPlaylistTimestamp);

        if (slideTimerRef.current) {
            clearInterval(slideTimerRef.current);
        }

        if (isPlaying) {
            slideTimerRef.current = setInterval(updateSlider, 1000);
        }
    }

    let title = "";
    if (items.length > 0 && currentIndex !== -1 && currentIndex < items.length) {
        title = items[currentIndex].title;
    }

    const playFromCurrent = () => {
        let currentIndex = getIndexForKey(currentItemKey);

        console.log("playFromCurrent: currentIndex: " + currentIndex);

        if (!isValidIndex(currentIndex, items)) {
            return;
        }

        resumeTrack(audioRef, paperPlayRefs, setIsPlayingPaperPlays);

        setIsPlaying(true);
    }

    const pauseCurrent = () => {
        let currentIndex = getIndexForKey(currentItemKey);

        if (!isValidIndex(currentIndex, items)) {
            return;
        }

        if (audioRef.current) {
            audioRef.current.pause();
        }

//        setIsPlaying(false);
    }

    const nextTrack = () => {
        let currentIndex = getIndexForKey(currentItemKey);

        console.log("Player.nextTrack: currentItemKey: " + currentItemKey
            + " currentIndex: " + currentIndex + " items.length: " + items.length);

        if (items.length === 0 || currentIndex === items.length-1) {
            console.log("Playlist has ended");
            onPlaylistEnded();
            return;
        }

        switchTrack(audioRef, items[currentIndex + 1].url, isPlaying, paperPlayRefs, setIsPlayingPaperPlays);
        setCurrentItemKey(items[currentIndex + 1].key);
    }

    const prevTrack = () => {
        let currentIndex = getIndexForKey(currentItemKey);
        if (currentIndex <= 0 || items.length === 0) {
            return;
        }

        switchTrack(audioRef, items[currentIndex - 1].url, isPlaying, paperPlayRefs, setIsPlayingPaperPlays);
        setCurrentItemKey(items[currentIndex - 1].key);
    }

    const nextTrackActionHandler = () => {
        let currentIndex = getIndexForKey(currentItemKey);
        if (!isValidIndex(currentIndex+1, items)) {
            return;
        }

        nextTrack();
    }

    const prevTrackActionHandler = () => {
        let currentIndex = getIndexForKey(currentItemKey);
        if (!isValidIndex(currentIndex-1, items)) {
            return;
        }

        prevTrack();
    }

    const progressTrackerFn = () => {
        if (!isPlaying) {
            return;
        }

        lastTsLogged = logPaperListen(lastTsLogged, "list", audioRef, isPlaying, currentItemKey, items);

        if (audioRef.current == null || audioRef.current.ended) {
            console.log("Player.progressTrackerFn: track has ended");
            nextTrack();
        }

    }

    useEffect(() => {
        if (progressTrackerRef.current) {
            clearInterval(progressTrackerRef.current);
        }
        console.log("Player.useEffect([]): Setting progressTrackerFn")
        progressTrackerRef.current = setInterval(progressTrackerFn, 1000);

        return (() => {
            console.log("Player:cleanup: []");
            if (audioRef && audioRef.current) {
                console.log("Player: cleanup: []: audioRef pause");
                audioRef.current.pause();
            }
            console.log("Player:cleanup: []: clearing progressTracker");
            clearInterval(progressTrackerRef.current);
            clearInterval(slideTimerRef.current);
        });

    }, []);

    useLayoutEffect(() => {
        console.log("Player.useLayoutEffect(currentItemKey): key: " + currentItemKey);

        if (progressTrackerRef.current) {
            clearInterval(progressTrackerRef.current);
        }

        let currentIndex = getIndexForKey(currentItemKey);
        if (!isValidIndex(currentIndex, items)) {
            clearTrack(audioRef);
            clearSlideTimer();
            setCurrentSecLocal(0);
            setPlaylistCurrentTimestamp(0);
        } else {
            switchTrack(audioRef, items[currentIndex].url, isPlaying, paperPlayRefs, setIsPlayingPaperPlays);
            resetSlideTimer();
            updateTimestamps();
            progressTrackerRef.current = setInterval(progressTrackerFn, 1000);
        }

    }, [currentItemKey]);

    useLayoutEffect(() => {
        console.log("useLayoutEffect: [isPlaying]");
        if (progressTrackerRef.current) {
            clearInterval(progressTrackerRef.current);
        }

//        console.log("Player.useEffect([isPlaying]): Calling resetSlideTimer");
        if (isPlaying) {
            resetSlideTimer();
            updateTimestamps();
            progressTrackerRef.current = setInterval(progressTrackerFn, 1000);
        } else {
            pauseCurrent();
            clearSlideTimer();
        }

    }, [isPlaying]);

    useLayoutEffect(() => {
        console.log("useLayoutEffect: [JSON.stringify(items)]");
        if (progressTrackerRef.current) {
            clearInterval(progressTrackerRef.current);
        }

        if (isPlaying) {
            resetSlideTimer();
            updateTimestamps();
            progressTrackerRef.current = setInterval(progressTrackerFn, 1000);
        } else {
            clearSlideTimer();
            updateTimestamps();
        }

    }, [JSON.stringify(items)]);

    if (items.length === 0) {
        return (
            <EmptyPlaylist subsRef = {subsRef}/>
        );
    }

    if (currentIndex < 0 || currentIndex >= items.length) {
        console.log("Player: currentIndex out of bounds. currentIndex: " +
            currentIndex + " items.length: " + items.length);
        return (<></>);
    }

    return (
        <div className="summary">
          <PlaylistDuration
              currentIndex = {currentIndex}
              items = {items}
              playlistCurrentTimestamp = {playlistCurrentTimestamp}
           />

          <CurrentPaper
              title = {title}
              currentPaperRef = {currentPaperRef}
              authors = {items[currentIndex].authors}
              pubDate = {items[currentIndex].pubDate}
              categories = {items[currentIndex].categories}
              url = {items[currentIndex].link}
              abstract = {items[currentIndex].abstract}
              previewPopupRef = {previewPopupRefs[currentIndex]}
              removeFromPlaylist = {(e) => removeFromPlaylist(e, currentIndex)}
              currentSec = {currentSecLocal}
              durationSec = {items[currentIndex].duration}
              onSliderChange = {onSliderChange}
              audioRef = {audioRef}
          />

          <PlayerActions
            isPlaying = {isPlaying}
            nextTrackFn = {nextTrackActionHandler}
            prevTrackFn = {prevTrackActionHandler}
            pauseCurrentFn = {(e) => setIsPlaying(false)}
            playFromCurrentFn = {(e) => playFromCurrent()}
            hasNext = {currentIndex < items.length - 1}
            hasPrev = {currentIndex > 0}
            itemsCount = {items.length}
          />
        </div>
    );

}

export {Player};