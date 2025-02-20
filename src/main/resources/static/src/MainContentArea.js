import React, {useState, useRef, createRef, useEffect, useLayoutEffect} from 'react';
import {Link} from '@material-ui/core';
import {PaperListMain} from "./PaperListMain";
import {PaperListNav} from "./Navigation";
import {ExploreCats} from "./ExploreCats";
import {Item} from "./Item";
import {PodcastSubs} from './PodcastSubs';
import {useMediaPredicate} from 'react-media-hook';

const MainContentArea = (props) => {

    const {playlist, isPlaying, setIsPlaying, addToPlaylist, removeFromPlaylist,
       previewPopupRefs, setPreviewPopupRefs,
       paperPlayRefs, setPaperPlayRefs,
       isPlayingPaperPlays, setIsPlayingPaperPlays,
       subsRef} = props;

    const [items, setItems] = useState([]);

    const [pageSize] = useState(parseInt(process.env.REACT_APP_PAGE_SIZE, 10) || 5);

    const [total, setTotal] = useState(0);
    const [offset, setOffset] = useState(0);

    const [paperListType, setPaperListType] = useState("cats");

    const [searchQuery, setSearchQuery] = useState("");

    const paperListUiRef = useRef(null);

    const parseLocalStorageCats = () => {
        if (!localStorage.getItem("cat")) {
            return ["all"];
        }

        try {
            return JSON.parse(localStorage.getItem("cat"));
        } catch (err) {
            return ["all"];
        }
    }

    const parseLocalStorageCatsWithError = () => {
        return JSON.parse(localStorage.getItem("cat"));
    }

    const [category, setCategory] = useState(parseLocalStorageCats());

    // Tracks if category has been modified at least once (either by local UI change
    // or from server response)
    const [hasCatEverChanged, setHasCatEverChanged] = useState(false);

    const setCategoryFromClient = (newCategory) => {
        setHasCatEverChanged(true);
        setCategory(newCategory);
    }

    const setCategoryFromServer = (newCategory) => {
        setHasCatEverChanged(true);

        // Trust server and update local storage unconditionally
        localStorage.setItem("cat", JSON.stringify(newCategory));

        setCategory(newCategory);
    }

    const [hidePreviews, setHidePreviews] = useState([]);
    const [previewRefs, setPreviewRefs] = useState([]);

    const inPopup = useRef(false);

    const positionPopupNearAbstractLink = (abstractLink, popup) => {
        let linkRect = abstractLink.getBoundingClientRect();
        let popupDims = popup.getBoundingClientRect();

        let topPx, leftPx;
        if (window.innerHeight > 800 && window.innerWidth > 800) {
            topPx = window.scrollY + linkRect.top - 120 + "px";
            leftPx = window.scrollX + linkRect.left - popupDims.width + 20 + "px";
        } else {
//            topPx = window.scrollY + linkRect.top + 20 + "px";
            topPx = window.scrollY + 20 + "px";
            leftPx = (window.innerWidth - popupDims.width)/2 + "px";
        }

        popup.style.top = topPx;
        popup.style.left = leftPx;
    }

    const scrollUpIfRequired = () => {
        // This prevents the page from scrolling down to where it was previously.
        if ('scrollRestoration' in window.history) {
          window.history.scrollRestoration = 'manual';
        }

        if (playlist.length === 0 && offset === 0) {
            document.documentElement.scrollTop = 0;
        } else if (paperListUiRef && paperListUiRef.current) {
        //    console.log("Scrolling paperlist UI ref into view");
            paperListUiRef.current.scrollIntoView(true);
        }
    }

    const fetchData = (from, count) => {
        fetch("/api/paper-data?category=" + (category.join(",")) + "&from=" + from + "&count=" + count)
          .then(res => res.json())
          .then(json => {
              let data = json.paperData;
              console.log("fetchData(): Obtained data");
              setItems(
                  data.papers.map(
                      paper => new Item(
                          {
                               url: paper.filename,
                               paperId: paper.paperId,
                               title: paper.title,
                               pubDate: paper.pubDate,
                               duration: paper.duration,
                               key: paper.key,
                               abstract: paper.abstract,
                               link: paper.link,
                               authors: paper.authors,
                               categories: paper.categories
                          }
                      )
                  )
              );
              setTotal(data.total);

              // Server can validate and send back results for a different category list.
              // Store the returned category list.
              setCategoryFromServer(data.categories);

              scrollUpIfRequired();
              console.log("Finished fetchData");
          }).catch(e => setItems([]));
    }

    const fetchSearch = (query, from, count) => {
        fetch("/api/search?q=" + query + "&from=" + from + "&count=" + count)
          .then(res => res.json())
          .then(json => {
              let data = json.paperData;
              console.log("fetchSearch(): Obtained search results");
              setItems(
                  data.papers.map(
                      paper => new Item(
                          {
                               url: paper.filename,
                               paperId: paper.paperId,
                               title: paper.title,
                               pubDate: paper.pubDate,
                               duration: paper.duration,
                               key: paper.key,
                               abstract: paper.abstract,
                               link: paper.link,
                               authors: paper.authors,
                               categories: paper.categories
                          }
                      )
                  )
              );
              setTotal(data.total);

              scrollUpIfRequired();

              console.log("Finished fetchSearch");
          }).catch(e => setItems([]));
    }

    const pausePaperListPapers = () => {
        for (let i = 0; i < paperPlayRefs.length; i++) {
            if (paperPlayRefs[i].current !== null) {
                paperPlayRefs[i].current.pause();
            }
        }

        setIsPlayingPaperPlays(arr => arr.map((elem, i) => false));
    }

    useLayoutEffect (() => {
        try {
            let cachedCats = parseLocalStorageCatsWithError();
            if (hasCatEverChanged && JSON.stringify(category) === JSON.stringify(cachedCats)) {
                return;
            }

            if (hasCatEverChanged && offset === 0) {
                // TODO: Check why explicit fetchData is required here
                fetchData(0, pageSize);
            } else {
                setOffset(0);
            }
        } catch (e) {
            console.log("Error while parsing local storage cats");
            if (hasCatEverChanged && offset === 0) {
                // TODO: Check why explicit fetchData is required here
                fetchData(0, pageSize);
            } else {
                setOffset(0);
            }
        }
    }, [JSON.stringify(category)]);

    useLayoutEffect(() => {
        console.log("useLayoutEffect[searchQuery]");
        if (searchQuery.trim() === "") {
            return;
        }

        if (paperListType === "searchResults" && offset === 0) {
            fetchSearch(searchQuery, offset, pageSize);
        } else {
            setPaperListType("searchResults");
            setOffset(0);
        }
    }, [searchQuery]);

    useLayoutEffect(() => {
        console.log("useLayoutEffect[paperListType]");
        if (offset === 0) {
            if (paperListType === "cats") {
                fetchData(offset, pageSize);
            } else if (paperListType === "searchResults") {
                fetchSearch(searchQuery, offset, pageSize);
            }
        } else {
            setOffset(0);
        }
    }, [paperListType]);

    useLayoutEffect (() => {
        console.log("useLayoutEffect[offset]: " + paperListType);
        pausePaperListPapers();

        if (paperListType === "cats") {
            fetchData(offset, pageSize);
        } else if (paperListType === "searchResults") {
            fetchSearch(searchQuery, offset, pageSize);
        }
//    }, [offset, paperListType, searchQuery]); // TODO: Delete this line after prod deploy
    }, [offset]);

    useLayoutEffect(() => {
        console.log("useLayoutEffect[JSON.stringify(items)]");
        if (items.length === 0) {
            return;
        }

        setHidePreviews(items.map(obj => true));
        setIsPlayingPaperPlays(items.map(obj => false));

        setPreviewRefs(
            Array(items.length).fill().map((_, i) => createRef())
        );

        setPreviewPopupRefs(
            Array(items.length).fill().map((_, i) => createRef())
        );

        setPaperPlayRefs(refs => {
            let newRefs = [];
            for (let i = 0; i < items.length; i++) {
                let url = items[i].url;
                let newRef = createRef();
                newRef.current = new Audio();
                newRef.current.preload = "none";
                newRef.current.src = url;
                newRefs.push(newRef);
            }

            return newRefs;
        });
    }, [JSON.stringify(items)]);

    useLayoutEffect(() => {
        console.log("useLayoutEffect[hidePreviews, previewRefs, previewPopupRefs]");
        for (let i = 0; i < items.length; i++) {
            if (hidePreviews[i]) {
                continue;
            }

            if (!previewRefs[i] || !previewRefs[i].current) {
                continue;
            }

            if (!previewPopupRefs[i] || !previewPopupRefs[i].current) {
                continue;
            }

            let abstractLink = previewRefs[i].current;
            let popup = previewPopupRefs[i].current;

            positionPopupNearAbstractLink(abstractLink, popup);
        }
    }, [hidePreviews, previewRefs, previewPopupRefs]);

    return (
        <div className="mainContentArea">
            <PaperListNav
                category = {category}
                setCategory = {setCategoryFromClient}
                total = {total}
                offset = {offset}
                pageSize = {pageSize}
                position = "top"
                nextPageFn = {(e) => setOffset(offset + pageSize)}
                prevPageFn = {(e) => setOffset(Math.max(0, offset - pageSize))}
                searchQuery = {searchQuery}
                setSearchQuery = {setSearchQuery}
                paperListType = {paperListType}
                paperListUiRef = {paperListUiRef}
            />

            <SearchDisplayMessage
                searchQuery = {searchQuery}
                setSearchQuery = {setSearchQuery}
                paperListType = {paperListType}
                setPaperListType = {setPaperListType}
            />

            <PaperListMain
                items = {items}
                playlist = {playlist}
                isPlaying = {isPlaying}
                setIsPlaying = {setIsPlaying}
                addToPlaylist = {addToPlaylist}
                removeFromPlaylist = {removeFromPlaylist}
                paperPlayRefs = {paperPlayRefs}
                isPlayingPaperPlays = {isPlayingPaperPlays}
                setIsPlayingPaperPlays = {setIsPlayingPaperPlays}
                previewRefs = {previewRefs}
                hidePreviews = {hidePreviews}
                setHidePreviews = {setHidePreviews}
                inPopup = {inPopup}
                previewPopupRefs = {previewPopupRefs}
            />

            <PaperListNav
                category = {category}
                setCategory = {setCategoryFromClient}
                total = {total}
                offset = {offset}
                pageSize = {pageSize}
                position = "bottom"
                nextPageFn = {(e) => setOffset(offset + pageSize)}
                prevPageFn = {(e) => setOffset(Math.max(0, offset - pageSize))}
            />

            <ExploreCats
                setCategoryFn = {setCategoryFromClient}
                currentCat = {category}
            />

            <PodcastSubs subsRef = {subsRef} />
        </div>
    );
}

const SearchDisplayMessage = (props) => {
    const {searchQuery, paperListType, setSearchQuery, setPaperListType} = props;

    let isMediumPlusSize = useMediaPredicate('(min-width: 600px)');

    if (paperListType !== "searchResults") {
        return (<> </>);
    }

    if (searchQuery === "") {
        return (<> </>);
    }

    return (
        <>
          <div className="searchDisplayMessage">
            <span className="searchShowMsg">{isMediumPlusSize ? "Showing papers that match:" : "searched for:"}</span>
            <span className="searchDisplayQuery">{searchQuery}</span>
            <Link className="searchClearLink"
                onClick={(e) => {{setSearchQuery("")} {setPaperListType("cats")}}}>{isMediumPlusSize ? "clear search" : "clear"}</Link>
          </div>
        </>
    );

}

export {MainContentArea};