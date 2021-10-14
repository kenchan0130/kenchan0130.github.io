require 'yamllint/rake_task'
require 'html-proofer'

YamlLint::RakeTask.new do |t|
  t.paths = %w[
    **/*.yaml
    **/*.yml
  ]
  t.exclude_paths = %w[
    vendor/bundle/**/*
    node_modules/**/*
  ]
end

namespace :htmlproofer do
  html_proofer_options = {
    typhoeus: {
      headers: {
        # macOS Gooogle Chrome Latest
        'User-Agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.3'
      }
    },
    hydra: {
      # default max_concurrency is 50, but github.com often returns too many request status...
      max_concurrency: 5
    },
    check_html: true,
    check_img_http: true,
    check_favicon: true,
    assume_extension: true,
    check_opengraph: true,
    http_status_ignore: [
      401
    ]
  }

  desc 'Run htmlproofer without external link'
  task :without_external_link, ['directory'] do |_, args|
    HTMLProofer.check_directory(args.directory, html_proofer_options.merge(disable_external: true)).run
  end

  desc 'Run htmlproofer with external link'
  task :with_external_link, ['directory'] do |_, args|
    HTMLProofer.check_directory(args.directory, html_proofer_options).run
  end
end
