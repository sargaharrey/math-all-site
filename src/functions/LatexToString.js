

 import katex from 'katex';


function latexToPlainText(latexString) {


    try {
        // Render LaTeX to HTML
        const htmlString = katex.renderToString(latexString, {
            throwOnError: false
        });

        // Convert HTML to plain text by removing tags
        const tempElement = document.createElement("div");
        tempElement.innerHTML = htmlString;

        // Katex often renders the main content in an element with the class '.katex-html',
        // so you can target that to get the visual representation.
        const katexHtml = tempElement.querySelector('.katex-html');

        // If .katex-html element is found, return its text content; otherwise, return the full content.
        return (katexHtml ? katexHtml.textContent : tempElement.textContent) || "";

    } catch (error) {
        console.error("Error rendering LaTeX:", error);
        return '';  // Or any error handling you'd prefer
    }
}
export default latexToPlainText