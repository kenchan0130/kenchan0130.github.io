require 'uri'

module Jekyll
  module AssignUrlParamFilter
    def assign_url_param(url, key, value)
      raise ArgumentError, 'The key must be non empty value.' if key.empty?

      uri = URI.parse(url)
      query = uri.query.nil? ? {} : Hash[URI.decode_www_form(uri.query)]
      uri.query = URI.encode_www_form(query.update(key => value))
      uri.to_s
    end
  end
end

Liquid::Template.register_filter(Jekyll::AssignUrlParamFilter)
