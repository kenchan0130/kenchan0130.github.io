require 'fileutils'
require 'rake-jekyll'
require 'yamllint/rake_task'
require 'html-proofer'
require 'pry'

jekyll_configs_for_deply = [
  '_config.yml',
  '_config_production.yml'
]
jekyll_build_destination_path = ENV['JEKYLL_BUILD_DESTINATION_PATH']

Rake::Jekyll::GitDeployTask.new(:deploy) do |t|
  # Deploy the built site into remote branch named 'gh-pages', or 'master' if
  # the remote repository URL matches `#{gh_user}.github.io.git`.
  # It will be automatically created if not exist yet.
  t.deploy_branch = 'master'

  # The commit message will contain hash of the source commit.
  t.commit_message = -> {
    "[ci skip] Built from #{`git rev-parse --short HEAD`.strip}"
  }

  t.committer = 'kenchan0130 by CI <>'

  t.build_script = ->(dest_dir) {
    has_built = false

    t.send(:do_in_working_dir) do
      if jekyll_build_destination_path && File.exist?(jekyll_build_destination_path)
        Rake.sh "cp -rp #{File.join(jekyll_build_destination_path, '*')} #{dest_dir}"
        has_built = true
      end
    end

    next if has_built

    puts "\nRunning Jekyll..."
    Rake.sh "bundle exec jekyll build --verbose --config '#{jekyll_configs_for_deply.join(',')}' --destination #{dest_dir}"
  }

  # Use URL of the 'origin' remote to fetch/push the built site into. If env.
  # variable GH_TOKEN is set, then it adds it as a userinfo to the URL.
  t.remote_url = 'git@github.com:kenchan0130/kenchan0130.github.io.git'
end

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
    typhoeus: {},
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
