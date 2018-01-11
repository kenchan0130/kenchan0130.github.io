require 'fileutils'
require 'rake-jekyll'
require 'yamllint/rake_task'

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
    "[CI skip] Built from #{`git rev-parse --short HEAD`.strip}"
  }

  t.build_script = ->(dest_dir) {
    has_built = false

    t.public_send(:do_in_working_dir) do
      if jekyll_build_destination_path && File.exist?(jekyll_build_destination_path)
        FileUtils.cp_r(File.join(jekyll_build_destination_path, '*'), dest_dir, { preserve: true, dereference_root: true, verbose: true })
        has_built = true
      end
    end

    next if has_built

    puts "\nRunning Jekyll..."
    Rake.sh "bundle exec jekyll build --verbose --config '#{jekyll_configs_for_deply.join(',')}' --destination #{dest_dir}"
  }

  t.author = 'kenchan0130 by CI <>'

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
  ]
end
