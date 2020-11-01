# kenchan0130.github.io [![CI](https://github.com/kenchan0130/kenchan0130.github.io/workflows/CI/badge.svg)](https://github.com/kenchan0130/kenchan0130.github.io/actions?query=workflow%3ACI) [![Nigthly](https://github.com/kenchan0130/kenchan0130.github.io/workflows/Nigthly/badge.svg)](https://github.com/kenchan0130/kenchan0130.github.io/actions?query=workflow%3ANigthly)

This is kenchan0130's Web developer blog.

## Powered by

- [jekyll](https://jekyllrb.com/) - Static Web site generator
- [centrarium](https://github.com/bencentra/centrarium) - A simple yet classy theme for your Jekyll website or blog
- [GitHub Pages](https://pages.github.com/) - Host directly site from your GitHub repository

## How to develop and write

```sh
$ bundle install --path=vendor/bundle
$ yarn
$ yarn start
```

## Test

```sh
$ bundle exec jekyll build --config "_config.yml,_config_production.yml"
$ bundle exec rake htmlproofer:with_external_link[_site]
```

## Deployment

If sources are changed at `development` branch, GitHub Actions deploys `master` branch as GitHub Pages.

## Licence

The content of this project itself is licensed under the [Creative Commons Attribution 4.0 International (CC-BY-4.0) License](https://creativecommons.org/licenses/by/4.0/), and the underlying source code used to format and display that content is licensed under the [MIT license](LICENSE.md).
