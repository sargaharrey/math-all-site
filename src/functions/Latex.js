class PatternDetector {
    constructor(pattern) {
        this.pattern = pattern;
    }

    match(inputString) {
        return this.pattern.test(inputString);
    }
}

class latexDetector extends PatternDetector {
    constructor() {
        super(/(\\[a-zA-Z]+|\$.*?\$|\\\[.*?\\\]|\\\(.*?\\\))/);
    }
}

const latexDetectorIns = new latexDetector();

function containsPattern(inputString, detector = latexDetectorIns) {
    return detector.match(inputString);
}

export default containsPattern;
