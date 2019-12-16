require 'nokogiri'

module JekyllFancybox
  class Translator
    def initialize(document)
      @document = document
    end

    def translate
      nokogiri_doc.css('.post img').each do |node|
        apply_fancybox(node)
      end
      nokogiri_doc.to_html
    end

    private

    def apply_fancybox(node)
      src = node.attributes['data-src'] # Support jekyll-lazy-load-image
      src = node.attributes['src'] if src.nil?
      return if src.nil?

      alt = node.attributes['alt']
      a_node = Nokogiri::XML::Node.new 'a', nokogiri_doc
      a_node['href'] = src.value
      a_node['data-fancybox'] = 'images'
      a_node['data-caption'] = alt.value if alt
      node.wrap(a_node.to_html)
    end

    def nokogiri_doc
      @nokogiri_doc ||= Nokogiri::HTML(@document)
    end
  end
end

Jekyll::Hooks.register(:posts, :post_render) do |post|
  post.output = JekyllFancybox::Translator.new(post.output).translate
end
