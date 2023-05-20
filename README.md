# Booru extension

Extends the functionality of image booru sites (e.g., derpibooru).

Some features include:
- Show tags for each image on the search page
- Highlight images that contain specified tags
- Collect and tag images via Eagle DAM integration

## Supported Boorus

The following boorus are officially supported by this extension:
- derpibooru
- manebooru

Other boorus may work with this extension.

## Eagle Integration

We support saving images to the [Eagle](https://eagle.cool/) digital asset management software via its api.

### Requirements

Eagle must be running on the same computer as the browser extension and must be listening to API requests at [http://localhost:41595/](http://localhost:41595/).

## Building and Running Locally

Install NPM packages

```pwsh
npm install
```

Build

```pwsh
npm run build
```

In the browser, load unpacked extension from the `./dist` folder.
