class Item {

    constructor(props) {
        const {url, paperId, title, duration, key, authors, pubDate, link, abstract, categories} = props;

        this.url = url;
        this.paperId = paperId;
        this.title = title;
        this.duration = duration;
        this.key = key;
        this.authors = authors;
        this.pubDate = pubDate;
        this.link = link;
        this.abstract = abstract;
        this.categories = categories;
    }
}

export {Item};