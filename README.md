# kenchan0130.github.io [![CircleCI](https://circleci.com/gh/kenchan0130/kenchan0130.github.io/tree/development.svg?style=svg)](https://circleci.com/gh/kenchan0130/kenchan0130.github.io/tree/development) [![Greenkeeper badge](https://badges.greenkeeper.io/kenchan0130/kenchan0130.github.io.svg)](https://greenkeeper.io/)

This is kenchan0130's web developer blog.

## Powered by

- [jekyll](https://jekyllrb.com/) - Static web site generator
- [centrarium](https://github.com/bencentra/centrarium) - A simple yet classy theme for your Jekyll website or blog.

## How to develop and write

```sh
bundle install --path=vendor/bundle
bundle exec jekyll s --watch --future
```

## Test

```sh
bundle exec jekyll build --config "_config.yml,_config_production.yml"
bundle exec htmlproofer ./_site/ --check-html --check-img-http --assume-extension
```

## Deployment

I use [rake-jekyll](https://github.com/jirutka/rake-jekyll) with CircleCI.

Please check `Rakefile` and `.circleci/config.yml` for more detail.
