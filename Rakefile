require 'rake-jekyll'
require 'yamllint/rake_task'

jekyll_configs_for_deply = [
  '_config.yml',
  '_config_production.yml'
]

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
  ]
end
