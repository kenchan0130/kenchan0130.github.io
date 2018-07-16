require 'jekyll'
require 'nokogiri'

class AutoLazyLoadImage
  def self.from_config(document, config)
    auto_lazy_load_image_config = config&.[]('auto_lazy_load_image')
    new(
      document,
      {
        default_image: auto_lazy_load_image_config&.[]('default_image'),
        attr_name: auto_lazy_load_image_config&.[]('attr_name'),
        classes: auto_lazy_load_image_config&.[]('class')
      }
    )
  end

  def initialize(document, options = {})
    @document      = document
    @default_image = options&.[](:default_image)
    @attr_name     = options&.[](:attr_name)
    @classes       = Array(options&.[](:classes)).compact
  end

  def attr_name
    @attr_name ||= 'data-src'
  end

  def default_image
    @default_image ||= ''
  end

  def replace_html
    nokogiri_doc.xpath('//img').each do |node|
      apply_lazy_load_image(node)
    end
    nokogiri_doc.to_html
  end

  private

  def apply_lazy_load_image(node)
    src_value = node.attributes['src'].value
    if default_image.empty?
      node.remove_attribute('src')
    else
      node.attributes['src'].value = default_image
    end
    class_value = node.attributes['class']&.value
    node.set_attribute('class', '') unless class_value
    node_class_attr = node.attributes['class']
    class_array = [node_class_attr.value, @classes].flatten.reject do |class_name|
      class_name.nil? || class_name.empty?
    end
    node_class_attr.value = class_array.join(' ')

    node.set_attribute(attr_name, src_value)
  end

  def nokogiri_doc
    @nokogiri_doc ||= Nokogiri::HTML(@document)
  end
end

Jekyll::Hooks.register :posts, :post_render do |document|
  auto_lazy_load_image = AutoLazyLoadImage.from_config(document.output, document.site.config)
  document.output = auto_lazy_load_image.replace_html
end
