# Supplemental docs

https://developer.chrome.com/docs/extensions/

## Booru notes

On the search page, the images are within a `div.imagecontainer`. On an image page, the image is
within a `div.image-show-container`.

On that container, we expect to find the following attributes:
- data-aspect-ratio
- data-comment-count
- data-created-at
- data-downvotes
- data-faves
- data-height
- data-image-id
- data-image-tag-aliases
- data-image-tags
- data-score
- data-size
- data-source-url
- data-tag-count
- data-upvotes
- data-uris : {"full":"https://derpicdn.net/img/view/2022/11/17/2989253.png","large":"url",...}
- data-width
