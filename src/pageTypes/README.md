# Page Types

## Article List Page

An article list page is very powerful, as it builds out an entire blog for you.

1. You start off by deciding what you want to call the directory in which you house the main `index.html`. Let's say it's `articles` for the sake of this example. 

    ```
    ...
    site
    |- index.html
    |- articles/
       |- index.html
    ...
    ```
1. The `index.html` file here will become the "base" portion of your blog, showing all of the titles of all of your articles.

1. In the base `index.html` for your article list, you'll use the token `{articleList}` to place the list on the page. This `index.html` file is also used as the basis for formatting your blog posts, and in individual blog posts, the converted Markdown will replace the `{articleList}` token. 

1. When you wish to create a new blog entry, you do so by creating a new Markdown file with the name `YYYYMMDD_<title>`. The nomenclature of this file is important. The date portion will be broken down into a directory structure to represent your blog posts. So, for instance, if you want to write a post with the date October 26, 1985, you'll format it like this: `19851026_the_craziest_thing_just_happened.md`.

    ```
    ...
    site
    |- index.html
    |- articles/
       |- index.html
       |- 19851026_the_craziest_thing_just_happened.md
    ...
    ```

1. Another crucial component in the creation of your blog post is the title of your blog. Because your site should already have the `H1` element occupied by the website title, your blog posts should start with the `H2` element (Markdown `##`). Posse will read this title and make it into the link name that's posted on the blog entries list.

1. If you've done everything correctly, your build folder structure will look like this:

```
    ...
    site
    |- index.html
    |- articles/
       |- 1985
          |- 10
             |- 26
                |- index.html
       |- index.html
    ...
```


## Gallery Page

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

## Untreated Page

There is an "escape hatch" of sorts built into this generator. If you don't denote a page as a supported page type, Posse will still generate it. It's essentially a way to create a fully custom page. The generator will still suppor `{header}` and `{footer}` tokens on the page (if you want them), but it will do no further treatment.