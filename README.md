# kenchan0130.github.io [![CircleCI](https://circleci.com/gh/kenchan0130/kenchan0130.github.io/tree/development.svg?style=svg)](https://circleci.com/gh/kenchan0130/kenchan0130.github.io/tree/development)

This is kenchan0130's Web developer blog.

## Powered by

- [jekyll](https://jekyllrb.com/) - Static Web site generator
- [centrarium](https://github.com/bencentra/centrarium) - A simple yet classy theme for your Jekyll website or blog
- [CircleCI](https://circleci.com) - Continuous integration service
- [Dependabot](https://dependabot.com/) - Automated dependency updates
- [GitHub Pages](https://pages.github.com/) - Host directly site from your GitHub repository

## How to develop and write

```sh
bundle install --path=vendor/bundle
bundle exec jekyll s --watch --future
```

## Test

```sh
bundle exec jekyll build --config "_config.yml,_config_production.yml"
bundle rake htmlproofer:with_external_link[_site]
```

## Deployment

I use [rake-jekyll](https://github.com/jirutka/rake-jekyll) with CircleCI.

Please check `Rakefile` and `.circleci/config.yml` for more detail.
