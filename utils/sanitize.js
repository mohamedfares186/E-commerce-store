import sanitizeHTML from "sanitize-html";

const sanitize = (html) => {
    return sanitizeHTML(html, {
        allowedTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'img', 'ul', 'li', 'ol'],
        allowedAttributes: {
            img: ['src', 'alt', 'width', 'height', 'loading'],
            ul: ['class'],
            li: ['class'],
            ol: ['class']
        },
    });
};

export default sanitize;