# Gallery Page

Steps to constructing a gallery page:

1. Create a folder in your `site` to house your gallery page.

1. Create an `index.html` file in that folder to be your gallery page.

1. Imbue this file with the `{header}`, `{footer}` and `{galleryContainer}` (`{galleryContainer}` will probably sit in between the header and footer).

1. Create an `image` directory in your gallery page's folder and place the images you wish to display in that folder.

1. Create a file called `metadata.json` in your gallery page's folder.

1. Your `metadata.json` file, at a minimum, needs to contain the filenames themselves, and `alt` descriptions, e.g.:
    
    ```
    [{
        "image": "myimage.jpg",
        "alt": "text describing my image",
    }, {
        "image": "my-other-image.jpg",
        "alt": "text describing my other image",
    }]
    ```

    Every file the `metadata.json` file describes must exist. You can also add `title` and `description` properties:

    ```
    [{
        "image": "myimage.jpg",
        "alt": "text describing my image",
        "title": "Wow!",
        "description": "I took this picture myself!"
    }, {
        "image": "my-other-image.jpg",
        "alt": "text describing my other image",
    }, ...]
    ```

    Doing so will add a couple more elements to your image when it's rendered to the page for the title and description.

1. As with any other page, you can add a `css` folder within this page's folder and create a `page.css` file within it to be used to format and style your gallery page.