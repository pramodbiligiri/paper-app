import React from 'react';
//import {Link} from "react-router-dom";
import {Link} from '@material-ui/core';
import {CATS_INFO} from "./CategoriesInfo";

const ExploreCats = (props) => {

    const {setCategoryFn, currentCat} = props;

    const onCategoryClick = (event, catName) => {
        if (currentCat.length === 1 && currentCat[0] === catName) {
            return;
        }

        setCategoryFn([catName]);
    }

    return (
      <div className="exploreCatsWrap">
        <span className={currentCat.length === 1 && currentCat[0] === "all" ? "exploreCatLinkWrapCurrent" : "exploreCatLinkWrap"}>
          <Link color="inherit" className={currentCat.length === 1 && currentCat[0] === "all" ? "exploreCatLinkCurrent" : "exploreCatLink"}
            onClick={e => onCategoryClick(e, "all")}>ALL TOPICS</Link>
        </span>
        {CATS_INFO.map(catInfo => {
          return (
              <span className={currentCat.length === 1 && currentCat[0] === catInfo.cat ? "exploreCatLinkWrapCurrent" : "exploreCatLinkWrap"}>
                <Link color="inherit" className={currentCat.length === 1 && currentCat[0] === catInfo.cat ? "exploreCatLinkCurrent" : "exploreCatLink"}
                  onClick={e => onCategoryClick(e, catInfo.cat)}>{catInfo.label}</Link>
              </span>
          );
        })}
      </div>
    );
}

export {ExploreCats};