# Posse
## Pretty simple static site generation

Posse was built to make it easy to build and distribute a statically generated website that has HTTPS and a robust CDN.

It is built around these ideas:
- Directory structure matches website structure
- "types" of pages
- Templatizing and Fragments
- Design is completely through CSS
- HTML is semantic but should not be restrictive to designing pages
- Developing your page
- Built in scripts to push to S3 and Cloudfront

## How to start

Run this in your development directory, replacing `mycoolwebsite.com` with the name of your website.

`git clone git@github.com:dclowd9901/posse.git mycoolwebsite.com`

## Directory structure

In order to make Posse as simple as possible, it is built to use the directory structure of the `site` directory as the navigation structure of the website. 

What that means:

If a user visits `yourwebsite.com`, they are viewing your built site's root `index.html` file. If they visit `yourwebsite.com/some/path`, they are viewing your built site's `some/path/index.html` file. Et cetera, et cetera.

## Types of pages

Currently, the scripting supports two different types of pages (there will be more to come):

- An image gallery page type called `galleryPage`
- An untreated page type, which has no need for description

We denote a page's type by putting, at the top of the `index.html` file with a pragma mark:

```
<!-- pageType: galleryPage -->
```

This tells the build script what kind of page this is, and what tokens to look for, which we'll get into right now.

## Templatizing and fragments

To help the build engine put the page together, we tell it where to place certain aspects of the page.

For all pages, there are two tokens:

`{header}` - This is the token that places your website's header. Your header includes your shared CSS and static assets, as well as site metadata. It will probably also carry a consistent `header` element that is used on each page of your site.

`{footer}` - This is the token that places your website's footer. Your footer will close out the document, and will probably also carry the `footer` element used throughout your site.

Every page is capable of receiving a header and footer, but not required to. If you want the page to have a header and footer, use the above tokens.


### Page-specific tokens 

 - `galleryPage`
    - `{galleryContainer}` - provides the markup generated from images and their metadata.

### CSS 

CSS exists at two levels:

1. `base.css`. This CSS file exists in the `site/shared`. You use this file to describe shared styles like site-wide font treatment, background and header/footer style.

1. `page.css`. Each directory (or route, if you prefer) has a `page.css` file inside of a respective `css` directory. This file is specific to that page. You should use this file to describe layout and design specific to that page.

### Semantic HTML

Insofar as they can, the build scripts generate semantic HTML. The structure is very simple, and should not be be intrusive to any layout style or design. Use your CSS to design the page the way you want it to be.

### Developing

The development loop for your site looks like this:

1. Run `yarn dev`.
1. Go to the `build` folder.
1. Open `index.html` of page you want to preview in a browser.
1. Make changes (they will auto generate a new build).
1. Refresh page to see changes.

### Deploying

Please see the [Deploying doc](./docs/deploy.md).
