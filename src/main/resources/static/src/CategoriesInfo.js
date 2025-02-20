const CATS_INFO = [
    {cat: "cs.AR", label: "Architecture"},
    {cat: "cs.AI", label: "Artificial Intelligence"},
    {cat: "cs.DB", label: "Databases"},
    {cat: "cs.DC", label: "Distributed Systems"},
    {cat: "cs.NI", label: "Networking"},
    {cat: "cs.OS", label: "Operating Systems"},
    {cat: "cs.PL", label: "Programming Languages"}
];

function getCatNames() {
    let ret = [];
    for (let i = 0; i < CATS_INFO.length; i++) {
        ret.push(CATS_INFO[i].cat);
    }

    return ret;
}

export {CATS_INFO, getCatNames};