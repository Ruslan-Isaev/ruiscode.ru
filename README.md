# RUIS personal website

Static bilingual personal portfolio with a dark-only design. No build tools or dependencies are required.

## Run locally

The language files are loaded with `fetch`, so serve this folder over HTTP instead of opening `index.html` directly. For example:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Edit text and links

Edit `content/ru.json` and `content/en.json`. Each file contains:

- `messages`: interface labels and page text;
- `content.links`: social links and contact address;
- `content.projects`: projects, descriptions, tags, and project URLs;
- `content.stack`, `content.facts`, and `content.hardware`: portfolio details.

Both language files use the same structure. The site layout and styling are shared, so links, projects, and other repeated elements can be changed in both locale files without duplicating the HTML page.
