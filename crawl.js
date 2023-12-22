const { link } = require("fs");
const { url } = require("inspector");
const { JSDOM } = require("jsdom");
const { wordsMatch } = require("./utils");

const visited = new Set();
const crawlPage = async (baseURL, currentURL, pages, query) => {
  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);

  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return pages;
  }

  if (visited.has(currentURL)) {
    return pages;
  }

  console.log(`Activliy crawling ${currentURL}`);

  try {
    const resp = await fetch(currentURL);
    if (resp.status >= 400) {
      console.log(
        `error fetching page on url ${currentURL} with code status ${resp.status}`
      );

      return pages;
    }

    const contentType = resp.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.log(
        `non html response, content-type ${contentType} on page ${currentURL}`
      );
    }
    const htmlBody = await resp.text();

    const nextURLs = getURLsFromHTML(htmlBody, baseURL);
    visited.add(currentURL);
    if (wordsMatch(htmlBody, query) !== 0) {
      pages.push({
        url: currentURL,
        links: nextURLs,
      });
    }

    for (const nextURL of nextURLs) {
      pages = await crawlPage(baseURL, nextURL, pages, query);
    }
  } catch (error) {
    console.log(
      `error fetching page on url ${currentURL}, with message: ${error.message}`
    );
  }

  return pages;
};

const normalizeURL = (urlString) => {
  const urlObj = new URL(urlString);
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1);
  }
  return hostPath;
};

const getURLsFromHTML = (htmlBody, baseURL) => {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");
  linkElements.forEach((link) => {
    if (link.href.slice(0, 1) === "/") {
      // relative
      try {
        const urlObj = new URL(`${baseURL}${link.href.slice(1)}`);
        urls.push(`${baseURL}${link.href.slice(1)}`);
      } catch (error) {
        console.log("error with relative url");
      }
    } else {
      // absolutes
      try {
        const urlObj = new URL(link.href);
        urls.push(link.href);
      } catch (error) {
        console.log("error with absolute url");
      }
    }
  });
  return urls;
};

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
};
