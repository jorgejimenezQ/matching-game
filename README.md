## Fantasy Match

# deploying

```bash
# Commit all changes
$ git add .;commit -m "message ..."; git push -u origin main
# Build:
$ yarn run build
# Add dist folder:
$ git add dist -f
$ yarn run build
```

```bash
$ git commit -m "Adding dist"
$ git subtree push --prefix dist origin gh-pages
```
