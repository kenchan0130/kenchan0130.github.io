module Jekyll
  module ObjectToHtmlAttributeFilter
    def object_to_html_attribute(object)
      object.map { |k, v| "#{k}=\"#{v}\"" }
    end
  end
end

Liquid::Template.register_filter(Jekyll::ObjectToHtmlAttributeFilter)
