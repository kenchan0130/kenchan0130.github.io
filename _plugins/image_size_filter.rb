require 'fastimage'

module Jekyll
  module ImageSizeFilter
    def image_size(path, size_attribute)
      fast_image_index = case size_attribute
                         when 'width'
                           0
                         when 'height'
                           1
                         else
                           raise ArgumentError, "#{size_attribute} is not valid attribute name."
                         end

      uri = if path.match?(%r{\A(?:http(s)?://)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\\]@!\$&'\(\)\*\+,;=.]+\z})
              path
            else
              File.join(Dir.pwd, path)
            end
      size_info = FastImage.size(uri)
      raise ArgumentError, "Not found #{uri} image in #{@context.environments.first.page.url}. Please check the image path." if size_info.nil?

      size_info[fast_image_index]
    end
  end
end

Liquid::Template.register_filter(Jekyll::ImageSizeFilter)
