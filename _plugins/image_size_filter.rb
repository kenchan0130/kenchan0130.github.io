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
      FastImage.size(uri)[fast_image_index]
    end
  end
end

Liquid::Template.register_filter(Jekyll::ImageSizeFilter)
