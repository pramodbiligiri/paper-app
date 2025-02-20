import {useMediaPredicate} from 'react-media-hook';
import {Button} from '@material-ui/core';
import {Select, MenuItem, Checkbox, ListItemText} from '@material-ui/core';
import React, {useState, useLayoutEffect, useRef} from 'react';
import {CATS_INFO, getCatNames} from "./CategoriesInfo";

const PaperListNav = (props) => {

    const {total, offset, pageSize, position, nextPageFn,
        prevPageFn, searchQuery, setSearchQuery,
        paperListType, category, setCategory, paperListUiRef} = props;

    return (
        <div ref={paperListUiRef} className={position === "top" ?
             ("paperListNav " + (paperListType === "searchResults" ? " paperListNavCenter" : "")) : "paperListNavBottom"}>
          {position === "top" ?
              <CategoryNav
                  category = {category}
                  key = {JSON.stringify(category)}
                  setCategory = {setCategory}
                  searchQuery = {searchQuery}
                  setSearchQuery = {setSearchQuery}
                  paperListType = {paperListType}
              />
              : <></>
          }
          <Pager
              total = {total}
              offset = {offset}
              pageSize = {pageSize}
              position = {position}
              nextPageFn = {nextPageFn}
              prevPageFn = {prevPageFn}
          />
        </div>
    );
}

const CategoryNav = (props) => {

    const {category, setCategory, searchQuery, setSearchQuery, paperListType} = props;

    const isMediumPlusSize = useMediaPredicate('(min-width: 600px)');

    const [localCats, setLocalCats] = useState(
        category.includes("all") ? ["all"].concat(getCatNames()) : [...category]
    );

    const searchInputRef = useRef(null);

    const catLabels = [
        {cat: "all", label: "SELECT ALL"},
        ...CATS_INFO
    ];

    const updateLocalCats = (event, value) => {
        const opt = event.target;

        // If user has modified the ALL option
        if ("all" === value) {
            if (opt.checked) {
                setLocalCats(catLabels.map(catLabel => catLabel.cat));
            } else {
                setLocalCats(current => current.filter(item => item !== "all"));
            }
            return;
        }

        // User has NOT clicked on ALL
        if (opt.checked && localCats.includes(value)) {
            // No Op
            return;
        }

        if (opt.checked && !localCats.includes(value)) {
            // Add option to selected cats
            setLocalCats(cats => [...cats, value]);
            return;
        }

        if (!opt.checked) {
            // Remove option from selected cats
            let index = localCats.indexOf(value);
            if (index >= 0) {
               setLocalCats(cats =>
                  cats.filter(cat => (cat !== value && cat !== "all"))
               );
            }
        }
    }

    const updateCategories = (event, newCats) => {
        if (localCats.includes("all")) {
            setCategory(["all"]);
        } else {
            setCategory(newCats);
        }
    }

    const selectRenderFunc = () => {
        let truncateLength = isMediumPlusSize ? 35 : 17; // 18 was old value

        if (localCats.includes("all")) {
            return "Browsing all topics";
        }

        let retcats = [];
        for (let i = 0; i < catLabels.length; i++) {
            let catLabel = catLabels[i];
            if (catLabel.label === "all") {
                continue;
            }

            if (localCats.includes(catLabel.cat)) {
                retcats.push(catLabel.label);
            }
        }

        let concat = retcats.join(", ");
        if (concat.length < truncateLength) {
            return concat;
        }

        return concat.substring(0, truncateLength-3) + "...";
    }

    const setSearchState = (event) => {
        if (!searchInputRef || !searchInputRef.current || searchInputRef.current.value.trim() === "") {
            return;
        }

        setSearchQuery(searchInputRef.current.value.trim());
    }

    useLayoutEffect(() => {
        if (!searchInputRef || !searchInputRef.current) {
            return;
        }

        if (paperListType === "searchResults" && searchQuery !== "") {
            searchInputRef.current.value = searchQuery;
        } else {
            searchInputRef.current.value = "";
        }
    });

    if (paperListType === "cats") {
        return (
            <div className="catSelectWrapTop">
              <span className="categoriesLabel">Topics:</span>

              <Select multiple className="catSelector"
                  native = {false}
                  displayEmpty = {true}
                  value = {catLabels}
                  renderValue = {selectRenderFunc}
                  inputProps = {{className: "catSelectInput"}}
              >
                  {catLabels.map((catLabel, i) => {
                      return (
                          <MenuItem value={catLabel.cat}>
                            <Checkbox
                              onClick={(e) => updateLocalCats(e, catLabel.cat)}
                              checked={localCats.includes(catLabel.cat)}
                            />
                            <ListItemText className="catListItemLabel" primary={catLabel.label} />
                          </MenuItem>
                      );
                  })}
                  <Button variant="contained" color="primary" className="catApplyButton"
                      onClick={(e) => updateCategories(e, localCats)}
                  >Apply</Button>
              </Select>
              <span>
                 <input type="text" ref={searchInputRef} className="searchInput" />
                 <Button variant="outlined" className="searchBtn"
                     onClick={setSearchState}>{isMediumPlusSize ? "Search for papers" : "Search"}</Button>
              </span>
             </div>
        );
    } else {
        return (
          <span className="searchInputOnly">
             <input type="text" ref={searchInputRef} className="searchInput" />
             <Button variant="outlined" className="searchBtn"
                 onClick={setSearchState}>{isMediumPlusSize ? "Search for papers" : "Search"}</Button>
          </span>
        );
    };
}

const Pager = (props) => {

    const {total, offset, pageSize, nextPageFn, prevPageFn, position} = props;

    // offset+1 below because it is indexed from 0
    let currentPage = Math.max(Math.ceil((offset+1)/pageSize), 1);

    let totalPages = Math.max(Math.ceil(total/pageSize), 1);

    let isMediumPlusSize = useMediaPredicate('(min-width: 600px)');

    let pageStr = isMediumPlusSize ? "Page" : "Pg";

    const getBottom = () => {
        return position === "bottom" ? "pagerNextPrevBottom" : "";
    }

    if (position === "top") {
        return (<> </>);
    }

    return (
          <div className={"pagerBoxWrapCommon pagerBoxWrap" + (position === "top" ? "Top" : "Bottom")}>
            <div className="pagerBox">
                <Button
                   className = {currentPage > 1 ? "pagerNextPrev " + (getBottom()) : "pagerNextPrev pagerNextPrevDisabled"}
                   disabled  = {currentPage === 1}
                   onClick   = {prevPageFn}>Prev</Button>
                <span
                   className = {"pagerText pagerText" + (position === "top" ? "Top" : "Bottom")}>{pageStr} {currentPage} of {totalPages}</span>
                <Button
                    className = {currentPage < totalPages ? "pagerNextPrev pagerNext " + (getBottom())
                      : "pagerNextPrev pagerNext pagerNextPrevDisabled "}
                    disabled  = {currentPage === totalPages}
                    onClick   = {nextPageFn}>Next</Button>
            </div>
          </div>
    );
}

export {PaperListNav, CategoryNav, Pager};