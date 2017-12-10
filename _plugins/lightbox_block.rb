# A Liquid block for Jekyll sites that allows embedding Lightbox images.
#
# Example usage:
# {% lightbox %}
# ![Title of Image](/assets/test.jpg)
# {% endlightbox %}
#
# {% lightbox %}
# <img src="/assets/test.jpg" alt="Title of Image">
# {% endlightbox %}
#
# {% lightbox, Title of Image %}
# ![Alt of Image](/assets/test.jpg)
# {% endlightbox %}
#
module Jekyll
  class LightboxBlock < Liquid::Block
    def initialize(tag_name, markup, token)
      super
      @title, @path = markup.split(',').map(&:strip)
    end

    def render(context)
      output = super
      path = @path || output.match(/!\[.*?\].*\((.*?)\)/)&.[](1) || output.match(/<img.*src\s*=\s*[\"|\'](.*?)[\"|\'].*>/)&.[](1)
      raise 'Not found image path for ligthbox' if path.to_s.empty?
      title = @title || output.match(/!\[(.*?)\].*\(.*?\)/)&.[](1) || output.match(/<img.*alt\s*=\s*[\"|\'](.*?)[\"|\'].*>/)&.[](1)

      %(<a href="#{path}" rel="lightbox" title="#{title}">#{output}</a>)
    end
  end
end

Liquid::Template.register_tag('lightbox', Jekyll::LightboxBlock)
