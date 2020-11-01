require 'pry'
module Jekyll
  module AssetPathFilter
    def asset_path(asset_name)
      page = @context.environments.first.page
      path = File.join(page.collection, page.url)

      # strip filename if path has a filename with file extension
      path = File.dirname(path) if path.match?(/\.\w+\z/)

      # fix double slashes
      "/assets/#{path}/#{asset_name}".gsub(%r{/{2,}}, '/')
    end
  end
end

Liquid::Template.register_filter(Jekyll::AssetPathFilter)
