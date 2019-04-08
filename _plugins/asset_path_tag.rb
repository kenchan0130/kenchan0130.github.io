# Title: Asset path tag for Jekyll
# Authors:
#     Sam Rayner http://samrayner.com
#     Otto Urpelainen http://koti.kapsi.fi/oturpe/projects/
#
# Description: Output a relative URL for assets based on the post or page
#
# Syntax
#    {% asset_path filename post_id %}
#    {% asset_path "filename with whitespace" post_id %}
#
# Examples:
# {% asset_path kitten.png %} on post 2013-01-01-post-title
# {% asset_path pirate.mov %} on page page-title
# {% asset_path document.pdf /2012/05/25/another-post-title %}
# {% asset_path "document with spaces in name.pdf" /2012/05/25/another-post-title %}
#
# Output:
# /assets/posts/2013-01-01/post-title/kitten.png
# /assets/page-title/pirate.mov
# /assets/posts/2012-05-25/another-post-title/document.pdf
# /assets/posts/2012-05-25/another-post-title/document with spaces in name.pdf
#
module Jekyll
  class AssetPathTag < Liquid::Tag
    def initialize(tag_name, markup, tokens)
      # strip leading and trailing spaces
      @markup = markup.strip.tap do |m|
        raise ArgumentError, 'Error processing input, expected syntax lile: {% asset_path filename post_id %}' if m.empty?
      end
      super
    end

    def render(context)
      # render the markup
      parameters = Parameters.new(Liquid::Template.parse(@markup).render(context).strip)

      page = context.environments.first['page']
      path = "posts/#{page['url']}"

      # strip filename
      path = File.dirname(path) if path.match?(/\.\w+\z/)

      # fix double slashes
      "#{context.registers[:site].config['baseurl']}/assets/#{path}/#{parameters.filename}".gsub(%r{\/{2,}}, '/')
    end

    private

    class Parameters
      def initialize(parameters)
        @parameters = parameters
        @filename, @post_id = parameters.split(/\s+/)
      end

      def filename
        if quoted?
          @parameters[1...last_quote_index]
        else
          @filename
        end
      end

      def post_id
        if quoted?
          @parameters[(last_quote_index + 1)..-1].strip
        else
          @post_id.to_s
        end
      end

      private

      def last_quote_index
        @parameters.rindex(@parameters[0])
      end

      def quoted?
        ['"', "'"].include?(@parameters[0])
      end
    end
  end
end

Liquid::Template.register_tag('asset_path', Jekyll::AssetPathTag)
