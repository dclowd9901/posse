# Posse - Pretty simple static site generation and deployment

Posse was built to make it easy to build and distribute a statically generated website that has HTTPS and a robust CDN. Development is easy, deployments are fast, and your website will be able to stand up to huge amounts of burst traffic.

It is built around these ideas:
- Directory structure matches website structure
- "Types" of pages
- Templatizing with tokens and fragments
- Design is completely through CSS
- No Javascript out of the box
- HTML is semantic but should not be restrictive to designing pages
- Development is extremely simplistic
- Built in scripts to push to S3 and purge CloudFront distributions

## Getting started

Prereqs:
- [Node](https://nodejs.org/en/download) (18+)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) (2+)

Run this in your development directory, replacing `mycoolwebsite.com` with the name of your website.

Four steps to "Hello, world!":
```
mkdir mycoolwebsite.com && cd mycoolwebsite.com
yarn add @dclowd9901/posse --dev
yarn posse-init
yarn posse-dev
```

## Directory structure

In order to make Posse as simple as possible, it is built to use the directory structure of the `site` directory as the navigation structure of the website. 

What that means:

If a user visits `yourwebsite.com`, they are viewing your built site's root `index.html` file. If they visit `yourwebsite.com/some/path`, they are viewing your built site's `some/path/index.html` file. Et cetera, et cetera.

## Types of pages

Currently, the scripting supports three different types of pages (there will be more to come):

- A blog index page type called `articleList`
- An image gallery page type called `galleryPage`
- An untreated page type, which is basically a custom page of your making

We denote a page's type by putting an HTML comment at the top of the `index.html` file with a pragma mark:

```
<!-- pageType: galleryPage -->
```

This tells the build script what kind of page this is, and what tokens to look for, which we'll get into right now.

You can find further documentation around page types [here](./src/pageTypes/README.md).

## Templatizing and fragments

To help the build engine put the page together, we tell it where to place certain aspects of the page.

For all pages, there are two tokens:

`{header}` - This is the token that places your website's header. Your header includes your shared CSS and static assets, as well as site metadata. It will probably also carry a consistent `header` element that is used on each page of your site.

`{footer}` - This is the token that places your website's footer. Your footer will close out the document, and will probably also carry the `footer` element used throughout your site.

Every page is capable of receiving a header and footer, but not required to. If you want the page to have a header and footer, use the above tokens.

This package comes with a couple of `.frag` files defined in the `fragments` folder (for the header and footer). The markup is pretty simplistic, so odds are you'll want to go in there and set up the HTML you'd prefer to represent your personal header and footer.

When putting together your site, you should be spending most of your time in the `site` folder and the `fragments` folder.

### CSS 

CSS exists at two levels:

1. `base.css`. This CSS file exists in the `site/shared`. You use this file to describe shared styles like site-wide font treatment, background and header/footer style.

1. `page.css`. Each directory (or route, if you prefer) has a `page.css` file inside of a respective `css` directory. This file is specific to that page. You should use this file to describe layout and design specific to that page.

### Semantic HTML

Insofar as they can, the build scripts generate semantic HTML. The structure is very simple, and should not be be intrusive to any layout style or design. Use your CSS to design the page the way you want it to be.

### Developing

The development loop for your site looks like this:

1. Run `yarn posse-dev`.
1. Go to `localhost:8080` in your web browser.
1. Changes should update the site automatically.

### Deploying

Please see the [Deploying doc](./src/docs/deploy.md).

### To do:

- [ ] Add support for images to blogs.
- [ ] Unify logging
- [ ] Add better dev tooling
- [ ] Add tests

