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
        'User-Agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36'
      }
    },
    check_html: true,
    check_img_http: true,
    check_favicon: true,
    assume_extension: true,
    check_opengraph: true
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
